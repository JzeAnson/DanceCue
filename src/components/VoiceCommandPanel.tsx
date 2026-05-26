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

export function VoiceCommandPanel({
  isListening,
  isSupported,
  lastTranscript,
  onSimulateCommand,
  onToggleListening,
  status,
}: VoiceCommandPanelProps) {
  return (
    <section className="panel voice-panel" aria-label="Voice commands">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Hands-free</p>
          <h2>Voice Cue</h2>
        </div>
        <span className={`status-dot ${isListening ? "listening" : ""}`} />
      </div>

      <button className="listen-button" disabled={!isSupported} type="button" onClick={onToggleListening}>
        {isListening ? "Stop listening" : "Start listening"}
      </button>

      {!isSupported && (
        <p className="support-note">
          Speech recognition is not available in this browser. Use the demo buttons below.
        </p>
      )}

      <div className="voice-status">
        <span>{status}</span>
        <small>{lastTranscript ? `Heard: "${lastTranscript}"` : "No command heard yet."}</small>
      </div>

      <div className="command-grid">
        {sampleCommands.map((command) => (
          <button key={command} type="button" onClick={() => onSimulateCommand(command)}>
            {command}
          </button>
        ))}
      </div>
    </section>
  );
}
