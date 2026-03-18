# Scene Layout Validator Agent

## Purpose
Validates that scene content fits within the 1080x1920 viewport without overflow, overlap, or clipping. Catches layout issues before they appear in rendered video.

## When to Run
- After creating or modifying any scene component
- After changing padding, gap, font sizes, or element dimensions
- After adding new visual elements to an existing scene
- Before final render of any video

## Validation Checks

### 1. Vertical Content Budget
Every scene renders inside a 1920px tall viewport. Content must fit within:
```
available_height = 1920 - vertical_padding_top - vertical_padding_bottom
```
Sum the heights of all child elements plus gaps between them. If the total exceeds `available_height`, the scene WILL overflow.

### 2. Absolute Positioning Containment
Elements using `position: absolute` with transforms like `rotate()` + `translateX()` can escape their parent bounds. Validate:
- The parent container has explicit `width` and `height` (not auto-sized)
- The parent has `overflow: hidden` if children must be clipped
- Absolute children don't visually overlap neighboring flex siblings

### 3. Radial / Orbital Layouts
When placing items around a center element (e.g., satellites around a hub):
- Use a fixed-size container (e.g., `width: 520px, height: 520px`)
- Place satellite items at cardinal positions using `top/right/bottom/left` offsets
- Use `transform: translate(...)` for centering, NOT `rotate() + translateX()` which causes unpredictable bounding box expansion
- Keep connection lines (dashed/solid) within the container bounds

### 4. Font Size Limits for 1080px Width
Maximum recommended font sizes to avoid horizontal overflow:
- Title: 80-90px (single short word), 60-70px (multi-word)
- Subtitle: 28-34px
- Card labels: 18-24px
- Card descriptions: 14-18px

### 5. Grid/Card Sizing
For 2-column grids inside the 1080px viewport:
```
max_card_width = (1080 - 2 * horizontal_padding - gap) / 2
```
Card internal padding + content must not push the card beyond this width. Keep card padding at 14-20px for compact layouts.

### 6. SceneWrapper Defaults
When using `SceneWrapper`, audit these props:
- `gap`: Keep at 24-32px for content-heavy scenes (default 40 is often too large)
- `padding`: Use `60px 50px` for dense scenes, `80px 60px` only for sparse scenes

## Quick Checklist
```
[ ] Total vertical content height < viewport height minus padding
[ ] No absolute-positioned elements escaping their parent bounds
[ ] Orbital/radial layouts use fixed-size containers
[ ] Font sizes within recommended limits
[ ] Grid cards fit within available horizontal space
[ ] SceneWrapper gap/padding appropriate for content density
[ ] No emoji used in contexts where it may render inconsistently (prefer SVG/text)
```

## Common Fixes

### Content overflows vertically
**Cause**: Too many elements stacked with large gaps/padding.
**Fix**: Reduce `gap` (to 24-28px), reduce `padding`, reduce font sizes, or consolidate elements into a combined layout (e.g., embed cards around a center element instead of stacking them below).

### Absolute elements overlap siblings
**Cause**: Parent container has no explicit size; absolute children expand beyond auto-sized bounds.
**Fix**: Give the parent explicit `width`/`height`. Place absolute children relative to the sized parent.

### Rotated lines/decorations escape layout
**Cause**: Using `rotate(deg) translateX(px)` creates unpredictable bounding boxes.
**Fix**: Use cardinal positioning (`top/right/bottom/left`) with `transform: translate()` for centering. Keep decoration lines short and inside the parent container.
