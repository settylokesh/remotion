import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeLine, K, S, M } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

const ToolChip = ({ name, allowed, delay, frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 110 } });

  return (
    <div style={{
      opacity: s,
      transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: allowed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.07)',
      border: `1.5px solid ${allowed ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.22)'}`,
      borderRadius: 10,
      padding: '10px 18px',
    }}>
      <span style={{ fontSize: 22 }}>{allowed ? '✅' : '🚫'}</span>
      <span style={{
        fontFamily: FONT.mono,
        fontSize: 28,
        fontWeight: 600,
        color: allowed ? '#15803D' : '#DC2626',
      }}>
        {name}
      </span>
    </div>
  );
};

export const Scene11AllowedTools = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const codeS    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 80 } });
  const labelS   = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 14, stiffness: 90 } });

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
          Restrict tool access
        </div>

        {/* Code */}
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
          marginBottom: 24,
        }}>
          <CodeLine revealAtFrame={22}><M>---</M></CodeLine>
          <CodeLine revealAtFrame={32}><K>name</K>{': '}<S>code-reader</S></CodeLine>
          <CodeLine revealAtFrame={44}>
            <K>allowed-tools</K>{': '}
            <span style={{ color: '#22C55E', fontWeight: 700 }}>Read, Grep, Glob</span>
          </CodeLine>
          <CodeLine revealAtFrame={56}><M>---</M></CodeLine>
        </div>

        {/* Tool grid */}
        <div style={{
          opacity: labelS,
          fontFamily: FONT.display,
          fontSize: 30,
          color: COLORS.textMuted,
          marginBottom: 16,
          transform: `translateY(${interpolate(labelS, [0, 1], [16, 0])}px)`,
        }}>
          Claude can use:
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <ToolChip name="Read"   allowed={true}  delay={88}  frame={frame} fps={fps} />
          <ToolChip name="Grep"   allowed={true}  delay={100} frame={frame} fps={fps} />
          <ToolChip name="Glob"   allowed={true}  delay={112} frame={frame} fps={fps} />
          <ToolChip name="Edit"   allowed={false} delay={124} frame={frame} fps={fps} />
          <ToolChip name="Write"  allowed={false} delay={136} frame={frame} fps={fps} />
          <ToolChip name="Bash"   allowed={false} delay={148} frame={frame} fps={fps} />
        </div>

        {(() => {
          const s = spring({ frame: Math.max(0, frame - 165), fps, config: { damping: 14, stiffness: 90 } });
          return (
            <div style={{
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
              marginTop: 24,
              fontFamily: FONT.display,
              fontSize: 30,
              color: COLORS.textMuted,
            }}>
              Read-only mode, enforced by the runtime
            </div>
          );
        })()}
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
