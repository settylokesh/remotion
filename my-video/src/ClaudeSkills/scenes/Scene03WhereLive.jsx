import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

const PathCard = ({ icon, path, label, desc, delay, frame, fps, accent }) => {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 85 } });

  return (
    <div style={{
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      background: COLORS.bg,
      border: `2px solid ${accent ? COLORS.accentBorder : COLORS.codeBorder}`,
      borderRadius: 16,
      padding: '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: accent ? `0 4px 24px rgba(108,92,231,0.10)` : 'none',
    }}>
      <div style={{
        fontFamily: FONT.mono,
        fontSize: 29,
        color: COLORS.codeType,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        {path}
      </div>
      <div style={{
        display: 'inline-block',
        background: accent ? COLORS.accentLight : 'rgba(241,245,249,0.8)',
        border: `1px solid ${accent ? COLORS.accentBorder : COLORS.codeBorder}`,
        borderRadius: 8,
        padding: '5px 16px',
        width: 'fit-content',
      }}>
        <span style={{
          fontFamily: FONT.display,
          fontSize: 30,
          fontWeight: 700,
          color: accent ? COLORS.accent : COLORS.textMuted,
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: FONT.display,
        fontSize: 28,
        color: COLORS.textMuted,
        fontWeight: 400,
      }}>
        {desc}
      </div>
    </div>
  );
};

export const Scene03WhereLive = () => {
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
        <div style={{
          opacity: headerS,
          transform: `translateY(${interpolate(headerS, [0, 1], [40, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 64,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-1.5px',
          marginBottom: 44,
        }}>
          Where skills live
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PathCard
            icon="🌍"
            path="~/.claude/skills/"
            label="All projects"
            desc="Drop it here once — available everywhere"
            delay={22}
            frame={frame}
            fps={fps}
            accent={false}
          />
          <PathCard
            icon="📁"
            path=".claude/skills/"
            label="This project only"
            desc="Local to this repo — great for team skills"
            delay={55}
            frame={frame}
            fps={fps}
            accent={true}
          />
        </div>

        {/* Tip */}
        {(() => {
          const tipS = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14, stiffness: 90 } });
          return (
            <div style={{
              opacity: tipS,
              transform: `translateY(${interpolate(tipS, [0, 1], [20, 0])}px)`,
              marginTop: 32,
              fontFamily: FONT.display,
              fontSize: 32,
              color: COLORS.textMuted,
              fontWeight: 400,
            }}>
              💡 Project overrides global on name conflict
            </div>
          );
        })()}
      </div>

      <Audio src="https://remotion.media/whoosh.wav" startFrom={0} endAt={22} volume={0.2} />
    </div>
  );
};
