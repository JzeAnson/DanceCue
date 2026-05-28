import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { MarkerList } from "./components/MarkerList";
import { SourceLoader } from "./components/SourceLoader";
import { VoiceCommandPanel } from "./components/VoiceCommandPanel";
import { YouTubePlayer } from "./components/YouTubePlayer";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useSpeechCommands } from "./hooks/useSpeechCommands";
import type { Marker } from "./types/marker";

const starterMarkers: Marker[] = [
  { id: "intro", name: "Intro", time: 0, endTime: 30 },
  { id: "verse", name: "Verse", time: 30, endTime: 60 },
  { id: "chorus", name: "Chorus", time: 60, endTime: 90 },
  { id: "bridge", name: "Bridge", time: 90, endTime: 120 },
];

const sessionStorageKey = "dancecue:session:v1";

type StoredDanceCueSession = {
  activeSource: "youtube" | null;
  markers: Marker[];
  playbackRate: number;
  updatedAt: number;
  youtubeTime: number;
  youtubeVideoId: string | null;
};

function isStoredMarker(value: unknown): value is Marker {
  if (!value || typeof value !== "object") {
    return false;
  }

  const marker = value as Marker;

  return (
    typeof marker.id === "string" &&
    typeof marker.name === "string" &&
    typeof marker.time === "number" &&
    typeof marker.endTime === "number"
  );
}

function readStoredSession(): StoredDanceCueSession | null {
  const storedValue = window.localStorage.getItem(sessionStorageKey);

  if (!storedValue) {
    return null;
  }

  try {
    const session = JSON.parse(storedValue) as Partial<StoredDanceCueSession>;

    return {
      activeSource: session.activeSource === "youtube" ? "youtube" : null,
      markers: Array.isArray(session.markers) && session.markers.every(isStoredMarker)
        ? session.markers
        : starterMarkers,
      playbackRate: typeof session.playbackRate === "number" ? session.playbackRate : 1,
      updatedAt: typeof session.updatedAt === "number" ? session.updatedAt : Date.now(),
      youtubeTime: typeof session.youtubeTime === "number" ? session.youtubeTime : 0,
      youtubeVideoId:
        typeof session.youtubeVideoId === "string" && session.youtubeVideoId
          ? session.youtubeVideoId
          : null,
    };
  } catch {
    return null;
  }
}

function makeMarkerId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function App() {
  const [storedSession] = useState(() => readStoredSession());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingRestoreTimeRef = useRef(storedSession?.youtubeTime ?? 0);
  const hasRestoredPlaybackRef = useRef(false);
  const [markerDraftRange, setMarkerDraftRange] = useState<{ start: number; end: number } | null>(
    null,
  );
  const [isMarkerDraftActive, setIsMarkerDraftActive] = useState(false);
  const [markerDraftActivationKey, setMarkerDraftActivationKey] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>(() => storedSession?.markers ?? starterMarkers);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(() =>
    storedSession?.activeSource === "youtube" ? storedSession.youtubeVideoId : null,
  );

  const sortedMarkers = useMemo(
    () => [...markers].sort((a, b) => a.time - b.time),
    [markers],
  );

  const player = useAudioPlayer({ audioRef, markers: sortedMarkers });

  useEffect(() => {
    if (storedSession?.activeSource !== "youtube" || !storedSession.youtubeVideoId) {
      return;
    }

    player.loadYouTube(storedSession.youtubeVideoId);
  }, [player.loadYouTube, storedSession]);

  useEffect(() => {
    if (
      hasRestoredPlaybackRef.current ||
      player.activeSource !== "youtube" ||
      player.duration <= 0 ||
      pendingRestoreTimeRef.current <= 0
    ) {
      return;
    }

    hasRestoredPlaybackRef.current = true;
    player.setSpeed(storedSession?.playbackRate ?? 1);
    player.seekTo(Math.min(pendingRestoreTimeRef.current, player.duration));
  }, [player.activeSource, player.duration, player.seekTo, player.setSpeed, storedSession]);

  useEffect(() => {
    const session: StoredDanceCueSession = {
      activeSource: player.activeSource === "youtube" ? "youtube" : null,
      markers,
      playbackRate: player.playbackRate,
      updatedAt: Date.now(),
      youtubeTime: player.activeSource === "youtube" ? player.currentTime : 0,
      youtubeVideoId: player.activeSource === "youtube" ? youtubeVideoId : null,
    };

    window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  }, [markers, player.activeSource, player.currentTime, player.playbackRate, youtubeVideoId]);

  const addMarker = (name: string, startTime: number, endTime: number) => {
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: makeMarkerId(name),
        endTime,
        name,
        time: startTime,
      },
    ]);
    setMarkerDraftRange(null);
    setIsMarkerDraftActive(false);
  };

  const removeMarker = (markerId: string) => {
    setMarkers((currentMarkers) => currentMarkers.filter((marker) => marker.id !== markerId));
  };

  const updateMarker = (updatedMarker: Marker) => {
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) => (marker.id === updatedMarker.id ? updatedMarker : marker)),
    );
  };

  const activateMarkerDraft = () => {
    setIsMarkerDraftActive(true);
    setMarkerDraftActivationKey((currentKey) => currentKey + 1);
  };

  const updateMarkerDraftRange = useCallback((range: { start: number; end: number } | null) => {
    setMarkerDraftRange(range);

    if (range) {
      setMarkerDraftActivationKey((currentKey) => currentKey + 1);
    }
  }, []);

  useEffect(() => {
    if (!isMarkerDraftActive) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsMarkerDraftActive(false);
      setMarkerDraftRange(null);
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [isMarkerDraftActive, markerDraftActivationKey]);

  const speech = useSpeechCommands({
    markers: sortedMarkers,
    onForward: (seconds) => player.skipBy(seconds),
    onJumpToMarker: player.jumpToMarker,
    onLoopMarker: player.startLoop,
    onPause: player.pause,
    onPlay: () => {
      void player.play();
    },
    onRestart: player.restart,
    onRewind: (seconds) => player.skipBy(-seconds),
    onStopLoop: player.stopLoop,
  });

  return (
    <main className="min-h-screen bg-[#101114] px-4 py-5 font-sans text-zinc-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#17181c] shadow-2xl shadow-black/40">
        <section className="border-b border-white/10 bg-gradient-to-br from-fuchsia-500/18 via-[#1b1d24] to-cyan-400/14 px-5 pb-5 pt-6">
          <div>
            <div>
              <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cyan-200">
                DanceCue
              </p>
              <h1 className="mt-2 whitespace-nowrap text-2xl font-black leading-tight tracking-normal text-white">
                Rehearse in motion
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Load a track, mark rehearsal sections, and control jumps or loops with short voice
            commands while you stay in motion.
          </p>
        </section>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <SourceLoader
            activeSource={player.activeSource}
            onFileSelected={(file) => {
              setYoutubeVideoId(null);
              player.loadFile(file);
            }}
            onYouTubeSelected={(videoId) => {
              setYoutubeVideoId(videoId);
              player.loadYouTube(videoId);
            }}
          />

          <YouTubePlayer
            isVisible={player.activeSource === "youtube"}
            videoId={youtubeVideoId}
            onReady={player.attachYouTubePlayer}
            onStateChange={player.handleYouTubeStateChange}
          />

          <AudioPlayer
            audioRef={audioRef}
            currentTime={player.currentTime}
            duration={player.duration}
            isMarkerDraftActive={isMarkerDraftActive}
            isLooping={player.isLooping}
            isPlaying={player.isPlaying}
            onLoopToggle={player.toggleLoop}
            markerDraftRange={markerDraftRange}
            onPause={player.pause}
            onPlay={() => {
              void player.play();
            }}
            onMarkerDraftChange={updateMarkerDraftRange}
            onSeek={player.seekTo}
            onSkip={player.skipBy}
            onSpeedChange={player.setSpeed}
            playbackRate={player.playbackRate}
          />

          <MarkerList
            activeMarker={player.activeMarker}
            currentTime={player.currentTime}
            duration={player.duration}
            markerDraftRange={markerDraftRange}
            markerPlaybackMarker={player.markerPlaybackMarker}
            isPlaying={player.isPlaying}
            loopMarker={player.loopMarker}
            markers={sortedMarkers}
            onActivateMarkerDraft={activateMarkerDraft}
            onAddMarker={addMarker}
            onJumpToMarker={player.jumpToMarker}
            onRemoveMarker={removeMarker}
            onStartLoop={player.startLoop}
            onStopLoop={player.stopLoop}
            onUpdateMarker={updateMarker}
          />

          <VoiceCommandPanel
            isListening={speech.isListening}
            isSupported={speech.isSupported}
            lastTranscript={speech.lastTranscript}
            status={speech.status}
            onSimulateCommand={(command) => {
              speech.runCommand(command);
            }}
            onToggleListening={speech.toggleListening}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
