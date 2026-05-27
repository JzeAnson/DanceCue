import { useEffect, useState } from "react";
import { formatTime } from "./AudioPlayer";
import type { Marker } from "../types/marker";

type MarkerListProps = {
  activeMarker: Marker | null;
  currentTime: number;
  duration: number;
  markerDraftRange: { start: number; end: number } | null;
  loopMarker: Marker | null;
  markers: Marker[];
  onActivateMarkerDraft: () => void;
  onAddMarker: (name: string, startTime: number, endTime: number) => void;
  onJumpToMarker: (marker: Marker) => void;
  onRemoveMarker: (markerId: string) => void;
  onStartLoop: (marker: Marker) => void;
  onStopLoop: () => void;
};

const buttonClass =
  "min-h-11 rounded-full border border-white/10 bg-white/[0.08] px-3 text-sm font-bold text-zinc-100 transition hover:border-cyan-200/35 hover:bg-cyan-200/10 active:translate-y-px";
const inputClass =
  "min-h-12 min-w-0 rounded-lg border border-white/10 bg-white/[0.07] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none placeholder:text-zinc-500 focus:border-cyan-200/55 focus:bg-white/[0.1] focus:ring-4 focus:ring-cyan-300/10";
const panelClass =
  "rounded-3xl border border-white/15 bg-white/[0.08] p-4 shadow-[0_0_32px_rgba(235,178,255,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl";
const eyebrowClass = "font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cyan-100";

function parseTimeInput(value: string) {
  const cleanedValue = value.trim().toLowerCase().replace(/s$/, "");

  if (!cleanedValue) {
    return null;
  }

  if (cleanedValue.includes(":")) {
    const parts = cleanedValue.split(":").map(Number);

    if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
      return null;
    }

    return parts.reduce((total, part) => total * 60 + part, 0);
  }

  const seconds = Number(cleanedValue);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

function formatMarkerTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds)) {
    return "0.00s";
  }

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(2)}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
}

function formatStopwatchTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds)) {
    return "00:00.00";
  }

  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toFixed(2).padStart(5, "0");

  return `${minutes}:${seconds}`;
}

function getMarkerColorClass(isActive: boolean, isLooping: boolean, index: number) {
  if (isLooping) {
    return "text-cyan-100 drop-shadow-[0_0_12px_rgba(0,244,254,0.65)]";
  }

  if (isActive) {
    return "text-fuchsia-100 drop-shadow-[0_0_14px_rgba(235,178,255,0.7)]";
  }

  if (index === 0) {
    return "text-pink-200";
  }

  return "text-[#e4e1e6]";
}

export function MarkerList({
  activeMarker,
  currentTime,
  duration,
  markerDraftRange,
  loopMarker,
  markers,
  onActivateMarkerDraft,
  onAddMarker,
  onJumpToMarker,
  onRemoveMarker,
  onStartLoop,
  onStopLoop,
}: MarkerListProps) {
  const [endInput, setEndInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [startInput, setStartInput] = useState("");

  const clampTime = (time: number) => {
    if (duration <= 0) {
      return Math.max(time, 0);
    }

    return Math.min(Math.max(time, 0), duration);
  };

  useEffect(() => {
    if (!markerDraftRange) {
      return;
    }

    setStartInput(clampTime(markerDraftRange.start).toFixed(2));
    setEndInput(clampTime(markerDraftRange.end).toFixed(2));
    setErrorMessage("");
  }, [duration, markerDraftRange]);

  return (
    <section
      className={panelClass}
      aria-label="Section markers"
      onClick={onActivateMarkerDraft}
      onFocus={onActivateMarkerDraft}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={eyebrowClass}>Sections</p>
          <h2 className="mt-1 text-xl font-black text-white">Markers</h2>
        </div>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 font-mono text-xs font-bold text-cyan-50">
          Now {formatTime(currentTime)}
        </span>
      </div>

      <form
        className="mt-4 grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const name = nameInput.trim();
          const startTime = parseTimeInput(startInput);
          const endTime = parseTimeInput(endInput);

          if (!name) {
            setErrorMessage("Name the marker first.");
            return;
          }

          if (startTime === null || endTime === null) {
            setErrorMessage("Use seconds like 0.50s or time like 1:05.");
            return;
          }

          const safeStartTime = clampTime(startTime);
          const safeEndTime = clampTime(endTime);

          if (safeEndTime <= safeStartTime) {
            setErrorMessage("End time must be after start time.");
            return;
          }

          onAddMarker(name, safeStartTime, safeEndTime);
          setNameInput("");
          setStartInput("");
          setEndInput("");
          setErrorMessage("");
        }}
      >
        <input
          className={inputClass}
          aria-label="Marker name"
          name="markerName"
          placeholder="Add marker name"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1">
            <span className="px-1 text-[0.65rem] font-bold uppercase tracking-normal text-zinc-400">
              Start
            </span>
            <input
              className={inputClass}
              aria-label="Marker start time"
              inputMode="decimal"
              name="markerStart"
              placeholder="0.50s"
              value={startInput}
              onChange={(event) => {
                setStartInput(event.target.value);
                setErrorMessage("");
              }}
            />
          </label>
          <label className="grid gap-1">
            <span className="px-1 text-[0.65rem] font-bold uppercase tracking-normal text-zinc-400">
              End
            </span>
            <input
              className={inputClass}
              aria-label="Marker end time"
              inputMode="decimal"
              name="markerEnd"
              placeholder="1.05s"
              value={endInput}
              onChange={(event) => {
                setEndInput(event.target.value);
                setErrorMessage("");
              }}
            />
          </label>
        </div>
        <button className={buttonClass} type="submit">
          Add marker
        </button>
        {errorMessage ? (
          <p className="px-1 text-xs font-bold text-rose-200" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>

      <div className="mt-5 divide-y divide-[#504254]/70 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        {markers.map((marker, index) => {
          const isActive = activeMarker?.id === marker.id;
          const isLooping = loopMarker?.id === marker.id;
          const markerColorClass = getMarkerColorClass(isActive, isLooping, index);
          const markerDuration = marker.endTime - marker.time;

          return (
            <article
              className={`group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-5 transition ${
                isActive
                  ? "bg-gradient-to-r from-fuchsia-300/14 via-white/[0.05] to-cyan-300/10 shadow-[inset_4px_0_0_rgba(235,178,255,0.95)]"
                  : "bg-white/[0.02] hover:bg-white/[0.055]"
              }`}
              key={marker.id}
            >
              <button
                className="min-w-0 rounded-lg px-1 text-left transition focus:bg-white/5 focus:outline-none"
                type="button"
                onClick={() => onJumpToMarker(marker)}
              >
                <span
                  className={`block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-black leading-none tracking-normal sm:text-xl ${markerColorClass}`}
                >
                  {marker.name}
                </span>
                <small className="mt-2 block font-mono text-[0.62rem] font-bold uppercase tabular-nums tracking-normal text-[#d4c0d7]/70">
                  {formatMarkerTime(marker.time)} - {formatMarkerTime(marker.endTime)}
                </small>
              </button>
              <div className="flex min-w-0 items-center gap-2">
                <button
                  className={`min-h-10 rounded-lg px-1 text-right font-mono text-lg font-bold tabular-nums tracking-normal transition hover:bg-white/5 focus:bg-white/5 focus:outline-none sm:text-xl ${markerColorClass}`}
                  type="button"
                  onClick={() => (isLooping ? onStopLoop() : onStartLoop(marker))}
                  title={isLooping ? "Stop loop" : "Loop marker"}
                >
                  {formatStopwatchTime(markerDuration)}
                </button>
                <button
                  aria-label={`Remove ${marker.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-transparent text-lg font-black text-[#ffb1c3]/55 opacity-0 transition hover:border-[#ffb1c3]/35 hover:bg-[#e8006e]/12 hover:text-[#ffb1c3] group-hover:opacity-100 group-focus-within:opacity-100"
                  type="button"
                  onClick={() => onRemoveMarker(marker.id)}
                >
                  X
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
