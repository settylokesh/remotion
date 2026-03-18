import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { ding } from '@remotion/sfx';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { FlashOverlay } from '../components/SceneWrapper';
import { GradientText, SolidText } from '../components/GradientText';
import { PulseRing } from '../components/PulseRing';
import { COLORS, GRADIENTS, FONT } from '../constants';

export const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(frame, [0, 4, 12], [1, 0.5, 0], { extrapolateRight: 'clamp' });

  const badgeS = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 12, stiffness: 100 } });
  const line1S = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 80 } });
  const line2S = spring({ frame: Math.max(0, frame - 38), fps, config: { damping: 10, stiffness: 80 } });
  const line3S = spring({ frame: Math.max(0, frame - 56), fps, config: { damping: 10, stiffness: 80 } });
  const taglineS = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 14, stiffness: 100 } });
  const arrowS = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 16, stiffness: 120 } });

  const bgPulse = interpolate(frame, [0, 60, 120, 185], [1.04, 1.01, 1.03, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: GRADIENTS.light,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
        transform: `scale(${bgPulse})`,
      }}
    >
      <FlashOverlay opacity={flashOpacity} background={`${COLORS.secondary}99`} />

      <FloatingOrbs />

      {/* Decorative grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px', pointerEvents: 'none',
      }} />

      {/* Pulse rings behind main content */}
      <PulseRing color={COLORS.primary} size={500} speed={80}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <PulseRing color={COLORS.secondary} size={380} speed={65}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '0 64px', zIndex: 2 }}>
        {/* Badge */}
        <div style={{
          opacity: badgeS,
          transform: `scale(${badgeS}) translateY(${interpolate(badgeS, [0, 1], [-30, 0])}px)`,
          marginBottom: 40,
          background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.secondary}18)`,
          border: `1.5px solid ${COLORS.primary}44`,
          borderRadius: 100,
          padding: '10px 36px',
          display: 'flex', alignItems: 'center', gap: 14,
          backdropFilter: 'blur(12px)',
        }}>
          <span style={{ fontSize: 32 }}>🤖</span>
          <span style={{
            fontFamily: FONT.display, fontWeight: 700, fontSize: 28,
            color: COLORS.primary, letterSpacing: '3px', textTransform: 'uppercase',
          }}>AI Explained</span>
        </div>

        {/* Line 1 */}
        <div style={{
          opacity: line1S,
          transform: `translateY(${interpolate(line1S, [0, 1], [60, 0])}px)`,
        }}>
          <SolidText size={100} weight={900} color={COLORS.text} style={{ letterSpacing: '-2px' }}>
            AI Just Got
          </SolidText>
        </div>

        {/* Line 2 — gradient */}
        <div style={{
          opacity: line2S,
          transform: `translateY(${interpolate(line2S, [0, 1], [60, 0])}px)`,
        }}>
          <GradientText gradient={GRADIENTS.primary} size={108} weight={900} style={{ letterSpacing: '-2px' }}>
            SUPERPOWERS
          </GradientText>
        </div>

        {/* Line 3 */}
        <div style={{
          opacity: line3S,
          transform: `translateY(${interpolate(line3S, [0, 1], [60, 0])}px)`,
          marginTop: 8,
        }}>
          <SolidText size={100} weight={900} color={COLORS.text} style={{ letterSpacing: '-2px' }}>
            Meet MCP ⚡
          </SolidText>
        </div>

        {/* Tagline */}
        <div style={{
          opacity: taglineS * 0.75,
          transform: `translateY(${interpolate(taglineS, [0, 1], [30, 0])}px)`,
          marginTop: 48,
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: FONT.display, fontSize: 38, fontWeight: 500,
            color: COLORS.textMuted, letterSpacing: '0.5px',
          }}>
            The protocol changing AI forever
          </span>
        </div>

        {/* Arrow bounce */}
        <div style={{
          opacity: arrowS,
          transform: `translateY(${interpolate(Math.sin(frame / 12), [-1, 1], [-4, 4])}px)`,
          marginTop: 60, fontSize: 52, color: COLORS.primary,
        }}>
          ↓
        </div>
      </div>

      <Audio src={ding} startFrom={0} endAt={30} volume={0.35} />
    </div>
  );
};
