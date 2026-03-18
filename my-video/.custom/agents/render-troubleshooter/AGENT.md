# Render Troubleshooter Agent

Diagnoses and fixes rendering issues (font/emoji rendering, voiceover sync, environment problems) in this Remotion project.

## When to Use

Invoke this agent when:
- Rendered video shows visual artifacts (□ boxes, wrong fonts, blank frames)
- Voiceover is out of sync, missing, or fails to generate
- Render command fails or times out
- User reports "works in preview but not in render"

## Diagnostic Checklist

### 1. Emoji / Font Issues

- [ ] System emoji font installed: `fc-list | grep -i "noto color emoji"`
- [ ] `src/load-fonts.js` exists and loads NotoColorEmoji, Inter, SpaceGrotesk, JetBrainsMono
- [ ] `src/Root.jsx` imports `./load-fonts`
- [ ] All `fontFamily` in `constants.js` include `"Noto Color Emoji"` as last fallback
- [ ] All inline `fontFamily` in scene JSX files include `"Noto Color Emoji"` fallback
- [ ] No font loads all weights/subsets (check for render timeout warnings)

### 2. Voiceover Sync Issues

- [ ] `SCENE_FRAMES` in Python matches `SCENE_DURATIONS` in `constants.js` (same keys, same values)
- [ ] `TRANSITION_DUR` is consistent (default: 25 frames)
- [ ] Math check: `sum(SCENE_DURATIONS) - (num_scenes - 1) * TRANSITION_DUR == TOTAL_FRAMES`
- [ ] Output MP3 path matches `staticFile()` in `index.jsx`
- [ ] Word count per scene within limits (~2.3 words/sec at +15%, ~2.5 at +20%)
- [ ] Run validator: `node .custom/agents/voiceover-sync-validator/validate.js <ReelName>`

### 3. Environment Issues

- [ ] Node.js v22+: `node --version`
- [ ] Python 3.10+: `python3 --version`
- [ ] ffmpeg installed: `ffmpeg -version`
- [ ] edge-tts installed: `python3 -c "import edge_tts"`
- [ ] pydub installed: `python3 -c "import pydub"`
- [ ] Network access available (edge-tts needs internet)

## Common Fix Patterns

### Fix: Missing emoji font
```bash
sudo apt-get install -y fonts-noto-color-emoji && fc-cache -f
```

### Fix: Missing font in load-fonts.js
Add to `src/load-fonts.js`:
```js
import { loadFont as loadFontName } from "@remotion/google-fonts/FontName";
loadFontName("normal", { weights: ["400", "700"], subsets: ["latin"] });
```

### Fix: Missing emoji fallback in fontFamily
Append `"Noto Color Emoji"` to every fontFamily string:
```js
// Before
fontFamily: '"Space Grotesk", sans-serif'
// After
fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"'
```

### Fix: Voiceover duration mismatch
1. Copy `SCENE_DURATIONS` values from `constants.js` to `SCENE_FRAMES` in the Python script
2. Re-run: `python3 scripts/generate-voiceover*.py`
3. Validate: `node .custom/agents/voiceover-sync-validator/validate.js <ReelName>`

### Fix: Missing Python deps
```bash
pip install edge-tts pydub
sudo apt-get install ffmpeg
```
