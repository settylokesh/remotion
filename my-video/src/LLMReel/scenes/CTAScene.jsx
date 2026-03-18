import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { ding, whoosh } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { ParticleField } from '../components/ParticleField';
import { GRADIENTS } from '../constants';

export const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const pulse = interpolate(Math.sin((frame / fps) * 2 * Math.PI * 1.5), [-1, 1], [0.92, 1.08]);

  const followSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const likeSpr = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 14, stiffness: 120 } });
  const shareSpr = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #0D0221 0%, #1A0545 50%, #050510 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        gap: 50,
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      <ParticleField count={80} color="rgba(124,58,237,0.75)" speedFactor={180} />
      <ParticleField count={50} color="rgba(6,182,212,0.5)" speedFactor={280} />

      {/* Main CTA */}
      <div
        style={{
          transform: `scale(${mainSpring}) translateY(${interpolate(mainSpring, [0, 1], [-80, 0])}px)`,
          opacity: mainSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.purpleCyan} size={100} weight={900} style={{ display: 'block' }}>
          Learned
        </GradientText>
        <GradientText gradient={GRADIENTS.purpleCyan} size={100} weight={900} style={{ display: 'block' }}>
          Something? 🔥
        </GradientText>
      </div>

      {/* Pulsing follow button */}
      <div
        style={{
          opacity: followSpring,
          transform: `scale(${followSpring * pulse}) translateY(${interpolate(followSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            borderRadius: 100,
            padding: '30px 80px',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(124,58,237,0.6), 0 0 120px rgba(124,58,237,0.25)',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 52,
              fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
              fontWeight: 900,
              letterSpacing: '1px',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            FOLLOW FOR MORE AI 🤖
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 30, justifyContent: 'center' }}>
        {[
          { label: '❤️ Like', spr: likeSpr, color: '#EC4899', bg: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.5)' },
          { label: '🔁 Share', spr: shareSpr, color: '#06B6D4', bg: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.5)' },
        ].map(({ label, spr, color, bg, border }) => (
          <div
            key={label}
            style={{
              opacity: spr,
              transform: `scale(${spr})`,
              background: bg,
              border: `2px solid ${border}`,
              borderRadius: 60,
              padding: '20px 50px',
              color,
              fontSize: 40,
              fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 30px ${color}33`,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Daily content promise */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 100), fps }),
          background: 'rgba(15,15,40,0.85)',
          border: '1.5px solid rgba(167,139,250,0.3)',
          borderRadius: 20,
          padding: '24px 44px',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#A78BFA', fontSize: 30, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
          📱 Daily AI, LLMs & Tech breakdowns<br />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 26, fontWeight: 500 }}>
            New reel every day • No fluff
          </span>
        </p>
      </div>

      <Audio src={whoosh} startFrom={30} volume={0.4} />
      <Audio src={ding} startFrom={55} volume={0.5} />
      <Audio src={ding} startFrom={75} volume={0.45} />
    </div>
  );
};
