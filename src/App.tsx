import { useMemo, useRef, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { MarkerList } from "./components/MarkerList";
import { VoiceCommandPanel } from "./components/VoiceCommandPanel";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useSpeechCommands } from "./hooks/useSpeechCommands";
import type { Marker } from "./types/marker";

const starterMarkers: Marker[] = [
  { id: "intro", name: "Intro", time: 0 },
  { id: "verse", name: "Verse", time: 30 },
  { id: "chorus", name: "Chorus", time: 60 },
  { id: "bridge", name: "Bridge", time: 90 },
];

function makeMarkerId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [markers, setMarkers] = useState<Marker[]>(starterMarkers);

  const sortedMarkers = useMemo(
    () => [...markers].sort((a, b) => a.time - b.time),
    [markers],
  );

  const player = useAudioPlayer({ audioRef, markers: sortedMarkers });

  const addMarker = (name: string) => {
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: makeMarkerId(name),
        name,
        time: player.currentTime,
      },
    ]);
  };

  const removeMarker = (markerId: string) => {
    setMarkers((currentMarkers) => currentMarkers.filter((marker) => marker.id !== markerId));
  };

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
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">DanceCue</p>
          <h1>Practice music that listens back.</h1>
          <p>
            Load a track, mark rehearsal sections, and control jumps or loops with short voice
            commands while you stay in motion.
          </p>
        </div>
        <div className="active-section">
          <span>Active section</span>
          <strong>{player.activeMarker?.name ?? "No marker yet"}</strong>
          <small>{player.loopMarker ? `Looping ${player.loopMarker.name}` : "Loop off"}</small>
        </div>
      </section>

      <div className="workspace">
        <AudioPlayer
          audioRef={audioRef}
          currentTime={player.currentTime}
          duration={player.duration}
          isPlaying={player.isPlaying}
          onFileSelected={player.loadFile}
          onPause={player.pause}
          onPlay={() => {
            void player.play();
          }}
          onRestart={player.restart}
          onSeek={player.seekTo}
          onSkip={player.skipBy}
        />

        <MarkerList
          activeMarker={player.activeMarker}
          currentTime={player.currentTime}
          loopMarker={player.loopMarker}
          markers={sortedMarkers}
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
    </main>
  );
}

export default App;
