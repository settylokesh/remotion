import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { CodeBlock, CodeLine, K, S, M } from '../components/CodeBlock';
import { FONT, COLORS } from '../constants';

export const Scene04Structure = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const part1S  = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 80 } });
  const part2S  = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14, stiffness: 80 } });

  // Frontmatter badge
  const fmBadgeS = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14, stiffness: 100 } });
  // Instructions badge
  const insBadgeS = spring({ frame: Math.max(0, frame - 105), fps, config: { damping: 14, stiffness: 100 } });

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
          SKILL.md structure
        </div>

        {/* PART 1: Frontmatter */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          {/* badge */}
          <div style={{
            opacity: fmBadgeS,
            transform: `translateX(${interpolate(fmBadgeS, [0, 1], [-16, 0])}px)`,
            display: 'inline-block',
            background: COLORS.accentLight,
            border: `1.5px solid ${COLORS.accentBorder}`,
            borderRadius: 8,
            padding: '4px 16px',
            marginBottom: 8,
          }}>
            <span style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: COLORS.accent }}>
              ① YAML frontmatter — metadata
            </span>
          </div>

          <div style={{
            opacity: part1S,
            transform: `translateY(${interpolate(part1S, [0, 1], [20, 0])}px)`,
            background: COLORS.codeBg,
            border: `2px solid ${COLORS.accentBorder}`,
            borderRadius: '12px 12px 4px 4px',
            padding: '20px 28px',
            fontFamily: FONT.mono,
            fontSize: 29,
            lineHeight: 1.7,
          }}>
            <CodeLine revealAtFrame={25}><M>---</M></CodeLine>
            <CodeLine revealAtFrame={38}><K>name</K>{': '}<S>explain-code</S></CodeLine>
            <CodeLine revealAtFrame={52}><K>description</K>{': '}<S>Explain code step by step</S></CodeLine>
            <CodeLine revealAtFrame={66}><K>argument-hint</K>{': '}<S>[file-path]</S></CodeLine>
            <CodeLine revealAtFrame={80}><M>---</M></CodeLine>
          </div>
        </div>

        {/* PART 2: Instructions */}
        <div style={{ position: 'relative' }}>
          <div style={{
            opacity: insBadgeS,
            transform: `translateX(${interpolate(insBadgeS, [0, 1], [-16, 0])}px)`,
            display: 'inline-block',
            background: 'rgba(59,130,246,0.08)',
            border: '1.5px solid rgba(59,130,246,0.22)',
            borderRadius: 8,
            padding: '4px 16px',
            marginBottom: 8,
          }}>
            <span style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: '#3B82F6' }}>
              ② Markdown instructions — Claude follows these
            </span>
          </div>

          <div style={{
            opacity: part2S,
            transform: `translateY(${interpolate(part2S, [0, 1], [20, 0])}px)`,
            background: COLORS.codeBg,
            border: `1.5px solid ${COLORS.codeBorder}`,
            borderRadius: '4px 4px 12px 12px',
            padding: '20px 28px',
            fontFamily: FONT.mono,
            fontSize: 29,
            lineHeight: 1.7,
          }}>
            <CodeLine revealAtFrame={105}><span style={{ color: '#3B82F6', fontWeight: 600 }}>## When explaining code</span></CodeLine>
            <CodeLine revealAtFrame={118}><span style={{ color: COLORS.text }}>1. Start with a one-line summary</span></CodeLine>
            <CodeLine revealAtFrame={132}><span style={{ color: COLORS.text }}>2. Walk through line by line</span></CodeLine>
            <CodeLine revealAtFrame={146}><span style={{ color: COLORS.text }}>3. Call out any gotchas</span></CodeLine>
          </div>
        </div>
      </div>

      <Audio src="https://remotion.media/mouse-click.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
