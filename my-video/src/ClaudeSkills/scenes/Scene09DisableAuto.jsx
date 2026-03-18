import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeBlock, CodeLine, K, S, M } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

export const Scene09DisableAuto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const codeS    = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 80 } });
  const warningS = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14, stiffness: 90 } });
  const noteS    = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 14, stiffness: 90 } });

  // Pulse on the key line
  const pulse = interpolate(
    Math.sin((frame - 80) / 10),
    [-1, 1],
    [1.0, 1.03],
    { extrapolateRight: 'clamp' }
  );

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
          marginBottom: 32,
        }}>
          Lock it down
        </div>

        {/* Code block */}
        <div style={{
          opacity: codeS,
          transform: `translateY(${interpolate(codeS, [0, 1], [24, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.codeBorder}`,
          borderRadius: 12,
          padding: '20px 28px',
          fontFamily: FONT.mono,
          fontSize: 29,
          lineHeight: 1.75,
          marginBottom: 20,
        }}>
          <CodeLine revealAtFrame={24}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={34}><K>name</K>{': '}<S>deploy</S></CodeLine>
          <CodeLine revealAtFrame={44}>
            <div style={{ transform: frame > 80 ? `scale(${pulse})` : 'none', display: 'inline-block', transformOrigin: 'left center' }}>
              <K>disable-model-invocation</K>{': '}
              <span style={{ color: '#F43F5E', fontWeight: 700 }}>true</span>
            </div>
          </CodeLine>
          <CodeLine revealAtFrame={56}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={66}><span style={{ color: COLORS.text }}>Deploy </span><span style={{ color: COLORS.codeSpecial }}>$ARGUMENTS</span><span style={{ color: COLORS.text }}> to production.</span></CodeLine>
        </div>

        {/* Warning badge */}
        <div style={{
          opacity: warningS,
          transform: `scale(${interpolate(warningS, [0, 1], [0.9, 1])})`,
          background: 'rgba(244,63,94,0.07)',
          border: '1.5px solid rgba(244,63,94,0.25)',
          borderRadius: 12,
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 18,
        }}>
          <span style={{ fontSize: 32 }}>🔒</span>
          <span style={{
            fontFamily: FONT.display,
            fontSize: 32,
            fontWeight: 700,
            color: '#F43F5E',
          }}>
            Only you can trigger this — Claude will not auto-use it
          </span>
        </div>

        {/* Use case note */}
        <div style={{
          opacity: noteS,
          transform: `translateY(${interpolate(noteS, [0, 1], [16, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 30,
          color: COLORS.textMuted,
        }}>
          Essential for: deploy, publish, delete, force-push, anything dangerous
        </div>
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
