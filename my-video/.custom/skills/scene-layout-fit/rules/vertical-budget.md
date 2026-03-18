# Rule: Vertical Content Budget

## Problem
Remotion video frames are fixed-size (1080x1920 for portrait reels). Unlike web pages, there is no scroll. If the total height of stacked elements exceeds the viewport minus padding, content gets clipped or elements overlap.

## Rule
Before finalizing any scene layout, calculate the total vertical height of all elements and verify it fits within the available space.

## Calculation

```
available_height = VIEWPORT_HEIGHT - padding_top - padding_bottom
content_height   = sum(element_heights) + (num_elements - 1) * gap
```

Content MUST satisfy: `content_height <= available_height`

## Recommended Maximum Heights by Element Type

| Element                  | Max Height |
|--------------------------|------------|
| Title block (title+sub)  | 140-160px  |
| Center visual (icon/box) | 180-220px  |
| Orbital layout container | 480-540px  |
| 2-column card grid (2 rows) | 280-340px |
| CTA / hint bar           | 60-80px    |

## Strategies When Content Exceeds Budget

### 1. Combine visual + cards into one container
Instead of stacking a center visual above a card grid, place the cards around the center visual in an orbital/radial layout. This uses horizontal space rather than only vertical.

### 2. Reduce spacing
- Reduce `SceneWrapper` gap from default 40 to 24-28
- Reduce padding from `80px 60px` to `60px 50px`

### 3. Scale down elements
- Reduce font sizes by 10-15%
- Reduce visual element dimensions
- Reduce card padding

### 4. Remove redundancy
- If a center visual already communicates the concept, the cards below may only need labels (not descriptions)
- Remove decorative emoji from text if they add height

## Example: Before and After

### Before (overflows)
```
padding: 80px top + 80px bottom = 160px → available = 1760px
Title (140px) + gap (44px) + AI Box (220px) + gap (44px) +
Cards grid (340px) + gap (44px) + CTA (80px) = 912px ← fits
But: X-lines extend 160px beyond AI box in all directions →
     effective AI section height = 220 + 320 = 540px
Total: 140 + 44 + 540 + 44 + 340 + 44 + 80 = 1232px ← fits

Problem: X-lines are positioned absolute from AI box center,
they visually overlap the cards grid below.
```

### After (fixed)
```
padding: 60px top + 60px bottom = 120px → available = 1800px
Title (120px) + gap (28px) + Orbital container 520px
(AI box center + 4 cards around it + connection lines) +
gap (28px) + CTA (60px) = 756px ✓

All absolute elements contained within the 520px orbital container.
```
