import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { whoosh, ding } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { NeuralNetwork } from '../components/NeuralNetwork';
import { ParticleField } from '../components/ParticleField';
import { GRADIENTS } from '../constants';

const FUTURE_ITEMS = [
  { icon: '🧬', text: 'Drug discovery & protein folding', sub: 'AlphaFold revolutionized biology' },
  { icon: '🔬', text: 'Scientific research at scale', sub: 'Automated hypothesis + experimentation' },
  { icon: '🎨', text: 'Creative collaboration', sub: 'Writing, code, music, art, video' },
  { icon: '🤝', text: 'Agentic AI systems', sub: 'LLMs taking real-world actions' },
];

export const FutureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const networkOpacity = interpolate(frame, [20, 80], [0, 0.35], {
    extrapolateRight: 'clamp',
  });

  // Explosion scale
  const explodeScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 60 },
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
        position: 'relative',
        gap: 40,
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Animated neural network background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: networkOpacity,
          transform: `scale(${explodeScale * 1.2})`,
        }}
      >
        <NeuralNetwork />
      </div>

      {/* Heavy particles */}
      <ParticleField count={80} color="rgba(124,58,237,0.7)" speedFactor={180} />
      <ParticleField count={50} color="rgba(6,182,212,0.5)" speedFactor={250} />

      <div
        style={{
          transform: `scale(${explodeScale}) translateY(${interpolate(titleSpring, [0, 1], [-60, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <GradientText gradient={GRADIENTS.purpleCyan} size={95} weight={900}>
          The Future
        </GradientText>
        <GradientText gradient={GRADIENTS.purpleCyan} size={95} weight={900}>
          Is Now 🚀
        </GradientText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', zIndex: 2 }}>
        {FUTURE_ITEMS.map(({ icon, text, sub }, i) => {
          const s = spring({
            frame: Math.max(0, frame - 30 - i * 22),
            fps,
            config: { damping: 13, stiffness: 110 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 22,
                background: 'rgba(15,15,40,0.8)',
                border: '1.5px solid rgba(124,58,237,0.3)',
                borderRadius: 20,
                padding: '22px 30px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: 50, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ color: '#fff', fontSize: 30, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 700, marginBottom: 4 }}>
                  {text}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 24, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"' }}>
                  {sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Audio src={whoosh} startFrom={5} volume={0.4} />
      {FUTURE_ITEMS.map((_, i) => (
        <Audio key={i} src={ding} startFrom={30 + i * 22} endAt={40 + i * 22} volume={0.35} />
      ))}
    </div>
  );
};
