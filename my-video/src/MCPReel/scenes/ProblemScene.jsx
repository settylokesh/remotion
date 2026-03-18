import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { whoosh, uiSwitch } from '@remotion/sfx';
import { SceneWrapper } from '../components/SceneWrapper';
import { GradientText, SolidText } from '../components/GradientText';
import { Card, IconBadge } from '../components/Card';
import { COLORS, GRADIENTS, FONT } from '../constants';

const PROBLEMS = [
  { emoji: '📁', label: 'Files', desc: 'No access', color: COLORS.highlight },
  { emoji: '🗄️', label: 'Databases', desc: 'No access', color: COLORS.gold },
  { emoji: '🌐', label: 'APIs', desc: 'No access', color: COLORS.accent },
  { emoji: '🔧', label: 'Dev Tools', desc: 'No access', color: COLORS.secondary },
];

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const aiBoxS = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 80 } });
  const lockS  = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 14, stiffness: 100 } });

  const lockBob = Math.sin(frame / 15) * 4;

  return (
    <SceneWrapper gap={28} padding="60px 50px">

      {/* Title */}
      <div style={{
        opacity: titleS,
        transform: `translateY(${interpolate(titleS, [0, 1], [-50, 0])}px)`,
        textAlign: 'center',
      }}>
        <GradientText gradient={GRADIENTS.warm} size={78} weight={900} style={{ letterSpacing: '-1.5px' }}>
          The Problem
        </GradientText>
        <div style={{
          marginTop: 10, fontFamily: FONT.display, fontSize: 30,
          color: COLORS.textMuted, fontWeight: 500,
        }}>
          AI is locked in a box
        </div>
      </div>

      {/* AI box with surrounding problem items */}
      <div style={{
        opacity: aiBoxS,
        transform: `scale(${aiBoxS})`,
        position: 'relative',
        width: 520, height: 520,
        display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {/* Center AI box */}
        <div style={{
          width: 180, height: 180,
          background: 'linear-gradient(135deg, #EEF2FF, #F0F9FF)',
          border: `3px solid ${COLORS.secondary}44`,
          borderRadius: 36,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 40px ${COLORS.secondary}18`,
          gap: 6,
          zIndex: 2,
        }}>
          <span style={{ fontSize: 56 }}>🤖</span>
          <span style={{
            fontFamily: FONT.display, fontSize: 22, fontWeight: 700,
            color: COLORS.text,
          }}>Your AI</span>
        </div>

        {/* Lock icon */}
        <div style={{
          position: 'absolute',
          top: 520 / 2 - 90 - 24, right: 520 / 2 - 90 - 24,
          transform: `translateY(${lockBob}px)`,
          opacity: lockS, fontSize: 48,
          zIndex: 3,
        }}>
          🔒
        </div>

        {/* Problem items positioned around the center box */}
        {PROBLEMS.map(({ emoji, label, desc, color }, i) => {
          const s = spring({ frame: Math.max(0, frame - 70 - i * 15), fps, config: { damping: 13, stiffness: 110 } });
          // Position: top, right, bottom, left
          const positions = [
            { top: 0, left: '50%', tx: '-50%', ty: '0%' },       // top
            { top: '50%', right: 0, tx: '0%', ty: '-50%' },      // right
            { bottom: 0, left: '50%', tx: '-50%', ty: '0%' },    // bottom
            { top: '50%', left: 0, tx: '0%', ty: '-50%' },       // left
          ];
          const pos = positions[i];
          return (
            <div key={i} style={{
              position: 'absolute',
              ...(pos.top !== undefined ? { top: pos.top } : {}),
              ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
              ...(pos.left !== undefined ? { left: pos.left } : {}),
              ...(pos.right !== undefined ? { right: pos.right } : {}),
              transform: `translate(${pos.tx}, ${pos.ty}) scale(${s})`,
              opacity: s,
              background: `${color}12`,
              border: `1.5px solid ${color}33`,
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
              boxShadow: `0 4px 20px ${color}10`,
              zIndex: 1,
            }}>
              <span style={{ fontSize: 32 }}>{emoji}</span>
              <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color }}>{label}</span>
              <span style={{
                fontFamily: FONT.display, fontSize: 16, color: COLORS.highlight,
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
              }}>
                ✕ {desc}
              </span>
            </div>
          );
        })}

        {/* Dashed lines from center to each card */}
        {[0, 90, 180, 270].map((deg, i) => {
          const s = spring({ frame: Math.max(0, frame - 70 - i * 15), fps, config: { damping: 16, stiffness: 100 } });
          return (
            <div key={`line-${i}`} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 70, height: 3,
              opacity: s * 0.7,
              transformOrigin: '0% 50%',
              transform: `rotate(${deg}deg) translateX(90px)`,
              background: `${COLORS.highlight}66`,
              borderRadius: 2,
              zIndex: 1,
            }}>
              <div style={{
                position: 'absolute', right: -16, top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 22, color: COLORS.highlight,
                fontWeight: 900,
              }}>✕</div>
            </div>
          );
        })}
      </div>

      {/* Solution hint */}
      <div style={{
        opacity: spring({ frame: Math.max(0, frame - 170), fps, config: { damping: 14, stiffness: 90 } }),
        background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.accent}18)`,
        border: `1.5px solid ${COLORS.primary}44`,
        borderRadius: 20, padding: '16px 28px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: FONT.display, fontSize: 28, fontWeight: 700,
          color: COLORS.primary,
        }}>
          Until now...
        </span>
      </div>

      <Audio src={whoosh} startFrom={0} volume={0.45} />
      {PROBLEMS.map((_, i) => (
        <Audio key={i} src={uiSwitch} startFrom={90 + i * 20} endAt={100 + i * 20} volume={0.3} />
      ))}
    </SceneWrapper>
  );
};
