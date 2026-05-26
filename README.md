# DanceCue

DanceCue is a voice-controlled dance rehearsal music player that helps dancers replay, loop, and jump to specific parts of a song without manually dragging the music player. Users can set section markers, then control playback using simple voice commands. This project aims to make dance practice smoother, faster, and more hands-free.

## Recommended Hackathon Stack

For a mini-hackathon build, this project is best implemented with:

- React
- TypeScript
- Vite
- Browser Web Speech API for voice commands
- HTML `<audio>` element for music playback

This stack keeps the app lightweight, fast to prototype, and easy to demo in a browser without needing a backend.

## Core Features

- Upload or select a music track for rehearsal.
- Play, pause, restart, and seek through the track.
- Add named section markers such as intro, verse, chorus, bridge, or ending.
- Jump to a marker using voice commands.
- Loop a selected section for repeated practice.
- Show the current playback time and active section.

## Example Voice Commands

- "Play"
- "Pause"
- "Restart"
- "Go to chorus"
- "Loop chorus"
- "Stop loop"
- "Back five seconds"
- "Forward ten seconds"

## Why Use the Web Speech API?

The Web Speech API gives the browser built-in speech recognition support, which is enough for a hackathon prototype. It avoids extra infrastructure and lets the team focus on the rehearsal experience.

Browser support can vary, so the app should include clickable controls as a fallback for demos.

## Suggested Setup

Install dependencies and run the local dev server:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173`.

## Suggested Project Structure

```text
src/
  components/
    AudioPlayer.tsx
    MarkerList.tsx
    VoiceCommandPanel.tsx
  hooks/
    useAudioPlayer.ts
    useSpeechCommands.ts
  types/
    marker.ts
  App.tsx
  main.tsx
```

## Implementation Plan

1. Build the basic audio player with play, pause, seek, and time display.
2. Add section markers with names and timestamps.
3. Add marker jump controls in the UI.
4. Connect voice recognition using the Web Speech API.
5. Map recognized phrases to player actions.
6. Add loop mode for repeated section practice.
7. Polish the demo flow and add fallback buttons for all voice actions.

## Demo Goal

By the end of the mini-hackathon, DanceCue should let a dancer load a song, create a few rehearsal markers, and control playback hands-free with simple voice commands.
