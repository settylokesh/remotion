# Rule: Natural Scene Transitions

## Problem
Scene transitions that are too long create awkward gaps. Transitions that are too short feel jarring.

## Rule
Transition durations should be 20-25 frames (0.67-0.83 seconds) for a natural feel.

## Guidelines

### Duration
- **Recommended**: 25 frames (0.83s) — feels snappy but smooth
- **Minimum**: 15 frames (0.5s) — usable for fast-paced content
- **Maximum**: 30 frames (1.0s) — only for dramatic/cinematic transitions
- **Avoid**: >35 frames (>1.17s) — feels sluggish, creates noticeable gaps

### Timing Functions
- **`springTiming`**: Best for most transitions. Provides natural easing.
  - `damping: 18-22` — controls bounce (lower = bouncier)
  - `stiffness: 50-80` — controls speed (higher = faster)
- **`linearTiming`**: Only for wipe transitions where constant speed looks good.

### Transition Variety
Alternate transition types between scenes for visual interest:
```jsx
fade() → slide('from-right') → wipe('from-top-left') → clockWipe() → slide('from-left')
```

### Voiceover During Transitions
The 25-frame transition overlap means voiceover audio from the previous scene
bleeds into the next scene's start. This is intentional — it creates a natural
flow where the voice bridges scenes smoothly.

## Anti-Pattern: Long Transitions
```jsx
// BAD: 60-frame (2s) transitions create dead air
timing={springTiming({ durationInFrames: 60 })}

// GOOD: 25-frame transitions keep pace
timing={springTiming({ durationInFrames: 25 })}
```
