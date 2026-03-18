import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeLine, K, S, M, Sp } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

export const Scene12RealExample = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const codeS   = spring({ frame: Math.max(0, frame - 16), fps, config: { damping: 14, stiffness: 75 } });

  // Per-line reveal frames (typewriter-like)
  const LINES = [
    { delay: 20,  content: <><M>---</M></> },
    { delay: 32,  content: <><K>name</K>{': '}<S>review-pr</S></> },
    { delay: 46,  content: <><K>description</K>{': '}<S>Review the current PR. Use when asked to review a PR.</S></> },
    { delay: 66,  content: <><K>disable-model-invocation</K>{': '}<span style={{ color: '#F43F5E', fontWeight: 700 }}>true</span></> },
    { delay: 84,  content: <><K>allowed-tools</K>{': '}<span style={{ color: '#22C55E', fontWeight: 700 }}>Read, Bash(gh *)</span></> },
    { delay: 100, content: <><M>---</M></> },
    { delay: 114, content: <><span style={{ color: '#3B82F6', fontWeight: 600 }}>## PR diff</span></> },
    { delay: 126, content: <><Sp>!</Sp><Sp>`</Sp><span style={{ color: COLORS.codeType }}>gh pr diff</span><Sp>`</Sp></> },
    { delay: 140, content: <><span style={{ color: COLORS.text }}> </span></> },
    { delay: 150, content: <><span style={{ color: COLORS.text }}>Review for: logic bugs, security issues,</span></> },
    { delay: 165, content: <><span style={{ color: COLORS.text }}>missing tests. Be direct.</span></> },
  ];

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
          fontSize: 56,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-1px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span>A real skill:</span>
          <span style={{
            fontFamily: FONT.mono,
            fontSize: 44,
            color: COLORS.accent,
            background: COLORS.accentLight,
            borderRadius: 8,
            padding: '2px 14px',
          }}>review-pr</span>
        </div>

        {/* Code block */}
        <div style={{
          opacity: codeS,
          transform: `translateY(${interpolate(codeS, [0, 1], [24, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.accentBorder}`,
          borderRadius: 12,
          padding: '20px 28px',
          fontFamily: FONT.mono,
          fontSize: 26,
          lineHeight: 1.75,
        }}>
          {LINES.map(({ delay, content }, i) => (
            <CodeLine key={i} revealAtFrame={delay}>
              {content}
            </CodeLine>
          ))}
        </div>
      </div>

      <Audio src="https://remotion.media/page-turn.wav" startFrom={0} endAt={22} volume={0.2} />
    </div>
  );
};
