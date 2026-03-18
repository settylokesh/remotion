# Rule: Per-Scene Voiceover Generation

## Problem
Generating a single continuous voiceover audio file causes drift — speech pacing varies,
and the voiceover progressively falls out of sync with scene transitions as the video plays.

## Rule
Voiceover MUST be generated as individual per-scene audio segments, each padded or trimmed
to exactly match the scene's net duration, then concatenated into a single file.

## Required Pattern

### 1. Define per-scene scripts
```python
SCENE_SCRIPTS = {
    "hook": "Short punchy opening line.",
    "scene2": "Text matching scene 2 visuals.",
    # ... one entry per scene
}
```

### 2. Calculate net durations accounting for transitions
```python
def compute_net_durations():
    durations = {}
    net_start = 0
    for i, name in enumerate(SCENE_ORDER):
        gross = SCENE_FRAMES[name]
        if i < len(SCENE_ORDER) - 1:
            net_end = net_start + gross - TRANSITION_FRAMES
        else:
            net_end = net_start + gross  # last scene, no subsequent transition
        dur_frames = net_end - net_start
        durations[name] = dur_frames / FPS * 1000  # milliseconds
        net_start = net_end
    return durations
```

### 3. Generate, pad/trim, concatenate
```python
async def generate_scene_audio(name, text, target_ms):
    # Generate TTS for this scene
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)
    audio = AudioSegment.from_mp3(out_path)

    if len(audio) < target_ms:
        # Pad with silence
        audio = audio + AudioSegment.silent(duration=int(target_ms - len(audio)))
    elif len(audio) > target_ms:
        # Trim to fit
        audio = audio[:int(target_ms)]

    return audio
```

### 4. Concatenate all segments
```python
combined = segments[0]
for seg in segments[1:]:
    combined += seg
combined.export(OUTPUT, format="mp3", bitrate="192k")
```

## Word Count Guidelines
At `+15%` rate with `en-US-AndrewNeural`: ~2.5 words/second.
At `+20%` rate: ~2.8 words/second.

For a scene with net duration D seconds:
- Target word count: `D × 2.3` (leaves breathing room)
- Maximum word count: `D × 2.8` (will be trimmed if exceeded)

## Anti-Pattern: Single Continuous Script
```python
# BAD: No per-scene alignment
SCRIPT = "One long continuous blob of text..."
communicate = edge_tts.Communicate(SCRIPT, VOICE)
await communicate.save(OUTPUT)
```
This approach has NO guarantee that speech aligns with visual scenes.
