import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

const RepoCard = ({ icon, name, label, delay, frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 90 } });
  return (
    <div style={{
      opacity: s,
      transform: `translateX(${interpolate(s, [0, 1], [-24, 0])}px)`,
      background: COLORS.codeBg,
      border: `1.5px solid ${COLORS.codeBorder}`,
      borderRadius: 12,
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: FONT.mono,
          fontSize: 28,
          color: COLORS.codeType,
          fontWeight: 600,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: FONT.display,
          fontSize: 26,
          color: COLORS.textMuted,
          marginTop: 2,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export const Scene13Community = () => {
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
          Find more skills
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <RepoCard
            icon="🏠"
            name="github.com/anthropics/skills"
            label="Official built-ins from Anthropic"
            delay={20}
            frame={frame}
            fps={fps}
          />
          <RepoCard
            icon="⭐"
            name="awesome-claude-skills"
            label="Community collection on GitHub"
            delay={50}
            frame={frame}
            fps={fps}
          />
        </div>

        {/* Built-in chips */}
        {(() => {
          const s = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 14, stiffness: 90 } });
          return (
            <div style={{
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
              marginTop: 28,
            }}>
              <div style={{
                fontFamily: FONT.display,
                fontSize: 28,
                color: COLORS.textMuted,
                marginBottom: 12,
              }}>
                Ships built-in:
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['/batch', '/simplify', '/debug', '/loop'].map((cmd) => (
                  <div key={cmd} style={{
                    background: COLORS.accentLight,
                    border: `1.5px solid ${COLORS.accentBorder}`,
                    borderRadius: 8,
                    padding: '6px 18px',
                    fontFamily: FONT.mono,
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLORS.accent,
                  }}>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <Audio src="https://remotion.media/whoosh.wav" startFrom={0} endAt={20} volume={0.2} />
    </div>
  );
};
