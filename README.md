# DanceCue

DanceCue is a voice-controlled dance rehearsal music player. It helps dancers practise more smoothly by allowing them to load music, create rehearsal section markers, jump to specific parts of a song, and loop sections without constantly touching the music player.

The main idea is to support hands-free rehearsal. During dance practice, users may be moving, away from the device, or repeating the same section many times. DanceCue reduces interruptions by combining normal playback controls with voice commands and quick marker-based navigation.

## Problem Statement

During dance rehearsal, dancers often need to replay the same part of a song many times. This usually means stopping practice, walking back to the device, dragging the audio timeline, and trying to find the correct timestamp again. This interrupts the rehearsal flow and wastes time, especially when practising choreography sections such as the intro, verse, chorus, bridge, or ending.

DanceCue solves this by giving users a rehearsal-focused music player where they can mark song sections and control playback using simple voice commands such as "Go to chorus", "Loop chorus", "Back five seconds", or "Pause".

## Key Features

- Load music from a local MP3/audio file.
- Load music from a YouTube link.
- Validate YouTube links before loading.
- Play, pause, restart, seek, and skip through the track.
- Skip backward and forward during practice.
- Change playback speed to practise choreography slower or faster.
- Loop the entire track.
- Create named section markers with start and end times.
- Edit and delete existing markers.
- Click a marker to jump directly to that section.
- Loop a selected marker/section for repeated practice.
- Display the current playback time and total duration.
- Highlight the active marker based on the current playback position.
- Drag on the timeline to select marker start and end ranges.
- Use voice commands for play, pause, restart, jump, loop, stop loop, rewind, and forward actions.
- Provide demo command buttons as a fallback if speech recognition is unavailable.
- Save session data in browser local storage, including markers, YouTube source, playback speed, and YouTube playback time.
- Use a dark neon, mobile-friendly interface designed for dance studio environments.

## Example Voice Commands

- "Play"
- "Pause"
- "Restart"
- "Go to chorus"
- "Jump to verse"
- "Loop chorus"
- "Stop loop"
- "Back five seconds"
- "Forward ten seconds"

## Approach and Thought Process

The project was designed around the real rehearsal workflow. Instead of building a general music player, DanceCue focuses on the repeated actions dancers perform during practice: replaying difficult sections, jumping to known song parts, slowing the music down, and reducing manual interaction.

The development approach started with the core playback experience first. A basic audio player was created with play, pause, seek, skip, loop, time display, and playback speed controls. After that, section markers were added so users could divide a track into meaningful rehearsal parts.

Voice control was then connected using the browser Web Speech API. The voice command system maps spoken phrases to player actions, such as jumping to a marker or looping a section. To make the app more reliable during demos, clickable sample command buttons were also added as a fallback.

The app also supports YouTube links in addition to local audio files. This makes it easier for users to practise with music that is already available online. Session storage was added so the app can remember markers and YouTube playback information after refreshing the browser.

The interface uses a dark neon visual style because the app is intended for high-energy rehearsal spaces and low-light environments. The controls are large and touch-friendly so users can operate the app quickly during practice.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Browser Web Speech API
- HTML audio element
- YouTube IFrame Player API
- Browser localStorage

## Project Structure

```text
src/
  components/
    AudioPlayer.tsx
    MarkerList.tsx
    SourceLoader.tsx
    VoiceCommandPanel.tsx
    YouTubePlayer.tsx
  hooks/
    useAudioPlayer.ts
    useSpeechCommands.ts
  types/
    marker.ts
  utils/
    youtube.ts
  App.tsx
  main.tsx
  styles.css
```

## How to Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal. It is usually:

```text
http://localhost:5173
```

## How to Test the App

1. Open the app in a browser.
2. Load a local audio file or paste a valid YouTube link.
3. Use the playback controls to play, pause, seek, skip, loop, and change speed.
4. Add a marker by pressing the Add button in the Markers section.
5. Enter a marker name, start time, and end time, then save it.
6. Click a marker to jump to that section.
7. Press Loop on a marker to repeat only that section.
8. Press the microphone button and try commands such as "Play", "Pause", "Go to chorus", or "Loop chorus".
9. If speech recognition is not supported in the browser, use the demo command buttons in the Voice Cue panel.

## Build for Production

To check that the app builds correctly:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Demo or Test Accounts

No login is required. DanceCue runs fully in the browser and does not use user accounts, authentication, or a backend database.

## Notes and Limitations

- Voice recognition depends on browser support for the Web Speech API.
- Speech recognition works best in browsers that support `SpeechRecognition` or `webkitSpeechRecognition`.
- YouTube playback depends on the YouTube IFrame Player API and may be affected by internet connection, browser settings, or ad blockers.
- Local audio files are loaded in the browser and are not uploaded to a server.
