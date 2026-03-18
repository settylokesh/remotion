import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, COLORS } from '../constants';

// Reusable spring-animated text block
// delay: frame offset before animation starts
// dir: 'up' | 'down' | 'scale' — entrance direction
export const AnimatedText = ({
  children,
  delay = 0,
  dir = 'up',
  fontSize = 56,
  fontWeight = 700,
  color = COLORS.text,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const translateY =
    dir === 'up'
      ? interpolate(s, [0, 1], [50, 0])
      : dir === 'down'
      ? interpolate(s, [0, 1], [-50, 0])
      : 0;

  const scale = dir === 'scale' ? interpolate(s, [0, 1], [0.75, 1]) : 1;

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontFamily: FONT.display,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.15,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
