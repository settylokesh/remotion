"""
Generate LLMReel voiceover using edge-tts, synchronized per-scene.

Video: 1800 frames at 30fps = 60 seconds total.
9 scenes with 8 transitions (25-frame overlap each).

Each scene gets its own audio segment generated independently,
then padded/trimmed to match its exact net duration in the timeline.
The segments are concatenated into a single voiceover.mp3.

Net scene timeline (accounting for 25-frame / 0.833s transition overlaps):
  Scene          Gross Dur  Net Start  Net End   Net Duration
  Hook           165        0          140       ~4.67s
  WhatIsLLM      225        140        340       ~6.67s
  Training       200        340        515       ~5.83s
  Tokens         195        515        685       ~5.67s
  Attention      220        685        880       ~6.50s
  Apps           255        880        1110      ~7.67s
  Stats          255        1110       1340      ~7.67s
  Future         230        1340       1545      ~6.83s
  CTA            255        1545       1800      ~8.50s
"""

import asyncio
import edge_tts
import os
import tempfile
from pydub import AudioSegment

VOICE = "en-US-AndrewNeural"
RATE = "+15%"
OUTPUT = "/workspaces/remotion/my-video/public/voiceover.mp3"
TEMP_DIR = tempfile.mkdtemp(prefix="llm_vo_")

FPS = 30

# Scene gross durations (frames) — must match constants.js SCENE_DURATIONS
SCENE_FRAMES = {
    "hook":      165,
    "whatIsLLM": 225,
    "training":  200,
    "tokens":    195,
    "attention": 220,
    "apps":      255,
    "stats":     255,
    "future":    230,
    "cta":       255,
}

TRANSITION_FRAMES = 25

SCENE_ORDER = ["hook", "whatIsLLM", "training", "tokens", "attention",
               "apps", "stats", "future", "cta"]


def compute_net_durations():
    """Compute the net milliseconds each scene occupies in the timeline."""
    durations = {}
    net_start = 0
    for i, name in enumerate(SCENE_ORDER):
        gross = SCENE_FRAMES[name]
        if i < len(SCENE_ORDER) - 1:
            net_end = net_start + gross - TRANSITION_FRAMES
        else:
            # Last scene gets full gross duration (no subsequent transition)
            net_end = net_start + gross
        dur_frames = net_end - net_start
        durations[name] = dur_frames / FPS * 1000  # ms
        net_start = net_end
    return durations


NET_DURATIONS_MS = compute_net_durations()

# Voiceover scripts per scene — written to match each scene's visuals and animations.
# Each text is timed to fit within the scene's net duration.
SCENE_SCRIPTS = {
    # ~10 words for 4.7s
    "hook": (
        "Large Language Models — "
        "the brain powering every AI you use."
    ),
    # ~14 words for 6.7s
    "whatIsLLM": (
        "An LLM is a deep learning model "
        "trained on massive text data "
        "to understand and generate human language."
    ),
    # ~16 words for 5.8s
    "training": (
        "Training feeds billions of examples through neural networks, "
        "adjusting parameters to minimize errors."
    ),
    # ~10 words for 5.7s
    "tokens": (
        "LLMs break text into tokens. "
        "GPT-4 handles 128,000 at once."
    ),
    # ~18 words for 6.5s
    "attention": (
        "The attention mechanism, from a 2017 breakthrough paper, "
        "lets the model focus on what matters most in context."
    ),
    # ~16 words for 7.7s
    "apps": (
        "This powers ChatGPT, Claude, Gemini, and Copilot — "
        "transforming how we work and code."
    ),
    # ~20 words for 7.7s
    "stats": (
        "GPT-3 has 175 billion parameters. "
        "ChatGPT hit 100 million users in just 60 days."
    ),
    # ~16 words for 6.8s
    "future": (
        "LLMs are now accelerating drug discovery, scientific research, "
        "and fully autonomous AI agents."
    ),
    # ~15 words for 8.5s
    "cta": (
        "That's Large Language Models — explained. "
        "Follow for daily AI and tech breakdowns. "
        "New content every single day."
    ),
}


async def generate_scene_audio(name: str, text: str, target_ms: float) -> AudioSegment:
    """Generate TTS for a scene, then pad or trim to exact target duration."""
    out_path = os.path.join(TEMP_DIR, f"{name}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)

    audio = AudioSegment.from_mp3(out_path)
    actual_ms = len(audio)

    print(f"  {name:15s}: speech={actual_ms/1000:.2f}s  target={target_ms/1000:.2f}s", end="")

    if actual_ms < target_ms:
        # Pad with silence to fill the scene duration
        silence = AudioSegment.silent(duration=int(target_ms - actual_ms))
        audio = audio + silence
        print(f"  -> padded +{(target_ms - actual_ms)/1000:.2f}s")
    elif actual_ms > target_ms:
        # Speech is longer than scene — trim to fit
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

    # Print scene timeline
    total_ms = 0
    print("Scene net durations:")
    for name in SCENE_ORDER:
        ms = NET_DURATIONS_MS[name]
        total_ms += ms
        print(f"  {name:15s}: {ms/1000:.2f}s")
    print(f"  {'TOTAL':15s}: {total_ms/1000:.2f}s")
    print()

    # Generate per-scene audio
    print("Generating per-scene voiceover:")
    segments = []
    for name in SCENE_ORDER:
        text = SCENE_SCRIPTS[name]
        target_ms = NET_DURATIONS_MS[name]
        segment = await generate_scene_audio(name, text, target_ms)
        segments.append(segment)

    # Concatenate all segments
    print("\nConcatenating segments...")
    combined = segments[0]
    for seg in segments[1:]:
        combined += seg

    # Export final file
    combined.export(OUTPUT, format="mp3", bitrate="192k")
    duration_s = len(combined) / 1000
    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"\n✓ Saved {OUTPUT}")
    print(f"  Duration: {duration_s:.2f}s  (target: 60.00s)")
    print(f"  Size: {size_kb:.1f} KB")


if __name__ == "__main__":
    asyncio.run(main())
