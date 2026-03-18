import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { ding } from '@remotion/sfx';
import { ParticleField } from '../components/ParticleField';
import { NeuralNetwork } from '../components/NeuralNetwork';
import { GlowText, GradientText } from '../components/GlowText';
import { COLORS, GRADIENTS } from '../constants';

export const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subtitleSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const badgeSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const networkOpacity = interpolate(frame, [30, 80], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const bgScale = interpolate(frame, [0, 150], [1.08, 1], {
    extrapolateRight: 'clamp',
  });

  const flashOpacity = interpolate(frame, [0, 6, 14], [1, 0.6, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: GRADIENTS.midnight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Flash on boom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(124,58,237,0.8)',
          opacity: flashOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Background neural network */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: networkOpacity * 0.45,
          transform: `scale(${bgScale})`,
        }}
      >
        <NeuralNetwork />
      </div>

      {/* Particles */}
      <ParticleField count={70} color="rgba(124, 58, 237, 0.75)" speedFactor={220} />
      <ParticleField count={40} color="rgba(6, 182, 212, 0.5)" speedFactor={300} />

      {/* BADGE */}
      <div
        style={{
          transform: `scale(${badgeSpring}) translateY(${interpolate(badgeSpring, [0, 1], [-40, 0])}px)`,
          opacity: badgeSpring,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            background: 'rgba(124,58,237,0.25)',
            border: '1.5px solid rgba(167,139,250,0.6)',
            borderRadius: 50,
            padding: '10px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ fontSize: 28 }}>🤖</span>
          <span
            style={{
              color: '#A78BFA',
              fontSize: 28,
              fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            AI Explained
          </span>
        </div>
      </div>

      {/* Main title */}
      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [80, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <GlowText size={110} color={COLORS.primary} style={{ lineHeight: 1.05, display: 'block' }}>
          The Brain
        </GlowText>
        <GlowText size={110} color={COLORS.primary} style={{ lineHeight: 1.05, display: 'block' }}>
          Behind
        </GlowText>
        <GradientText
          gradient={GRADIENTS.purpleCyan}
          size={118}
          weight={900}
          style={{ lineHeight: 1.05, display: 'block' }}
        >
          Every AI
        </GradientText>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [40, 0])}px)`,
          opacity: subtitleSpring * 0.9,
          marginTop: 40,
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 40,
            fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
            fontWeight: 500,
            letterSpacing: '1px',
          }}
        >
          Large Language Models Explained
        </span>
      </div>

      {/* Audio */}
      <Audio src={ding} startFrom={0} endAt={40} volume={0.4} />
    </div>
  );
};
