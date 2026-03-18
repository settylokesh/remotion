# Voiceover Sync Validator Agent

## Purpose
Validates that voiceover audio is properly synchronized with scene visuals in Remotion video compositions. Catches sync drift, duration mismatches, and missing per-scene alignment before render.

## When to Run
- After creating or modifying any Reel composition
- After changing scene durations in constants files
- After modifying voiceover generation scripts
- Before final render of any video

## Validation Checks

### 1. Duration Consistency
- Scene durations in `constants.js` MUST match durations in `SCENE_FRAMES` of the voiceover generation script
- `TRANSITION_DUR` must match `TRANSITION_FRAMES` in both JS and Python
- Total composition `durationInFrames` in `Root.jsx` must equal: `sum(scene_durations) - (num_transitions × TRANSITION_DUR)`

### 2. Voiceover Script Structure
The voiceover generation script MUST:
- Define per-scene scripts (NOT a single continuous script)
- Calculate net scene durations accounting for transition overlaps
- Generate audio per-scene, pad/trim to exact scene duration
- Concatenate segments into a single file

### 3. Single Source of Truth
- Scene durations must be defined in ONE place: `constants.js`
- The composition index file must import from constants (NOT define its own durations)
- The voiceover generation script must mirror the exact same values

### 4. Transition Overlap Math
For N scenes with T transition frames:
```
net_composition_frames = sum(all_scene_durations) - ((N-1) × T)
```
Each scene's net duration (for voiceover alignment):
- First scene to second-to-last: `gross_duration - T` frames
- Last scene: `gross_duration` frames (no subsequent transition)

### 5. Word Count Check
Approximate speaking rate at `+15%` rate with `en-US-AndrewNeural`: ~2.5 words/second.
Each scene's voiceover script word count should roughly fit within:
```
max_words ≈ net_scene_duration_seconds × 2.5
```
Flag warnings if speech is likely to be trimmed (words significantly exceed capacity).

## How to Fix Common Issues

### Voiceover drifts out of sync
**Cause**: Single continuous audio file with no per-scene alignment.
**Fix**: Switch to per-scene audio generation with pad/trim to exact durations (see `generate-voiceover-mcp.py` as reference).

### Scene durations defined in multiple places
**Cause**: Constants in both `constants.js` and `index.jsx`.
**Fix**: Define once in `constants.js`, import in `index.jsx`.

### Gaps between scenes feel too long
**Cause**: Transition duration too high or wrong timing function.
**Fix**: Keep `TRANSITION_DUR` at 20-25 frames (0.67-0.83s). Use `springTiming` for natural feel.

## Validation Script
Run this mental checklist for every new reel:

```
[ ] Scene durations defined in constants.js only
[ ] index.jsx imports SCENE_DURATIONS from constants.js
[ ] Voiceover script uses per-scene generation (not single blob)
[ ] SCENE_FRAMES in Python matches SCENE_DURATIONS in JS
[ ] TRANSITION_FRAMES in Python matches TRANSITION_DUR in JS
[ ] Net duration math is correct
[ ] Root.jsx durationInFrames matches calculated net total
[ ] Each scene's voiceover text fits within its time window
[ ] Audio is padded/trimmed to exact scene duration
```
