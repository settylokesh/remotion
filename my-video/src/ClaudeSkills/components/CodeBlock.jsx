import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, COLORS } from '../constants';

// ─── Syntax color helpers ─────────────────────────────────────────
// Use these inline to color code tokens in scene files
export const K = ({ children }) => (
  <span style={{ color: COLORS.codeKeyword }}>{children}</span>
); // keyword / YAML key
export const S = ({ children }) => (
  <span style={{ color: COLORS.codeString }}>{children}</span>
); // string value
export const M = ({ children }) => (
  <span style={{ color: COLORS.codeComment }}>{children}</span>
); // muted / comment / delimiter
export const T = ({ children }) => (
  <span style={{ color: COLORS.codeType }}>{children}</span>
); // type / shell / blue
export const Sp = ({ children }) => (
  <span style={{ color: COLORS.codeSpecial }}>{children}</span>
); // special — amber

// ─── Code container ───────────────────────────────────────────────
export const CodeBlock = ({
  children,
  delay = 0,
  fontSize = 28,
  label = null,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 22,
            color: COLORS.textMuted,
            marginBottom: 8,
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.codeBorder}`,
          borderRadius: 12,
          padding: '24px 28px',
          fontFamily: FONT.mono,
          fontSize,
          lineHeight: 1.75,
          color: COLORS.text,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Single code line with optional reveal by frame index ─────────
// revealAtFrame: the frame number at which this line becomes visible
export const CodeLine = ({ children, revealAtFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - revealAtFrame),
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-12, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Typewriter text ──────────────────────────────────────────────
export const Typewriter = ({
  text,
  startFrame = 0,
  framesPerChar = 1.2,
  style = {},
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const charsShown = Math.min(
    text.length,
    Math.floor(Math.max(0, frame - startFrame) / framesPerChar)
  );
  const cursorVisible =
    showCursor &&
    charsShown < text.length &&
    Math.floor(frame / 7) % 2 === 0;

  return (
    <span style={style}>
      {text.slice(0, charsShown)}
      {cursorVisible && (
        <span style={{ color: COLORS.accent, fontWeight: 400 }}>▌</span>
      )}
    </span>
  );
};
