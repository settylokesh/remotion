import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const TOKEN_COLORS = [
  { bg: 'rgba(124,58,237,0.35)', border: '#7C3AED', text: '#A78BFA' },
  { bg: 'rgba(6,182,212,0.35)',  border: '#06B6D4', text: '#67E8F9' },
  { bg: 'rgba(245,158,11,0.35)', border: '#F59E0B', text: '#FCD34D' },
  { bg: 'rgba(236,72,153,0.35)', border: '#EC4899', text: '#F9A8D4' },
  { bg: 'rgba(16,185,129,0.35)', border: '#10B981', text: '#6EE7B7' },
];

export const TokenBlock = ({ token, index, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = TOKEN_COLORS[index % TOKEN_COLORS.length];

  const appear = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        transform: `scale(${appear}) translateY(${(1 - appear) * 30}px)`,
        opacity: appear,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px',
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: 14,
        backdropFilter: 'blur(8px)',
        boxShadow: `0 0 20px ${color.border}44`,
      }}
    >
      <span
        style={{
          color: color.text,
          fontFamily: '"JetBrains Mono", monospace, "Noto Color Emoji"',
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: '1px',
        }}
      >
        {token}
      </span>
    </div>
  );
};
