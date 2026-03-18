import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

export const Scene14Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textS = spring({
    frame: Math.max(0, frame - 0),
    fps,
    config: { damping: 11, stiffness: 90 },
  });

  const dividerS = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const subS = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 80px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Background />

      <div style={{
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 28,
      }}>
        {/* Wordmark */}
        <div style={{
          opacity: textS,
          transform: `scale(${interpolate(textS, [0, 1], [0.8, 1])})`,
          fontFamily: FONT.display,
          fontSize: 80,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-2px',
          lineHeight: 1.1,
        }}>
          Follow{' '}
          <span style={{
            color: COLORS.accent,
            position: 'relative',
          }}>
            Tokenizer
          </span>
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(dividerS, [0, 1], [0, 200], { extrapolateRight: 'clamp' }),
          height: 4,
          background: COLORS.accent,
          borderRadius: 2,
        }} />

        {/* Sub-line */}
        <div style={{
          opacity: subS,
          transform: `translateY(${interpolate(subS, [0, 1], [20, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 40,
          fontWeight: 500,
          color: COLORS.textMuted,
        }}>
          for more AI content.
        </div>
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={22} volume={0.18} />
    </div>
  );
};
