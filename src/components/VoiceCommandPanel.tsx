type VoiceCommandPanelProps = {
  isListening: boolean;
  isSupported: boolean;
  lastTranscript: string;
  onSimulateCommand: (command: string) => void;
  onToggleListening: () => void;
  status: string;
};

const sampleCommands = [
  "Play",
  "Pause",
  "Go to chorus",
  "Loop chorus",
  "Stop loop",
  "Back five seconds",
  "Forward ten seconds",
];

const buttonClass =
  "min-h-11 rounded-full border border-white/10 bg-white/[0.08] px-3 text-sm font-bold text-zinc-100 transition hover:border-cyan-200/35 hover:bg-cyan-200/10 active:translate-y-px";
const panelClass = "rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-lg shadow-black/20";
const eyebrowClass = "font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cyan-200";

export function VoiceCommandPanel({
  isListening,
  isSupported,
  lastTranscript,
  onSimulateCommand,
  onToggleListening,
  status,
}: VoiceCommandPanelProps) {
  return (
    <section className={panelClass} aria-label="Voice commands">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={eyebrowClass}>Hands-free</p>
          <h2 className="mt-1 text-xl font-black text-white">Voice Cue</h2>
        </div>
        <span
          className={`size-4 rounded-full ${
            isListening ? "animate-pulse bg-cyan-300 shadow-[0_0_0_8px_rgba(103,232,249,0.14)]" : "bg-zinc-600"
          }`}
        />
      </div>

      <button
        className={`mt-5 min-h-16 w-full rounded-full border border-white/20 bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 text-base font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:from-fuchsia-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-45 ${
          isListening ? "animate-pulse" : ""
        }`}
        disabled={!isSupported}
        type="button"
        onClick={onToggleListening}
      >
        {isListening ? "Stop listening" : "Start listening"}
      </button>

      {!isSupported && (
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Speech recognition is not available in this browser. Use the demo buttons below.
        </p>
      )}

      <div className="my-4 grid gap-1 rounded-xl border border-white/10 bg-black/25 p-4">
        <span className="font-black text-white">{status}</span>
        <small className="text-sm leading-5 text-zinc-400">
          {lastTranscript ? `Heard: "${lastTranscript}"` : "No command heard yet."}
        </small>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sampleCommands.map((command) => (
          <button
            className={buttonClass}
            key={command}
            type="button"
            onClick={() => onSimulateCommand(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </section>
  );
}
