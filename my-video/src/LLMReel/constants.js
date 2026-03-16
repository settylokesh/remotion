export const COLORS = {
  bg: '#050510',
  bgCard: 'rgba(15, 15, 40, 0.85)',
  bgCardBorder: 'rgba(124, 58, 237, 0.3)',
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#06B6D4',
  secondaryLight: '#67E8F9',
  accent: '#F59E0B',
  highlight: '#EC4899',
  green: '#10B981',
  red: '#EF4444',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.65)',
};

export const GRADIENTS = {
  purple:
    'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  purpleCyan:
    'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
  pinkGold:
    'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
  cyanGreen:
    'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
  fire:
    'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
  midnight:
    'linear-gradient(180deg, #050510 0%, #0F0524 50%, #050510 100%)',
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_FRAMES = 1800; // 60 seconds

// Scene durations in frames (gross, before transition overlap subtraction)
// sum = 2000; 8 transitions × 25 = 200 overlap → net 1800 frames ✓
export const SCENE_DURATIONS = {
  hook:      165,
  whatIsLLM: 225,
  training:  200,
  tokens:    195,
  attention: 220,
  apps:      255,
  stats:     255,
  future:    230,
  cta:       255,
};

export const TRANSITION_DUR = 25;

export const FONT = {
  display: '"Space Grotesk", "Inter", system-ui, sans-serif, "Noto Color Emoji"',
  mono: '"JetBrains Mono", "Fira Mono", monospace, "Noto Color Emoji"',
};
