type AudioPlayerProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onFileSelected: (file: File) => void;
  onPause: () => void;
  onPlay: () => void;
  onRestart: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
};

export function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function AudioPlayer({
  audioRef,
  currentTime,
  duration,
  isPlaying,
  onFileSelected,
  onPause,
  onPlay,
  onRestart,
  onSeek,
  onSkip,
}: AudioPlayerProps) {
  return (
    <section className="panel player-panel" aria-label="Music player">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Track</p>
          <h2>Rehearsal Player</h2>
        </div>
        <label className="file-picker">
          <input
            accept="audio/*"
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onFileSelected(file);
              }
            }}
          />
          Load song
        </label>
      </div>

      <audio ref={audioRef} />

      <div className="timeline">
        <span>{formatTime(currentTime)}</span>
        <input
          aria-label="Track position"
          disabled={!duration}
          max={duration || 0}
          min={0}
          step={0.1}
          type="range"
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="transport-controls">
        <button type="button" onClick={() => onSkip(-5)}>
          Back 5s
        </button>
        <button type="button" onClick={onRestart}>
          Restart
        </button>
        <button className="primary-action" type="button" onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={() => onSkip(10)}>
          Forward 10s
        </button>
      </div>
    </section>
  );
}
