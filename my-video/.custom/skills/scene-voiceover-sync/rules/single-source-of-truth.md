# Rule: Single Source of Truth for Scene Durations

## Problem
When scene durations are defined in multiple places (constants.js AND index.jsx AND voiceover script), they inevitably drift apart, causing voiceover-scene desync.

## Rule
Scene durations MUST be defined in exactly ONE place: `<ReelName>/constants.js`.

### constants.js MUST export:
```js
export const SCENE_DURATIONS = {
  sceneName: <frames>,
  // ...
};
export const TRANSITION_DUR = 25; // 25 frames = 0.83s
export const TOTAL_FRAMES = <calculated_net>;
export const FPS = 30;
```

### index.jsx MUST:
- Import `SCENE_DURATIONS`, `TRANSITION_DUR`, `TOTAL_FRAMES` from `'./constants'`
- NOT define any local duration constants
- Use `SCENE_DURATIONS.<sceneName>` for every `<TransitionSeries.Sequence durationInFrames={...}>`

### Voiceover generation script MUST:
- Define `SCENE_FRAMES` dict with identical values to `SCENE_DURATIONS` in constants.js
- Define `TRANSITION_FRAMES` matching `TRANSITION_DUR`
- Include a comment referencing which constants.js file it mirrors

### Root.jsx MUST:
- Register composition with `durationInFrames={TOTAL_FRAMES}` matching the constant

## Math Verification
```
TOTAL_FRAMES = sum(SCENE_DURATIONS) - ((num_scenes - 1) × TRANSITION_DUR)
```

## Violation Examples
```js
// BAD: Durations defined in index.jsx
const SCENE_DURATIONS = { hook: 165, ... }; // local definition

// GOOD: Imported from constants
import { SCENE_DURATIONS } from './constants';
```
