"""
Voiceover generator for the ClaudeSkills reel.
Uses edge-tts (free, no API key) + pydub to produce one concatenated MP3
that aligns perfectly with the Remotion composition.

Install:  pip install edge-tts pydub
Run:      cd my-video && python scripts/generate-voiceover-claude_skills.py
Output:   public/voiceover_claude_skills.mp3
"""

import asyncio
import edge_tts
import os
import tempfile
from pydub import AudioSegment

VOICE  = "en-US-AndrewNeural"
RATE   = "+15%"
OUTPUT = "public/voiceover_claude_skills.mp3"
TEMP_DIR = tempfile.mkdtemp(prefix="claude_skills_vo_")
FPS    = 30

# ── MUST match SCENE_DURATIONS in src/ClaudeSkills/constants.js ───────────────
SCENE_FRAMES = {
    "hook":         75,
    "whatIsSkill":  230,
    "whereLive":    240,
    "structure":    270,
    "frontmatter":  250,
    "slashCommand": 230,
    "arguments":    250,
    "autoTrigger":  220,
    "disableAuto":  250,
    "shellInject":  250,
    "allowedTools": 220,
    "realExample":  260,
    "community":    180,
    "outro":        100,
}
# sum = 3025

TRANSITION_FRAMES = 25  # MUST match TRANSITION_DUR in constants.js

# ── MUST match SCENE_ORDER in src/ClaudeSkills/constants.js ───────────────────
SCENE_ORDER = [
    "hook", "whatIsSkill", "whereLive", "structure", "frontmatter",
    "slashCommand", "arguments", "autoTrigger", "disableAuto",
    "shellInject", "allowedTools", "realExample", "community", "outro",
]

# ── Voiceover text — ≤2.3 words per second of net duration ───────────────────
# Net durations (gross − TRANSITION_FRAMES, except last):
#   hook:         50f  = 1.67s  → max  4 words
#   whatIsSkill: 205f  = 6.83s  → max 15 words
#   whereLive:   215f  = 7.17s  → max 16 words
#   structure:   245f  = 8.17s  → max 18 words
#   frontmatter: 225f  = 7.5s   → max 17 words
#   slashCommand:205f  = 6.83s  → max 15 words
#   arguments:   225f  = 7.5s   → max 17 words
#   autoTrigger: 195f  = 6.5s   → max 14 words
#   disableAuto: 225f  = 7.5s   → max 17 words
#   shellInject: 225f  = 7.5s   → max 17 words
#   allowedTools:195f  = 6.5s   → max 14 words
#   realExample: 235f  = 7.83s  → max 18 words
#   community:   155f  = 5.17s  → max 11 words
#   outro:       100f  = 3.33s  → max  7 words
SCENE_SCRIPTS = {
    # net 1.67s → max 3w  (at +15% rate this fits easily)
    "hook":
        "One file. Infinite power.",
    # net 6.83s → max 15w
    "whatIsSkill":
        "A Claude Skill is a markdown file. "
        "One folder — Claude gains a new capability.",
    # net 7.17s → max 16w
    "whereLive":
        "Global skills in tilde-dot-claude work everywhere. "
        "Project skills in dot-claude stay local to that repo.",
    # net 8.17s → max 18w
    "structure":
        "Two parts. YAML frontmatter at the top defines metadata. "
        "Below it, plain markdown instructions Claude follows.",
    # net 7.50s → max 17w
    "frontmatter":
        "Name becomes the slash command. Description is critical — "
        "it's what triggers auto-use. Add argument-hint for autocomplete.",
    # net 6.83s → max 15w
    "slashCommand":
        "Invoke it with slash skill-name. Pass arguments right after. "
        "Claude gets them all as context.",
    # net 7.50s → max 17w
    "arguments":
        "Dollar-zero, one, two for positional args. "
        "Or dollar-ARGUMENTS for the full string. Real substitution.",
    # net 6.50s → max 14w
    "autoTrigger":
        "Claude reads every skill description. "
        "When your request matches, it auto-loads. No slash needed.",
    # net 7.50s → max 17w
    "disableAuto":
        "For sensitive ops like deploy, set disable-model-invocation to true. "
        "Only you can trigger it manually.",
    # net 7.50s → max 17w
    "shellInject":
        "Bang-backtick runs a shell command before Claude sees the skill. "
        "Live PR diffs, file lists, anything.",
    # net 6.50s → max 14w
    "allowedTools":
        "Allowed-tools locks down what Claude can use. "
        "Read, Grep, Glob — read-only, enforced.",
    # net 7.83s → max 18w
    "realExample":
        "Here's a real PR reviewer skill. Name, description, disable auto, "
        "restricted tools, then your instructions. Done.",
    # net 5.17s → max 11w
    "community":
        "Anthropic ships built-in skills. "
        "Hundreds more at awesome-claude-skills on GitHub.",
    # net 3.33s → max 7w
    "outro":
        "Follow Tokenizer for more AI content.",
}


def compute_net_durations():
    """
    Each scene's net duration = the window the voiceover must fit in.
    net = gross − TRANSITION_FRAMES  (for all scenes except the last)
    net = gross                       (for the last scene)
    """
    durations = {}
    for i, name in enumerate(SCENE_ORDER):
        gross = SCENE_FRAMES[name]
        if i < len(SCENE_ORDER) - 1:
            dur_frames = gross - TRANSITION_FRAMES
        else:
            dur_frames = gross
        durations[name] = dur_frames / FPS * 1000  # ms
    return durations


NET_DURATIONS_MS = compute_net_durations()


async def generate_scene_audio(name, text, target_ms):
    out_path = os.path.join(TEMP_DIR, f"{name}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)

    audio = AudioSegment.from_mp3(out_path)
    actual_ms = len(audio)

    print(
        f"  {name:16s}: speech={actual_ms/1000:.2f}s  target={target_ms/1000:.2f}s",
        end="",
    )

    if actual_ms < target_ms:
        silence = AudioSegment.silent(duration=int(target_ms - actual_ms))
        audio = audio + silence
        print(f"  → padded +{(target_ms - actual_ms)/1000:.2f}s")
    elif actual_ms > target_ms:
        audio = audio[:int(target_ms)]
        print(f"  → TRIMMED -{(actual_ms - target_ms)/1000:.2f}s ⚠")
    else:
        print("  → exact")

    return audio


async def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

    print(f"Voice : {VOICE}")
    print(f"Rate  : {RATE}")
    print(f"Temp  : {TEMP_DIR}\n")

    total_ms = sum(NET_DURATIONS_MS.values())
    print("Scene net durations:")
    for name in SCENE_ORDER:
        ms = NET_DURATIONS_MS[name]
        words = len(SCENE_SCRIPTS[name].split())
        wps = words / (ms / 1000)
        flag = " ⚠ OVER" if wps > 2.3 else ""
        print(f"  {name:16s}: {ms/1000:.2f}s  ({words}w  {wps:.1f}w/s){flag}")
    print(f"  {'TOTAL':16s}: {total_ms/1000:.2f}s\n")

    print("Generating per-scene audio:")
    segments = []
    for name in SCENE_ORDER:
        seg = await generate_scene_audio(
            name, SCENE_SCRIPTS[name], NET_DURATIONS_MS[name]
        )
        segments.append(seg)

    print("\nConcatenating…")
    combined = segments[0]
    for seg in segments[1:]:
        combined += seg

    combined.export(OUTPUT, format="mp3", bitrate="192k")

    duration_s = len(combined) / 1000
    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"\n✓  Saved  {OUTPUT}")
    print(f"   Duration : {duration_s:.2f}s  (target {total_ms/1000:.2f}s)")
    print(f"   Size     : {size_kb:.1f} KB")


if __name__ == "__main__":
    asyncio.run(main())
