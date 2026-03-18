# Voiceover Generation & Sync

## Overview

Voiceover audio is generated using `edge-tts` (Microsoft Edge Text-to-Speech) — a free, high-quality TTS engine that runs via HTTP to Microsoft's servers. Audio is processed with `pydub` for trimming, padding, and concatenation.

## Dependencies

```bash
pip install edge-tts pydub
sudo apt-get install ffmpeg   # required by pydub
```

## How Per-Scene Voiceover Works

1. Scene durations are defined in `src/<Reel>/constants.js` (single source of truth)
2. The Python script mirrors these exact frame counts in `SCENE_FRAMES`
3. Net durations are computed: `net_ms = (gross_frames - transition_overlap) / FPS * 1000`
4. Each scene generates a separate TTS audio segment via `edge_tts.Communicate`
5. Each segment is padded with silence or trimmed to its exact net duration
6. All segments are concatenated into one MP3

## Common Issues

### Voiceover out of sync

**Cause**: `SCENE_FRAMES` in Python script doesn't match `SCENE_DURATIONS` in `constants.js`.

**Fix**: Both must have identical key-value pairs. Run the validator:
```bash
node .custom/agents/voiceover-sync-validator/validate.js <ReelName>
```

### Audio too fast / words cut off

**Cause**: Too many words for the scene duration at the configured speaking rate.

**Fix**: Target ~2.3 words/sec at +15% rate, ~2.5 words/sec at +20% rate. Reduce script length or increase scene duration.

### `NoAudioReceived` error from edge-tts

**Cause**: No internet connection, or Microsoft TTS endpoint is down.

**Fix**: edge-tts requires network access. Check connectivity. Retry after a few minutes if the endpoint is temporarily unavailable.

### `pydub.exceptions.CouldntDecodeError`

**Cause**: ffmpeg is not installed.

**Fix**: `sudo apt-get install ffmpeg` (Linux) or `brew install ffmpeg` (macOS).

### Silence at the end of voiceover

**Cause**: CTA scene duration is longer than the spoken content.

**Fix**: This is intentional — the CTA scene often has visual elements that extend past the voiceover. If undesired, reduce the CTA `SCENE_FRAMES` value in both `constants.js` and the Python script.

## Creating a Voiceover for a New Reel

1. Copy the template: `.custom/skills/scene-voiceover-sync/templates/generate-voiceover.template.py`
2. Update `SCENE_FRAMES` to match your new reel's `constants.js`
3. Write scene scripts in `SCENE_SCRIPTS` (one entry per scene key)
4. Set the voice and rate (see available voices below)
5. Update the output path to match your reel name
6. Run: `python3 scripts/generate-voiceover-<name>.py`

## edge-tts Voice Options

```bash
# List all available voices
edge-tts --list-voices

# Filter by language
edge-tts --list-voices | grep "en-US"
```

Recommended voices for explainer content:
| Voice                    | Style         |
|--------------------------|---------------|
| `en-US-AndrewNeural`    | Professional, clear (currently used) |
| `en-US-GuyNeural`       | Casual, conversational |
| `en-US-JennyNeural`     | Female, warm |
| `en-GB-RyanNeural`      | British accent |

Rate options: `+0%` (normal), `+10%`, `+15%`, `+20%` (fast). Higher rates need fewer words per scene.

## Validation Checklist

- [ ] `SCENE_FRAMES` keys and values match `SCENE_DURATIONS` in `constants.js`
- [ ] `TRANSITION_DUR` matches between Python and JS
- [ ] Total frames math: `sum(durations) - (num_scenes - 1) * transition_dur == TOTAL_FRAMES`
- [ ] Word count per scene is within rate-adjusted limits
- [ ] Output MP3 path matches the `staticFile()` reference in `index.jsx`
- [ ] Generated MP3 total duration is close to `TOTAL_FRAMES / FPS` seconds
