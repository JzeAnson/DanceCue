import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Marker } from "../types/marker";

type UseAudioPlayerOptions = {
  audioRef: RefObject<HTMLAudioElement | null>;
  markers: Marker[];
};

export function useAudioPlayer({ audioRef, markers }: UseAudioPlayerOptions) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMarkerId, setLoopMarkerId] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const sortedMarkers = useMemo(
    () => [...markers].sort((a, b) => a.time - b.time),
    [markers],
  );

  const loopMarker = sortedMarkers.find((marker) => marker.id === loopMarkerId) ?? null;

  const activeMarker = useMemo(() => {
    return sortedMarkers.reduce<Marker | null>((active, marker) => {
      return marker.time <= currentTime ? marker : active;
    }, null);
  }, [currentTime, sortedMarkers]);

  const loadFile = useCallback(
    (file: File) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      audio.src = url;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setLoopMarkerId(null);
    },
    [audioRef],
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio || !audio.src) {
      return;
    }

    await audio.play();
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, [audioRef]);

  const restart = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play();
  }, [audioRef]);

  const seekTo = useCallback(
    (time: number) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      const safeTime = Math.min(Math.max(time, 0), duration || time);
      audio.currentTime = safeTime;
      setCurrentTime(safeTime);
    },
    [audioRef, duration],
  );

  const skipBy = useCallback(
    (seconds: number) => {
      seekTo((audioRef.current?.currentTime ?? 0) + seconds);
    },
    [audioRef, seekTo],
  );

  const jumpToMarker = useCallback(
    (marker: Marker) => {
      seekTo(marker.time);
      void play();
    },
    [play, seekTo],
  );

  const startLoop = useCallback(
    (marker: Marker) => {
      setLoopMarkerId(marker.id);
      jumpToMarker(marker);
    },
    [jumpToMarker],
  );

  const stopLoop = useCallback(() => {
    setLoopMarkerId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => {
      const nextTime = audio.currentTime;
      setCurrentTime(nextTime);

      if (!loopMarker) {
        return;
      }

      const loopIndex = sortedMarkers.findIndex((marker) => marker.id === loopMarker.id);
      const nextMarker = sortedMarkers[loopIndex + 1];
      const loopEnd = nextMarker?.time ?? duration;

      if (loopEnd > loopMarker.time && nextTime >= loopEnd) {
        audio.currentTime = loopMarker.time;
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, duration, loopMarker, sortedMarkers]);

  return {
    activeMarker,
    currentTime,
    duration,
    isPlaying,
    loopMarker,
    jumpToMarker,
    loadFile,
    pause,
    play,
    restart,
    seekTo,
    skipBy,
    startLoop,
    stopLoop,
  };
}
