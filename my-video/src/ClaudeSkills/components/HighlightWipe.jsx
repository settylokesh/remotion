import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS } from '../constants';

// Accent color bar that wipes in from left to right behind text
export const HighlightWipe = ({
  delay = 0,
  height = 8,
  color = COLORS.accent,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const scaleX = interpolate(s, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: -4,
        left: 0,
        right: 0,
        height,
        background: color,
        borderRadius: height / 2,
        transformOrigin: 'left center',
        transform: `scaleX(${scaleX})`,
        ...style,
      }}
    />
  );
};

// Pill-shaped accent badge
export const AccentBadge = ({ children, delay = 0, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: COLORS.accentLight,
        border: `1.5px solid ${COLORS.accentBorder}`,
        borderRadius: 100,
        padding: '6px 20px',
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
