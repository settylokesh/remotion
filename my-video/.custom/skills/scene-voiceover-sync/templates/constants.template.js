// Template: constants.js for a new Reel
//
// Replace <REEL_NAME> with your reel name and fill in scene durations.
// IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all timing.
// Both index.jsx and the voiceover generation script must mirror these values.

export const COLORS = {
  bg: '#FFFFFF',
  // ... define your color palette
};

export const GRADIENTS = {
  // ... define gradients
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene durations in frames (gross, before transition overlap subtraction).
// Math: sum(durations) - ((num_scenes - 1) × TRANSITION_DUR) = TOTAL_FRAMES
export const SCENE_DURATIONS = {
  // scene1: 180,
  // scene2: 240,
  // scene3: 200,
  // ...
};

export const TRANSITION_DUR = 25; // 25 frames = 0.83s — keep between 20-25

// Calculate: sum(SCENE_DURATIONS) - ((numScenes - 1) × TRANSITION_DUR)
export const TOTAL_FRAMES = 0; // <-- CALCULATE THIS

export const FONT = {
  display: '"Inter", "SF Pro Display", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Mono", monospace',
};
