# Render Troubleshooter Skill

Diagnose and fix common rendering issues in Remotion video projects, including font/emoji problems, voiceover sync failures, and environment misconfigurations.

## When to Activate

- Video renders show visual artifacts (box symbols, missing fonts, wrong colors)
- Voiceover audio is out of sync, silent, or fails to generate
- Rendering crashes, times out, or produces blank frames
- Preview looks correct but rendered output does not

## Architecture

### Font & Emoji Rendering Pipeline

```
src/load-fonts.js          ← Loads Google Fonts + Noto Color Emoji via @remotion/google-fonts
src/<Reel>/constants.js    ← fontFamily declarations include "Noto Color Emoji" fallback
System font cache          ← fonts-noto-color-emoji package installed at OS level
```

All three layers must be in place for emojis to render correctly:
1. **System font** — `fonts-noto-color-emoji` installed via apt (Linux) or built-in (macOS/Windows)
2. **Remotion font bundle** — `@remotion/google-fonts/NotoColorEmoji` loaded in `src/load-fonts.js`
3. **CSS fallback** — every `fontFamily` string includes `"Noto Color Emoji"` at the end

### Voiceover Generation Pipeline

```
src/<Reel>/constants.js           ← SCENE_DURATIONS (single source of truth)
scripts/generate-voiceover*.py    ← Mirrors SCENE_FRAMES, generates per-scene TTS
public/voiceover*.mp3             ← Output audio consumed by <Audio> in index.jsx
```

## Rules

- [emoji-and-fonts.md](rules/emoji-and-fonts.md) — Emoji rendering and font loading
- [voiceover-generation.md](rules/voiceover-generation.md) — edge-tts voiceover generation and sync
- [render-environment.md](rules/render-environment.md) — System deps and environment setup
