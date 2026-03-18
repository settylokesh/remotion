# Remotion Video — Instagram Reels

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Short-form vertical video reels (1080x1920, 30fps) built with Remotion, with per-scene voiceover generated via `edge-tts`.

## Prerequisites

- **Node.js** v22+ (see `.nvmrc`)
- **Python** 3.10+
- **ffmpeg** (required by `pydub` for audio processing)
- **System emoji font** (required for rendering — see [Troubleshooting](#troubleshooting))

## Quick Start

### 1. Install Node dependencies

```bash
cd my-video
npm install
```

### 2. Install Python dependencies (for voiceover generation)

```bash
pip install edge-tts pydub
```

| Package    | Purpose                                           |
|------------|---------------------------------------------------|
| `edge-tts` | Microsoft Edge TTS — free, high-quality text-to-speech with many voices |
| `pydub`    | Audio manipulation — trimming, padding, concatenation of per-scene segments |

> `pydub` requires **ffmpeg** on your system. Install it with:
> - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
> - **macOS**: `brew install ffmpeg`
> - **Windows**: download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH

### 3. Install system emoji font (for rendering)

Remotion renders using headless Chromium, which does **not** have emoji fonts pre-installed. Without this step, all emoji characters will render as `□` box symbols.

```bash
# Ubuntu / Debian / Codespaces
sudo apt-get install -y fonts-noto-color-emoji
fc-cache -f

# macOS — Apple Color Emoji is built-in, no action needed

# Windows — Segoe UI Emoji is built-in, no action needed
```

## Commands

### Preview (Studio)

```bash
npm run dev
```

### Render videos

```bash
# Render LLMReel (60s)
npm run render

# Render MCPReel (90s)
npm run render:mcp
```

### Generate voiceover audio

The voiceover scripts generate per-scene TTS audio that is synchronized to the scene durations defined in each reel's `constants.js`.

```bash
# Generate LLMReel voiceover → public/voiceover.mp3
python3 scripts/generate-voiceover.py

# Generate MCPReel voiceover → public/voiceover_mcp.mp3
python3 scripts/generate-voiceover-mcp.py
```

### Other commands

```bash
npm run build          # Bundle for deployment
npm run lint           # Run ESLint
npx remotion upgrade   # Upgrade Remotion
```

## Project Structure

```
my-video/
├── src/
│   ├── Root.jsx              # Composition registry
│   ├── load-fonts.js         # Google Fonts + Emoji font loading
│   ├── index.js              # Entry point
│   ├── index.css             # Tailwind import
│   ├── LLMReel/              # "LLMs Explained" reel (60s)
│   │   ├── index.jsx         # Main composition with transitions
│   │   ├── constants.js      # Colors, fonts, scene durations (single source of truth)
│   │   ├── scenes/           # 9 scene components
│   │   └── components/       # Shared visual components
│   ├── MCPReel/              # "MCP Explained" reel (90s)
│   │   ├── index.jsx
│   │   ├── constants.js
│   │   ├── scenes/           # 10 scene components
│   │   └── components/
│   └── HelloWorld/           # Demo composition
├── scripts/
│   ├── generate-voiceover.py       # LLMReel TTS generator
│   └── generate-voiceover-mcp.py   # MCPReel TTS generator
├── public/                   # Static assets (generated voiceover MP3s)
├── out/                      # Rendered output directory
├── .custom/                  # Custom skills & agents (voiceover sync)
├── .custome/                 # Custom skills & agents (scene layout)
├── .agents/                  # Remotion best-practices rules
└── remotion.config.js        # Webpack config (TailwindCSS v4)
```

## Voiceover Generation — How It Works

Each reel has a companion Python script in `scripts/` that uses `edge-tts` for text-to-speech:

1. **Scene durations** are defined in `src/<Reel>/constants.js` — this is the **single source of truth**
2. The Python script mirrors the same frame counts and calculates net durations accounting for transition overlaps
3. Each scene's voiceover is generated independently as a separate TTS call
4. Each segment is padded with silence or trimmed to match the exact net duration
5. All segments are concatenated into one MP3 file placed in `public/`

### edge-tts Configuration

| Setting       | LLMReel              | MCPReel              |
|---------------|----------------------|----------------------|
| Voice         | `en-US-AndrewNeural` | `en-US-AndrewNeural` |
| Speaking rate | `+15%`               | `+20%`               |
| Output        | `public/voiceover.mp3` | `public/voiceover_mcp.mp3` |

### Available edge-tts Voices

```bash
# List all available voices
edge-tts --list-voices

# Common English voices:
# en-US-AndrewNeural, en-US-GuyNeural, en-US-JennyNeural
# en-GB-RyanNeural, en-GB-SoniaNeural
```

### Modifying Voiceover Scripts

When updating a voiceover script:

1. Ensure `SCENE_FRAMES` in the Python script matches `SCENE_DURATIONS` in `constants.js`
2. Verify the math: `TOTAL_FRAMES = sum(SCENE_DURATIONS) - ((num_scenes - 1) * TRANSITION_DUR)`
3. Keep word count within ~2.3 words/sec at the configured speaking rate
4. Run the validator: `node .custom/agents/voiceover-sync-validator/validate.js <ReelName>`

## Font Loading

Fonts are loaded via `@remotion/google-fonts` in `src/load-fonts.js` to ensure they are available during headless rendering:

| Font              | Used in   | Purpose        |
|-------------------|-----------|----------------|
| Space Grotesk     | LLMReel   | Display text   |
| Inter             | MCPReel   | Display text   |
| JetBrains Mono    | Both      | Code/mono text |
| Noto Color Emoji  | Both      | Emoji rendering|

All `fontFamily` declarations include `"Noto Color Emoji"` as a fallback to ensure emojis render correctly.

## Troubleshooting

### Emojis render as □ boxes in rendered video

**Cause**: Headless Chromium (used by Remotion's renderer) doesn't bundle emoji fonts.

**Fix**:
1. Install the system emoji font:
   ```bash
   sudo apt-get install -y fonts-noto-color-emoji && fc-cache -f
   ```
2. Ensure `src/load-fonts.js` loads `NotoColorEmoji` from `@remotion/google-fonts` (already configured)
3. Ensure all `fontFamily` CSS declarations include `"Noto Color Emoji"` as a fallback

### Fonts look different in render vs preview

**Cause**: The preview uses your system fonts, but the renderer may not have them installed.

**Fix**: Always load fonts via `@remotion/google-fonts` in `src/load-fonts.js` instead of relying on system fonts. This bundles the font files into the Remotion build.

### Voiceover is out of sync with scenes

**Cause**: Scene durations in `constants.js` don't match the Python voiceover script.

**Fix**:
1. Run the sync validator: `node .custom/agents/voiceover-sync-validator/validate.js <ReelName>`
2. Ensure `SCENE_FRAMES` in the Python script exactly mirrors `SCENE_DURATIONS` in `constants.js`
3. Re-generate the voiceover: `python3 scripts/generate-voiceover.py`

### edge-tts errors

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError: No module named 'edge_tts'` | `pip install edge-tts` |
| `ModuleNotFoundError: No module named 'pydub'` | `pip install pydub` |
| `pydub.exceptions.CouldntDecodeError` | Install ffmpeg: `sudo apt-get install ffmpeg` |
| `edge_tts.exceptions.NoAudioReceived` | Check internet connection — edge-tts requires network access |

### Render timeout with Google Fonts

**Cause**: Loading too many font weights/subsets.

**Fix**: In `src/load-fonts.js`, specify only the weights and subsets you actually use (already configured).

## Docs

- [Remotion Fundamentals](https://www.remotion.dev/docs/the-fundamentals)
- [edge-tts Documentation](https://github.com/rany2/edge-tts)
- [pydub Documentation](https://github.com/jiaaro/pydub)

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/JonnyBurger/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/JonnyBurger/remotion/blob/main/LICENSE.md).
