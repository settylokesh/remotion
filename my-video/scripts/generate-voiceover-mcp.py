"""
Generate MCPReel voiceover using edge-tts, synchronized per-scene.

Video: 2700 frames at 30fps = 90 seconds total.
10 scenes with 9 transitions (25-frame overlap each).

Each scene gets its own audio segment generated independently,
then padded/trimmed to match its exact net duration in the timeline.
The segments are concatenated into a single voiceover_mcp.mp3.

Net scene timeline (accounting for 25-frame / 0.833s transition overlaps):
  Scene          Gross Dur  Net Start  Net End   Net Duration
  Hook           185        0          160       ~5.33s
  Problem        260        160        395       ~7.83s
  WhatIsMCP      315        395        685       ~9.67s
  Architecture   375        685        1035      ~11.67s
  Primitives     315        1035       1325      ~9.67s
  InAction       375        1325       1675      ~11.67s
  Ecosystem      315        1675       1965      ~9.67s
  Benefits       300        1965       2240      ~9.17s
  Future         250        2240       2465      ~7.50s
  CTA            235        2465       2700      ~7.83s
"""

import asyncio
import edge_tts
import os
import tempfile
from pydub import AudioSegment

VOICE = "en-US-AndrewNeural"
RATE = "+20%"
OUTPUT = "/workspaces/remotion/my-video/public/voiceover_mcp.mp3"
TEMP_DIR = tempfile.mkdtemp(prefix="mcp_vo_")

FPS = 30

# Scene gross durations (frames) from constants.js
SCENE_FRAMES = {
    "hook":         185,
    "problem":      260,
    "whatIsMCP":    315,
    "architecture": 375,
    "primitives":   315,
    "inAction":     375,
    "ecosystem":    315,
    "benefits":     300,
    "future":       250,
    "cta":          235,
}

TRANSITION_FRAMES = 25

SCENE_ORDER = ["hook", "problem", "whatIsMCP", "architecture", "primitives",
               "inAction", "ecosystem", "benefits", "future", "cta"]


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

# Voiceover scripts per scene — written to match each scene's visuals.
# At +15% rate with AndrewNeural, we get roughly 2.5 words/second.
SCENE_SCRIPTS = {
    # ~13 words for 5.3s
    "hook": (
        "AI just got superpowers. "
        "Meet MCP, the protocol changing everything."
    ),
    # ~20 words for 7.8s
    "problem": (
        "Here's the problem. "
        "AI is stuck in a box. "
        "No file access. No databases. No APIs. "
        "Until now."
    ),
    # ~28 words for 9.7s
    "whatIsMCP": (
        "MCP stands for Model Context Protocol. "
        "Model, your AI. Context, tools and data. "
        "Protocol, a universal standard. "
        "Like USB-C for AI."
    ),
    # ~33 words for 11.7s
    "architecture": (
        "Three layers, one standard. "
        "The Host is your AI app, like Claude Desktop or Cursor. "
        "The Client manages connections. "
        "The Server exposes tools and data. "
        "Everything flows both ways."
    ),
    # ~27 words for 9.7s
    "primitives": (
        "Three core primitives. "
        "Tools let AI take actions. "
        "Resources let AI read data. "
        "Prompts provide reusable templates. "
        "Run code, search the web, read files."
    ),
    # ~33 words for 11.7s
    "inAction": (
        "Watch it work. "
        "Ask Claude to fix bugs. It reads your files. "
        "Checks GitHub issues. Writes the fix. "
        "Runs tests. Opens a pull request. "
        "One conversation. Zero custom code."
    ),
    # ~27 words for 9.7s
    "ecosystem": (
        "Over a thousand MCP servers already. "
        "Works with Claude Desktop, Cursor, VS Code, and Windsurf. "
        "GitHub, Stripe, Slack, and more."
    ),
    # ~25 words for 9.2s
    "benefits": (
        "Why it matters. "
        "Developers build once, works everywhere. "
        "Businesses get AI that knows their systems. "
        "Everyone gets AI with real results."
    ),
    # ~20 words for 7.5s
    "future": (
        "MCP is the USB-C for AI. "
        "One standard that works everywhere. "
        "The future of AI agents."
    ),
    # ~20 words for 7.8s
    "cta": (
        "Now you know MCP. "
        "Follow for daily AI content. "
        "Like and share this reel. "
        "One protocol, infinite possibilities."
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
    print(f"  Duration: {duration_s:.2f}s  (target: 90.00s)")
    print(f"  Size: {size_kb:.1f} KB")


if __name__ == "__main__":
    asyncio.run(main())
