import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeBlock, CodeLine, K, S, M } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

export const Scene07Arguments = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const codeS    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 80 } });
  const invokeS  = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 14, stiffness: 90 } });
  const mapS     = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 14, stiffness: 90 } });
  const altS     = spring({ frame: Math.max(0, frame - 165), fps, config: { damping: 14, stiffness: 90 } });

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
          Arguments in skills
        </div>

        {/* Skill definition */}
        <div style={{
          opacity: codeS,
          transform: `translateY(${interpolate(codeS, [0, 1], [24, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.codeBorder}`,
          borderRadius: 12,
          padding: '20px 28px',
          fontFamily: FONT.mono,
          fontSize: 28,
          lineHeight: 1.75,
          marginBottom: 20,
        }}>
          <CodeLine revealAtFrame={22}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={32}><K>name</K>{': '}<S>migrate</S></CodeLine>
          <CodeLine revealAtFrame={42}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={52}>
            {'Migrate '}
            <span style={{ color: COLORS.codeSpecial, fontWeight: 700 }}>$0</span>
            {' from '}
            <span style={{ color: COLORS.codeSpecial, fontWeight: 700 }}>$1</span>
            {' to '}
            <span style={{ color: COLORS.codeSpecial, fontWeight: 700 }}>$2</span>
            {'.'}
          </CodeLine>
        </div>

        {/* Invocation */}
        <div style={{
          opacity: invokeS,
          transform: `translateY(${interpolate(invokeS, [0, 1], [20, 0])}px)`,
          background: '#1A1A1A',
          borderRadius: 12,
          padding: '16px 28px',
          marginBottom: 16,
        }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, color: '#64748B' }}>$ </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.accent }}>/migrate </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.codeString }}>Button React Vue</span>
        </div>

        {/* Substitution map */}
        <div style={{
          opacity: mapS,
          transform: `translateY(${interpolate(mapS, [0, 1], [16, 0])}px)`,
          display: 'flex',
          gap: 16,
          marginBottom: 20,
        }}>
          {[
            { arg: '$0', val: 'Button' },
            { arg: '$1', val: 'React' },
            { arg: '$2', val: 'Vue' },
          ].map(({ arg, val }) => (
            <div key={arg} style={{
              flex: 1,
              background: COLORS.accentLight,
              border: `1.5px solid ${COLORS.accentBorder}`,
              borderRadius: 10,
              padding: '10px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 28, color: COLORS.codeSpecial, fontWeight: 700 }}>{arg}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 28, color: COLORS.codeString }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Alt: $ARGUMENTS */}
        <div style={{
          opacity: altS,
          transform: `translateY(${interpolate(altS, [0, 1], [16, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 30,
          color: COLORS.textMuted,
          fontWeight: 400,
        }}>
          Or use <span style={{ fontFamily: FONT.mono, color: COLORS.codeSpecial, fontWeight: 700 }}>$ARGUMENTS</span> to get the full string at once
        </div>
      </div>

      <Audio src="https://remotion.media/whoosh.wav" startFrom={0} endAt={20} volume={0.2} />
    </div>
  );
};
