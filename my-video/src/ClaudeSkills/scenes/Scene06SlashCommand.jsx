import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

export const Scene06SlashCommand = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const line1S   = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 14, stiffness: 80 } });
  const arrowS   = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 14, stiffness: 90 } });
  const line2S   = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 14, stiffness: 80 } });
  const resultS  = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 14, stiffness: 90 } });

  // Blinking cursor
  const cursor = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.1;

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

      <div style={{ zIndex: 1, width: '100%', maxWidth: 920 }}>
        {/* Header */}
        <div style={{
          opacity: headerS,
          transform: `translateY(${interpolate(headerS, [0, 1], [30, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 60,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-1px',
          marginBottom: 40,
        }}>
          Invoking a skill
        </div>

        {/* Basic invocation */}
        <div style={{
          opacity: line1S,
          transform: `translateY(${interpolate(line1S, [0, 1], [24, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.accentBorder}`,
          borderRadius: 12,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 700, color: COLORS.accent }}>
            /explain-code
          </span>
          <span style={{
            fontFamily: FONT.mono, fontSize: 48,
            color: COLORS.accent,
            opacity: cursor,
          }}>▌</span>
        </div>

        {/* With arguments */}
        <div style={{
          opacity: arrowS,
          fontFamily: FONT.display,
          fontSize: 30,
          color: COLORS.textMuted,
          marginBottom: 12,
          paddingLeft: 8,
        }}>
          pass arguments right after →
        </div>

        <div style={{
          opacity: line2S,
          transform: `translateY(${interpolate(line2S, [0, 1], [24, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.codeBorder}`,
          borderRadius: 12,
          padding: '24px 32px',
          marginBottom: 28,
        }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 40, color: COLORS.accent }}>/explain-code </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 40, color: COLORS.codeString }}>src/auth.ts</span>
        </div>

        {/* Result label */}
        <div style={{
          opacity: resultS,
          transform: `translateY(${interpolate(resultS, [0, 1], [16, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#22C55E',
            boxShadow: '0 0 8px rgba(34,197,94,0.5)',
          }} />
          <span style={{
            fontFamily: FONT.display,
            fontSize: 34,
            fontWeight: 500,
            color: COLORS.textMuted,
          }}>
            Claude runs the skill with that file as context
          </span>
        </div>
      </div>

      <Audio src="https://remotion.media/mouse-click.wav" startFrom={0} endAt={18} volume={0.22} />
    </div>
  );
};
