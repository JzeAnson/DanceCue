import { useCallback, useMemo, useRef, useState } from "react";
import type { Marker } from "../types/marker";

type CommandHandlers = {
  markers: Marker[];
  onForward: (seconds: number) => void;
  onJumpToMarker: (marker: Marker) => void;
  onLoopMarker: (marker: Marker) => void;
  onPause: () => void;
  onPlay: () => void;
  onRestart: () => void;
  onRewind: (seconds: number) => void;
  onStopLoop: () => void;
};

type CommandMatch = {
  label: string;
  handled: boolean;
};

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
};

function parseSeconds(command: string, fallback: number) {
  const digitMatch = command.match(/\b(\d+)\b/);

  if (digitMatch) {
    return Number(digitMatch[1]);
  }

  const wordMatch = Object.entries(numberWords).find(([word]) => command.includes(word));
  return wordMatch?.[1] ?? fallback;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function findMarker(command: string, markers: Marker[]) {
  return markers.find((marker) => command.includes(marker.name.toLowerCase()));
}

export function useSpeechCommands(handlers: CommandHandlers) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [status, setStatus] = useState("Voice controls are idle.");

  const isSupported = useMemo(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  const runCommand = useCallback(
    (rawTranscript: string): CommandMatch => {
      const command = normalize(rawTranscript);
      setLastTranscript(rawTranscript);

      if (!command) {
        return { label: "No command heard", handled: false };
      }

      if (command.includes("stop loop") || command.includes("stop looping")) {
        handlers.onStopLoop();
        return { label: "Stopped loop", handled: true };
      }

      if (command.includes("pause") || command.includes("stop music")) {
        handlers.onPause();
        return { label: "Paused", handled: true };
      }

      if (command.includes("restart") || command.includes("start over")) {
        handlers.onRestart();
        return { label: "Restarted track", handled: true };
      }

      if (command.includes("play") || command.includes("resume")) {
        handlers.onPlay();
        return { label: "Playing", handled: true };
      }

      if (command.includes("back") || command.includes("rewind")) {
        const seconds = parseSeconds(command, 5);
        handlers.onRewind(seconds);
        return { label: `Back ${seconds} seconds`, handled: true };
      }

      if (command.includes("forward") || command.includes("ahead")) {
        const seconds = parseSeconds(command, 10);
        handlers.onForward(seconds);
        return { label: `Forward ${seconds} seconds`, handled: true };
      }

      if (command.includes("loop")) {
        const marker = findMarker(command, handlers.markers);

        if (marker) {
          handlers.onLoopMarker(marker);
          return { label: `Looping ${marker.name}`, handled: true };
        }
      }

      if (command.includes("go to") || command.includes("jump to")) {
        const marker = findMarker(command, handlers.markers);

        if (marker) {
          handlers.onJumpToMarker(marker);
          return { label: `Jumped to ${marker.name}`, handled: true };
        }
      }

      return { label: `Command not recognized: ${rawTranscript}`, handled: false };
    },
    [handlers],
  );

  const toggleListening = useCallback(() => {
    if (!isSupported) {
      setStatus("Speech recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus("Voice controls are idle.");
      return;
    }

    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0]?.transcript ?? "";
      const match = runCommand(transcript);
      setStatus(match.label);
    };

    recognition.onerror = (event) => {
      setStatus(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setStatus("Listening for commands...");
  }, [isListening, isSupported, runCommand]);

  return {
    isListening,
    isSupported,
    lastTranscript,
    runCommand,
    status,
    toggleListening,
  };
}
