import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { ding, uiSwitch } from '@remotion/sfx';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { FlashOverlay } from '../components/SceneWrapper';
import { GradientText, SolidText } from '../components/GradientText';
import { PulseRing } from '../components/PulseRing';
import { COLORS, GRADIENTS, FONT } from '../constants';

const FOLLOW_ITEMS = [
  { emoji: '📡', text: 'Follow for daily AI content', color: COLORS.primary,   delay: 60  },
  { emoji: '🔔', text: 'Hit the notification bell',   color: COLORS.secondary, delay: 95  },
  { emoji: '❤️', text: 'Like & share this reel',      color: COLORS.highlight, delay: 130 },
  { emoji: '💬', text: 'Comment your questions',       color: COLORS.accent,    delay: 165 },
];

export const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(frame, [0, 3, 10], [0.7, 0.3, 0], { extrapolateRight: 'clamp' });
  const titleS   = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 10, stiffness: 80 } });
  const subtitleS = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 12, stiffness: 90 } });
  const taglineS  = spring({ frame: Math.max(0, frame - 195), fps, config: { damping: 14, stiffness: 90 } });

  const titleScale = 0.9 + spring({ frame, fps, config: { damping: 8, stiffness: 70 } }) * 0.1;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: GRADIENTS.light,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '80px 60px', gap: 36,
    }}>
      <FlashOverlay
        opacity={flashOpacity}
        background={`linear-gradient(135deg, ${COLORS.primary}88, ${COLORS.secondary}88)`}
      />

      <FloatingOrbs />

      <PulseRing color={COLORS.primary}   size={700} speed={100}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <PulseRing color={COLORS.secondary} size={550} speed={80}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <PulseRing color={COLORS.accent}    size={420} speed={65}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      {/* Main title */}
      <div style={{
        zIndex: 2, textAlign: 'center',
        opacity: titleS,
        transform: `scale(${titleScale})`,
      }}>
        <div style={{ fontSize: 100, marginBottom: 16 }}>🎉</div>
        <GradientText gradient={GRADIENTS.primary} size={100} weight={900} style={{ letterSpacing: '-2px', display: 'block' }}>
          Now You
        </GradientText>
        <GradientText gradient={GRADIENTS.cool} size={100} weight={900} style={{ letterSpacing: '-2px', display: 'block' }}>
          Know MCP!
        </GradientText>
      </div>

      {/* Subtitle */}
      <div style={{
        zIndex: 2, textAlign: 'center',
        opacity: subtitleS,
        transform: `translateY(${interpolate(subtitleS, [0, 1], [30, 0])}px)`,
      }}>
        <SolidText size={36} color={COLORS.textMuted} weight={500} style={{ lineHeight: 1.5 }}>
          The protocol making AI actually useful
        </SolidText>
      </div>

      {/* CTA items */}
      <div style={{
        zIndex: 2, display: 'flex',
        flexDirection: 'column', gap: 18, width: '100%',
      }}>
        {FOLLOW_ITEMS.map(({ emoji, text, color, delay }, i) => {
          const s = spring({
            frame: Math.max(0, frame - delay),
            fps, config: { damping: 13, stiffness: 110 },
          });
          return (
            <div key={i} style={{
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -60 : 60, 0])}px)`,
              background: `${color}12`,
              border: `2px solid ${color}44`,
              borderRadius: 24, padding: '22px 32px',
              display: 'flex', alignItems: 'center', gap: 20,
              boxShadow: `0 4px 20px ${color}14`,
            }}>
              <span style={{ fontSize: 46 }}>{emoji}</span>
              <span style={{
                fontFamily: FONT.display, fontSize: 30,
                fontWeight: 700, color,
              }}>{text}</span>
            </div>
          );
        })}
      </div>

      {/* Final tagline */}
      <div style={{
        zIndex: 2,
        opacity: taglineS,
        transform: `scale(${taglineS})`,
        textAlign: 'center',
        background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.accent}18)`,
        border: `2px solid ${COLORS.primary}44`,
        borderRadius: 28, padding: '24px 40px',
      }}>
        <GradientText gradient={GRADIENTS.primary} size={38} weight={700}>
          One Protocol. Infinite Possibilities. ⚡
        </GradientText>
      </div>

      <Audio src={ding} startFrom={0} endAt={20} volume={0.4} />
      {FOLLOW_ITEMS.map((item, i) => (
        <Audio key={i} src={uiSwitch} startFrom={item.delay} endAt={item.delay + 12} volume={0.28} />
      ))}
    </div>
  );
};
