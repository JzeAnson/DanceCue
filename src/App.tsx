import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { MarkerList } from "./components/MarkerList";
import { VoiceCommandPanel } from "./components/VoiceCommandPanel";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useSpeechCommands } from "./hooks/useSpeechCommands";
import type { Marker } from "./types/marker";

const starterMarkers: Marker[] = [
  { id: "intro", name: "Intro", time: 0, endTime: 30 },
  { id: "verse", name: "Verse", time: 30, endTime: 60 },
  { id: "chorus", name: "Chorus", time: 60, endTime: 90 },
  { id: "bridge", name: "Bridge", time: 90, endTime: 120 },
];

function makeMarkerId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [markerDraftRange, setMarkerDraftRange] = useState<{ start: number; end: number } | null>(
    null,
  );
  const [isMarkerDraftActive, setIsMarkerDraftActive] = useState(false);
  const [markerDraftActivationKey, setMarkerDraftActivationKey] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>(starterMarkers);

  const sortedMarkers = useMemo(
    () => [...markers].sort((a, b) => a.time - b.time),
    [markers],
  );

  const player = useAudioPlayer({ audioRef, markers: sortedMarkers });

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cyan-200">
                DanceCue
              </p>
              <h1 className="mt-2 text-3xl font-black leading-none tracking-normal text-white">
                Rehearse in motion
              </h1>
            </div>
            <div className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1.5 text-xs font-bold text-cyan-100">
              Web-phone
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Load a track, mark rehearsal sections, and control jumps or loops with short voice
            commands while you stay in motion.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 shadow-inner shadow-white/5">
            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Active section
            </span>
            <strong className="mt-2 block truncate text-2xl font-black text-fuchsia-100">
              {player.activeMarker?.name ?? "No marker yet"}
            </strong>
            <small className="mt-1 block font-mono text-xs uppercase text-cyan-100/80">
              {player.loopMarker ? `Looping ${player.loopMarker.name}` : "Loop off"}
            </small>
          </div>
        </section>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <AudioPlayer
            audioRef={audioRef}
            currentTime={player.currentTime}
            duration={player.duration}
            isMarkerDraftActive={isMarkerDraftActive}
            isLooping={player.isLooping}
            isPlaying={player.isPlaying}
            onFileSelected={player.loadFile}
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
            loopMarker={player.loopMarker}
            markers={sortedMarkers}
            onActivateMarkerDraft={activateMarkerDraft}
            onAddMarker={addMarker}
            onJumpToMarker={player.jumpToMarker}
            onRemoveMarker={removeMarker}
            onStartLoop={player.startLoop}
            onStopLoop={player.stopLoop}
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
