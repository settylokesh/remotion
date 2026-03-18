import { useCurrentFrame, interpolate } from 'remotion';

// Subtle white background with soft breathing geometric shapes
export const Background = () => {
  const frame = useCurrentFrame();

  const scale1 = interpolate(frame, [0, 60, 120, 180], [1.0, 1.02, 0.99, 1.01], {
    extrapolateRight: 'clamp',
  });
  const scale2 = interpolate(frame, [0, 90, 180], [1.01, 0.98, 1.0], {
    extrapolateRight: 'clamp',
  });
  const drift1x = interpolate(frame, [0, 300], [0, 18], { extrapolateRight: 'clamp' });
  const drift1y = interpolate(frame, [0, 300], [0, -12], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Top-left orb */}
      <div
        style={{
          position: 'absolute',
          top: 80 + drift1y,
          left: 60 + drift1x,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,92,231,0.07) 0%, transparent 70%)',
          transform: `scale(${scale1})`,
        }}
      />
      {/* Bottom-right orb */}
      <div
        style={{
          position: 'absolute',
          bottom: 120 - drift1y,
          right: 40 - drift1x * 0.5,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,92,231,0.09) 0%, transparent 70%)',
          transform: `scale(${scale2})`,
        }}
      />
      {/* Center faint dot pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle, rgba(108,92,231,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.8,
        }}
      />
    </div>
  );
};
