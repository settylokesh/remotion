"""
Template: Per-scene voiceover generation script for a new Reel.

Replace <REEL_NAME> and fill in SCENE_FRAMES / SCENE_SCRIPTS.
IMPORTANT: SCENE_FRAMES must be identical to SCENE_DURATIONS in constants.js.
"""

import asyncio
import edge_tts
import os
import tempfile
from pydub import AudioSegment

VOICE = "en-US-AndrewNeural"
RATE = "+15%"
OUTPUT = "/workspaces/remotion/my-video/public/voiceover_<reel_name>.mp3"
TEMP_DIR = tempfile.mkdtemp(prefix="<reel>_vo_")

FPS = 30

# Scene gross durations (frames) — MUST match constants.js SCENE_DURATIONS
SCENE_FRAMES = {
    # "scene1": 180,
    # "scene2": 240,
    # ...
}

TRANSITION_FRAMES = 25  # MUST match constants.js TRANSITION_DUR

SCENE_ORDER = []  # list scene names in order

# Voiceover scripts per scene — match each scene's visuals.
# Word count guide: ~2.3 words per second of net scene duration.
SCENE_SCRIPTS = {
    # "scene1": "Opening hook text.",
    # "scene2": "Scene 2 narration.",
    # ...
}


def compute_net_durations():
    """Compute the net milliseconds each scene occupies in the timeline."""
    durations = {}
    net_start = 0
    for i, name in enumerate(SCENE_ORDER):
        gross = SCENE_FRAMES[name]
        if i < len(SCENE_ORDER) - 1:
            net_end = net_start + gross - TRANSITION_FRAMES
        else:
            net_end = net_start + gross
        dur_frames = net_end - net_start
        durations[name] = dur_frames / FPS * 1000  # ms
        net_start = net_end
    return durations


NET_DURATIONS_MS = compute_net_durations()


async def generate_scene_audio(name: str, text: str, target_ms: float) -> AudioSegment:
    """Generate TTS for a scene, then pad or trim to exact target duration."""
    out_path = os.path.join(TEMP_DIR, f"{name}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)

    audio = AudioSegment.from_mp3(out_path)
    actual_ms = len(audio)

    print(f"  {name:15s}: speech={actual_ms/1000:.2f}s  target={target_ms/1000:.2f}s", end="")

    if actual_ms < target_ms:
        silence = AudioSegment.silent(duration=int(target_ms - actual_ms))
        audio = audio + silence
        print(f"  -> padded +{(target_ms - actual_ms)/1000:.2f}s")
    elif actual_ms > target_ms:
        audio = audio[:int(target_ms)]
        print(f"  -> trimmed -{(actual_ms - target_ms)/1000:.2f}s !")
    else:
        print("  -> exact match")

    return audio


async def main() -> None:
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    print(f"Voice: {VOICE}  Rate: {RATE}")
    print(f"Temp dir: {TEMP_DIR}")
    print()

    total_ms = 0
    print("Scene net durations:")
    for name in SCENE_ORDER:
        ms = NET_DURATIONS_MS[name]
        total_ms += ms
        print(f"  {name:15s}: {ms/1000:.2f}s")
    print(f"  {'TOTAL':15s}: {total_ms/1000:.2f}s")
    print()

    print("Generating per-scene voiceover:")
    segments = []
    for name in SCENE_ORDER:
        text = SCENE_SCRIPTS[name]
        target_ms = NET_DURATIONS_MS[name]
        segment = await generate_scene_audio(name, text, target_ms)
        segments.append(segment)

    print("\nConcatenating segments...")
    combined = segments[0]
    for seg in segments[1:]:
        combined += seg

    combined.export(OUTPUT, format="mp3", bitrate="192k")
    duration_s = len(combined) / 1000
    target_s = total_ms / 1000
    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"\n✓ Saved {OUTPUT}")
    print(f"  Duration: {duration_s:.2f}s  (target: {target_s:.2f}s)")
    print(f"  Size: {size_kb:.1f} KB")


if __name__ == "__main__":
    asyncio.run(main())
