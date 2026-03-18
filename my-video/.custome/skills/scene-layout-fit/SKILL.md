# Scene Layout Fit Skill

## Purpose
Ensures all scene content fits within the 1080x1920 Instagram Reel viewport without overflow, overlap, or clipping. Prevents the most common visual bug in generated Remotion videos: content spilling outside the frame.

## Core Principle
**Every scene must be designed for a fixed viewport.** Unlike web pages, video frames do not scroll. All content must be visible within 1080x1920px at all times during the scene's duration.

## Quick Reference

### Layout Budget
```
Viewport:     1080 x 1920 px
Padding:      50-60px vertical, 50px horizontal (dense scenes)
              80px vertical, 60px horizontal (sparse scenes)
Gap:          24-32px (dense), 36-44px (sparse)
Safe Area:    960 x 1800 px (after padding)
```

### Rules
See `rules/` directory:
- `vertical-budget.md` — How to calculate and stay within vertical limits
- `absolute-positioning.md` — Safe patterns for absolute-positioned elements
- `orbital-layout.md` — Placing items around a center element without overflow

## Anti-Patterns

### 1. Stacking everything vertically
```
Title + Subtitle + Large Visual + Separate Card Grid + CTA
```
This almost always overflows. Combine the visual and cards into one unified layout.

### 2. rotate() + translateX() for radial placement
```jsx
// BAD: unpredictable bounding box
transform: `rotate(${deg}deg) translateX(160px)`
```
Use cardinal positioning (`top/right/bottom/left`) instead.

### 3. Using web-scale font sizes
Font sizes that work on 1920x1080 landscape do NOT work on 1080x1920 portrait reels.
