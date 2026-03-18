// ─── White-theme design tokens ─────────────────────────────────────────────
export const COLORS = {
  bg:           '#FFFFFF',
  bgSurface:    '#F0F4FF',
  bgCard:       'rgba(255,255,255,0.95)',
  bgCardBorder: 'rgba(99,102,241,0.2)',

  primary:      '#3B82F6',   // blue
  primaryLight: '#93C5FD',
  secondary:    '#6366F1',   // indigo
  secondaryLight:'#A5B4FC',
  accent:       '#14B8A6',   // teal
  accentLight:  '#5EEAD4',
  highlight:    '#F43F5E',   // rose
  gold:         '#F59E0B',   // amber

  text:         '#0F172A',
  textMuted:    '#64748B',
  textLight:    '#94A3B8',

  shadow:       'rgba(99,102,241,0.15)',
  glow:         'rgba(59,130,246,0.25)',
};

export const GRADIENTS = {
  hero:     'linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 50%, #F0FDF4 100%)',
  primary:  'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
  teal:     'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
  warm:     'linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)',
  cool:     'linear-gradient(135deg, #6366F1 0%, #14B8A6 100%)',
  light:    'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 50%, #F0F9FF 100%)',
  card:     'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,244,255,0.9) 100%)',
};

export const FPS   = 30;
export const WIDTH  = 1080;
export const HEIGHT = 1920;

// 2700 frames = 90 seconds (9 transitions × 25 overlap already accounted for)
export const TOTAL_FRAMES = 2700;

export const FONT = {
  display: '"Inter", "SF Pro Display", system-ui, sans-serif, "Noto Color Emoji"',
  mono:    '"JetBrains Mono", "Fira Mono", monospace, "Noto Color Emoji"',
};

export const SCENE_DURATIONS = {
  hook:         185,
  problem:      260,
  whatIsMCP:    315,
  architecture: 375,
  primitives:   315,
  inAction:     375,
  ecosystem:    315,
  benefits:     300,
  future:       250,
  cta:          235,
};
// sum = 2925; 9 transitions × 25 = 225 overlap → net 2700 frames ✓

export const TRANSITION_DUR = 25;
