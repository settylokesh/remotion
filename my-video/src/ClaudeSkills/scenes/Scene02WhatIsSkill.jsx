import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

const Row = ({ children, delay, frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 90 } });
  return (
    <div style={{
      opacity: s,
      transform: `translateX(${interpolate(s, [0, 1], [-24, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

export const Scene02WhatIsSkill = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const subS    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 90 } });
  const cardS   = spring({ frame: Math.max(0, frame - 38), fps, config: { damping: 14, stiffness: 80 } });
  const tagS    = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 14, stiffness: 100 } });

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
          transform: `translateY(${interpolate(headerS, [0, 1], [40, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          marginBottom: 6,
        }}>
          A Skill =
        </div>

        {/* Subtitle */}
        <div style={{
          opacity: subS,
          transform: `translateY(${interpolate(subS, [0, 1], [30, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 44,
          fontWeight: 500,
          color: COLORS.textMuted,
          marginBottom: 40,
        }}>
          one folder + one file
        </div>

        {/* File tree card */}
        <div style={{
          opacity: cardS,
          transform: `translateY(${interpolate(cardS, [0, 1], [30, 0])}px)`,
          background: COLORS.codeBg,
          border: `1.5px solid ${COLORS.codeBorder}`,
          borderRadius: 14,
          padding: '28px 32px',
        }}>
          <Row delay={45} frame={frame} fps={fps}>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.codeType }}>
              ~/.claude/skills/
            </span>
          </Row>
          <Row delay={60} frame={frame} fps={fps}>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.textMuted }}>
              {'└── '}
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.codeKeyword, fontWeight: 600 }}>
              explain-code/
            </span>
          </Row>
          <Row delay={75} frame={frame} fps={fps}>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.textMuted }}>
              {'    └── '}
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.codeString }}>
              SKILL.md
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: 26, color: COLORS.textMuted }}>
              {' ← instructions go here'}
            </span>
          </Row>
        </div>

        {/* Tag line */}
        <div style={{
          opacity: tagS,
          transform: `translateY(${interpolate(tagS, [0, 1], [20, 0])}px)`,
          marginTop: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: COLORS.accent,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: FONT.display,
            fontSize: 38,
            fontWeight: 500,
            color: COLORS.textMuted,
          }}>
            Claude gains a new ability instantly
          </span>
        </div>
      </div>

      <Audio src="https://remotion.media/page-turn.wav" startFrom={0} endAt={20} volume={0.2} />
    </div>
  );
};
