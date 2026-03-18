# Scene-Voiceover Sync Skill

## Purpose
Ensures proper synchronization between voiceover audio and visual scenes in Remotion video compositions. This skill provides the patterns, rules, and templates for generating perfectly synced audio-visual content.

## Core Principle
**One source of truth for scene durations**: `constants.js` defines all timing. Everything else (voiceover scripts, composition files, render configs) must derive from these constants.

## Quick Reference

### Architecture Pattern
```
constants.js (SCENE_DURATIONS, TRANSITION_DUR, TOTAL_FRAMES)
    ├── index.jsx (imports durations, uses TransitionSeries)
    ├── generate-voiceover-<name>.py (mirrors durations, per-scene TTS)
    └── Root.jsx (durationInFrames = TOTAL_FRAMES)
```

### Rules
See `rules/` directory for detailed enforcement rules.

### Templates
See `templates/` directory for starter files when creating new reels.
