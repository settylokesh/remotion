import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { HighlightWipe } from '../components/HighlightWipe';
import { FONT, COLORS } from '../constants';

export const Scene01Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 120 } });
  const line2 = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 12, stiffness: 120 } });
  const wipe  = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: COLORS.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Background />

      <div style={{ zIndex: 1, textAlign: 'center' }}>
        {/* LINE 1: "One file." */}
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [50, 0])}px) scale(${interpolate(line1, [0, 1], [0.85, 1])})`,
            fontFamily: FONT.display,
            fontSize: 96,
            fontWeight: 900,
            color: COLORS.text,
            letterSpacing: '-2px',
            lineHeight: 1.05,
          }}
        >
          One file.
        </div>

        {/* LINE 2: "Infinite power." — accent with underline wipe */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            marginTop: 8,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [50, 0])}px) scale(${interpolate(line2, [0, 1], [0.85, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.display,
              fontSize: 96,
              fontWeight: 900,
              color: COLORS.accent,
              letterSpacing: '-2px',
              lineHeight: 1.05,
            }}
          >
            Infinite power.
          </span>
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              right: 0,
              height: 7,
              background: COLORS.accent,
              borderRadius: 4,
              transformOrigin: 'left center',
              transform: `scaleX(${interpolate(wipe, [0, 1], [0, 1], { extrapolateRight: 'clamp' })})`,
            }}
          />
        </div>
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={20} volume={0.22} />
    </div>
  );
};
