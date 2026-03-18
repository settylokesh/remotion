import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeLine, K, S, M, Sp } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

export const Scene10ShellInject = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const codeS    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 80 } });
  const labelS   = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14, stiffness: 100 } });
  const resultS  = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 14, stiffness: 90 } });

  // Arrow pointing at the inject line
  const arrowX = interpolate(
    spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 14, stiffness: 100 } }),
    [0, 1], [-20, 0]
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
          Shell injection
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
          <CodeLine revealAtFrame={22}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={32}><K>name</K>{': '}<S>pr-summary</S></CodeLine>
          <CodeLine revealAtFrame={42}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={52}><span style={{ color: '#3B82F6', fontWeight: 600 }}>## PR context</span></CodeLine>
          {/* The magic line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <CodeLine revealAtFrame={62}>
              <span style={{ color: COLORS.codeSpecial, fontWeight: 700 }}>!</span>
              <span style={{ color: COLORS.codeSpecial }}>`</span>
              <span style={{ color: COLORS.codeType }}>gh pr diff</span>
              <span style={{ color: COLORS.codeSpecial }}>`</span>
            </CodeLine>
            <div style={{
              opacity: spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 14, stiffness: 100 } }),
              transform: `translateX(${arrowX}px)`,
              background: COLORS.accentLight,
              border: `1px solid ${COLORS.accentBorder}`,
              borderRadius: 8,
              padding: '2px 12px',
              fontFamily: FONT.display,
              fontSize: 22,
              color: COLORS.accent,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              ← runs live before Claude sees this
            </div>
          </div>
          <CodeLine revealAtFrame={75}><span style={{ color: COLORS.text }}> </span></CodeLine>
          <CodeLine revealAtFrame={82}><span style={{ color: COLORS.text }}>Summarize this PR.</span></CodeLine>
        </div>

        {/* What this means */}
        <div style={{
          opacity: resultS,
          transform: `translateY(${interpolate(resultS, [0, 1], [16, 0])}px)`,
          background: 'rgba(245,158,11,0.08)',
          border: '1.5px solid rgba(245,158,11,0.25)',
          borderRadius: 12,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <span style={{
            fontFamily: FONT.display,
            fontSize: 30,
            fontWeight: 600,
            color: '#B45309',
          }}>
            Claude sees the actual diff — not a placeholder
          </span>
        </div>
      </div>

      <Audio src="https://remotion.media/mouse-click.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
