import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

const FieldRow = ({ field, arrow, meaning, delay, frame, fps, accentField }) => {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 90 } });

  return (
    <div style={{
      opacity: s,
      transform: `translateX(${interpolate(s, [0, 1], [-28, 0])}px)`,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 24px',
      background: COLORS.codeBg,
      border: `1.5px solid ${accentField ? COLORS.accentBorder : COLORS.codeBorder}`,
      borderRadius: 12,
      borderLeft: `4px solid ${accentField ? COLORS.accent : '#E2E8F0'}`,
    }}>
      {/* field name */}
      <span style={{
        fontFamily: FONT.mono,
        fontSize: 30,
        fontWeight: 700,
        color: COLORS.codeKeyword,
        minWidth: 260,
        flexShrink: 0,
      }}>
        {field}
      </span>

      {/* arrow */}
      <span style={{
        fontFamily: FONT.display,
        fontSize: 28,
        color: COLORS.textMuted,
        flexShrink: 0,
      }}>
        {arrow}
      </span>

      {/* meaning */}
      <span style={{
        fontFamily: FONT.display,
        fontSize: 30,
        fontWeight: 500,
        color: accentField ? COLORS.text : COLORS.textMuted,
      }}>
        {meaning}
      </span>
    </div>
  );
};

export const Scene05Frontmatter = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });

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
          marginBottom: 36,
        }}>
          Key frontmatter fields
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FieldRow
            field="name:"
            arrow="→"
            meaning="becomes /explain-code slash command"
            delay={18}
            frame={frame}
            fps={fps}
            accentField={true}
          />
          <FieldRow
            field="description:"
            arrow="→"
            meaning="triggers auto-use when relevant"
            delay={48}
            frame={frame}
            fps={fps}
            accentField={true}
          />
          <FieldRow
            field="argument-hint:"
            arrow="→"
            meaning="shows [file-path] in autocomplete"
            delay={78}
            frame={frame}
            fps={fps}
            accentField={false}
          />
        </div>

        {/* Critical note */}
        {(() => {
          const noteS = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 14, stiffness: 90 } });
          return (
            <div style={{
              opacity: noteS,
              transform: `translateY(${interpolate(noteS, [0, 1], [20, 0])}px)`,
              marginTop: 32,
              background: COLORS.accentLight,
              border: `1.5px solid ${COLORS.accentBorder}`,
              borderRadius: 10,
              padding: '14px 22px',
            }}>
              <span style={{
                fontFamily: FONT.display,
                fontSize: 30,
                fontWeight: 600,
                color: COLORS.accent,
              }}>
                ⚡ description is critical — it's what Claude reads to decide when to use your skill
              </span>
            </div>
          );
        })()}
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
