# Rule: Safe Absolute Positioning

## Problem
Elements with `position: absolute` can escape their parent container's visual bounds, overlapping sibling elements or getting clipped by the viewport. This is the #1 cause of visual bugs in generated scenes.

## Rule
Every absolute-positioned element MUST be contained within a parent that has:
1. Explicit `width` and `height` (not auto-sized)
2. `position: relative` (to establish the positioning context)
3. Sufficient size to contain all absolute children including their transforms

## Safe Pattern

```jsx
{/* Parent with explicit dimensions */}
<div style={{
  position: 'relative',
  width: 520, height: 520,  // explicit size
  // Optional: overflow: 'hidden' for hard clipping
}}>
  {/* Center element */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
  }}>
    {/* center content */}
  </div>

  {/* Satellite elements at cardinal positions */}
  <div style={{
    position: 'absolute',
    top: 0, left: '50%',
    transform: 'translate(-50%, 0)',
  }}>
    {/* top satellite */}
  </div>
</div>
```

## Unsafe Pattern

```jsx
{/* Parent with NO explicit size — danger! */}
<div style={{
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // width/height determined by the center child only
}}>
  <div style={{ width: 220, height: 220 }}>
    {/* center content */}
  </div>

  {/* This escapes the parent's bounds! */}
  <div style={{
    position: 'absolute',
    transform: 'rotate(90deg) translateX(160px)',
  }}>
    {/* decoration */}
  </div>
</div>
```

The parent's flex size is only 220x220 (from the center child), but the absolute child extends 160px beyond that. Sibling elements below will overlap with this decoration.

## Checklist
```
[ ] Parent has explicit width AND height
[ ] Parent has position: relative
[ ] All absolute children fit within parent's explicit dimensions
[ ] Transforms (translate, rotate) don't push children beyond parent bounds
[ ] If children MUST exceed parent bounds, parent has overflow: hidden
```
