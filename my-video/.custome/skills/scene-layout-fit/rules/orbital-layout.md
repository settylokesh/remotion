# Rule: Orbital / Radial Layout Pattern

## Problem
A common visual pattern in explainer reels is placing items around a center element (e.g., "AI in a box" surrounded by tools, or a "hub" with connected services). The naive approach using `rotate() + translateX()` creates elements with unpredictable bounding boxes that overflow their container.

## Rule
Use **cardinal positioning** (top/right/bottom/left) with explicit offsets, NOT `rotate() + translateX()`, when placing satellite elements around a center hub.

## Recommended Pattern

```jsx
const CONTAINER_SIZE = 520;

<div style={{
  position: 'relative',
  width: CONTAINER_SIZE,
  height: CONTAINER_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}}>
  {/* Center hub */}
  <div style={{
    width: 180, height: 180,
    borderRadius: 36,
    zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    Center Content
  </div>

  {/* Satellites at cardinal positions */}
  {items.map((item, i) => {
    const positions = [
      { top: 0, left: '50%', tx: '-50%', ty: '0%' },       // top
      { top: '50%', right: 0, tx: '0%', ty: '-50%' },      // right
      { bottom: 0, left: '50%', tx: '-50%', ty: '0%' },    // bottom
      { top: '50%', left: 0, tx: '0%', ty: '-50%' },       // left
    ];
    const pos = positions[i];
    return (
      <div key={i} style={{
        position: 'absolute',
        ...(pos.top !== undefined ? { top: pos.top } : {}),
        ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
        ...(pos.left !== undefined ? { left: pos.left } : {}),
        ...(pos.right !== undefined ? { right: pos.right } : {}),
        transform: `translate(${pos.tx}, ${pos.ty})`,
        zIndex: 1,
      }}>
        {item}
      </div>
    );
  })}

  {/* Connection lines from center to each satellite */}
  {[0, 90, 180, 270].map((deg, i) => (
    <div key={`line-${i}`} style={{
      position: 'absolute',
      top: '50%', left: '50%',
      width: 70, height: 3,
      transformOrigin: '0% 50%',
      transform: `rotate(${deg}deg) translateX(90px)`,
      background: 'rgba(244, 63, 94, 0.4)',
      borderRadius: 2,
      zIndex: 1,
    }} />
  ))}
</div>
```

## Key Principles

1. **Fixed container size**: The orbital container must have explicit `width` and `height` large enough to contain all satellites
2. **Cardinal positioning**: Use `top/right/bottom/left` + `translate()` instead of `rotate() + translateX()`
3. **Connection lines stay short**: Lines should extend from center outward but stay within the container (90px from center, max 70px length)
4. **Container is flex-shrink: 0**: Prevents the container from shrinking when squeezed by flex layout

## Sizing Guidelines

| Items | Container Size | Hub Size | Line Length |
|-------|---------------|----------|-------------|
| 4     | 480-540px     | 160-200px| 60-80px     |
| 6     | 560-640px     | 140-180px| 50-70px     |
| 3     | 420-480px     | 160-200px| 60-80px     |

## Anti-Pattern

```jsx
// BAD: No explicit container size, rotate+translate escapes bounds
<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
  <div style={{ width: 220, height: 220 }}>Hub</div>
  {[0, 90, 180, 270].map(deg => (
    <div style={{
      position: 'absolute',
      transform: `rotate(${deg}deg) translateX(160px)`,
    }}>Satellite</div>
  ))}
</div>
```

This creates a container sized only to the 220x220 hub, while satellites extend 160px in all directions—a 540px effective radius that overlaps everything around it.
