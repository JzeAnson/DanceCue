import { formatTime } from "./AudioPlayer";
import type { Marker } from "../types/marker";

type MarkerListProps = {
  activeMarker: Marker | null;
  currentTime: number;
  loopMarker: Marker | null;
  markers: Marker[];
  onAddMarker: (name: string) => void;
  onJumpToMarker: (marker: Marker) => void;
  onRemoveMarker: (markerId: string) => void;
  onStartLoop: (marker: Marker) => void;
  onStopLoop: () => void;
};

export function MarkerList({
  activeMarker,
  currentTime,
  loopMarker,
  markers,
  onAddMarker,
  onJumpToMarker,
  onRemoveMarker,
  onStartLoop,
  onStopLoop,
}: MarkerListProps) {
  return (
    <section className="panel marker-panel" aria-label="Section markers">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Sections</p>
          <h2>Markers</h2>
        </div>
        <span className="time-chip">Now {formatTime(currentTime)}</span>
      </div>

      <form
        className="marker-form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const name = String(formData.get("markerName") ?? "").trim();

          if (name) {
            onAddMarker(name);
            event.currentTarget.reset();
          }
        }}
      >
        <input aria-label="Marker name" name="markerName" placeholder="Add marker name" />
        <button type="submit">Add</button>
      </form>

      <div className="marker-list">
        {markers.map((marker) => {
          const isActive = activeMarker?.id === marker.id;
          const isLooping = loopMarker?.id === marker.id;

          return (
            <article className={`marker-row ${isActive ? "active" : ""}`} key={marker.id}>
              <button
                className="marker-main"
                type="button"
                onClick={() => onJumpToMarker(marker)}
              >
                <span>{marker.name}</span>
                <small>{formatTime(marker.time)}</small>
              </button>
              <button
                type="button"
                onClick={() => (isLooping ? onStopLoop() : onStartLoop(marker))}
              >
                {isLooping ? "Stop" : "Loop"}
              </button>
              <button
                aria-label={`Remove ${marker.name}`}
                className="icon-button"
                type="button"
                onClick={() => onRemoveMarker(marker.id)}
              >
                X
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
