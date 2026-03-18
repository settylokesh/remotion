// ─── ClaudeSkills Reel — Design Tokens & Timing ─────────────────────────────

export const COLORS = {
  bg:           '#FFFFFF',
  bgSurface:    '#F8F9FF',
  bgCard:       'rgba(255,255,255,0.97)',
  text:         '#1A1A1A',
  textMuted:    '#64748B',
  textLight:    '#94A3B8',
  accent:       '#6C5CE7',
  accentLight:  'rgba(108,92,231,0.10)',
  accentBorder: 'rgba(108,92,231,0.22)',
  codeBg:       '#F8F9FA',
  codeBorder:   '#E2E8F0',
  // syntax colors
  codeKeyword:  '#6C5CE7',   // YAML keys, keywords
  codeString:   '#22C55E',   // string values
  codeComment:  '#94A3B8',   // comments, delimiters
  codeType:     '#3B82F6',   // types, shell commands
  codeSpecial:  '#F59E0B',   // special tokens like !`...`
  shadow:       'rgba(108,92,231,0.10)',
};

export const FONT = {
  display: '"Inter", "SF Pro Display", system-ui, sans-serif',
  mono:    '"JetBrains Mono", "Fira Mono", monospace',
};

export const FPS = 30;
export const TRANSITION_DUR = 25; // frames overlap between scenes

// Gross durations in frames per scene
// MUST be identical in generate-voiceover-claude_skills.py
export const SCENE_DURATIONS = {
  hook:         75,   // 2.5s
  whatIsSkill:  230,  // 7.7s
  whereLive:    240,  // 8.0s
  structure:    270,  // 9.0s
  frontmatter:  250,  // 8.3s
  slashCommand: 230,  // 7.7s
  arguments:    250,  // 8.3s
  autoTrigger:  220,  // 7.3s
  disableAuto:  250,  // 8.3s
  shellInject:  250,  // 8.3s
  allowedTools: 220,  // 7.3s
  realExample:  260,  // 8.7s
  community:    180,  // 6.0s
  outro:        100,  // 3.3s
};
// sum(gross) = 3025
// 13 transitions × 25 = 325 overlap
// net = 3025 − 325 = 2700 frames = 90 s ✓

export const SCENE_ORDER = [
  'hook', 'whatIsSkill', 'whereLive', 'structure', 'frontmatter',
  'slashCommand', 'arguments', 'autoTrigger', 'disableAuto',
  'shellInject', 'allowedTools', 'realExample', 'community', 'outro',
];

export const TOTAL_FRAMES = SCENE_ORDER.reduce(
  (sum, name, i) =>
    sum + SCENE_DURATIONS[name] - (i < SCENE_ORDER.length - 1 ? TRANSITION_DUR : 0),
  0
);
// TOTAL_FRAMES = 2700 ✓
