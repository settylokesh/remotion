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

const WORDS = ['The', 'AI', 'model', 'predicts', 'next', 'words'];

export const AttentionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  // Attention line opacity animated
  const lineProgress = interpolate(frame, [40, 130], [0, 1], {
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
        position: 'relative',
        gap: 44,
        padding: '80px 50px',
        overflow: 'hidden',
      }}
    >
      <ParticleField count={45} color="rgba(236,72,153,0.55)" speedFactor={250} />

      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-50, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.pinkGold} size={90} weight={900}>
          Attention
        </GradientText>
        <GradientText gradient={GRADIENTS.pinkGold} size={90} weight={900}>
          Mechanism
        </GradientText>
      </div>

      {/* Quote */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 15), fps }),
          background: 'rgba(236,72,153,0.12)',
          border: '1.5px solid rgba(236,72,153,0.4)',
          borderRadius: 22,
          padding: '28px 44px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p style={{ color: '#F9A8D4', fontSize: 30, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
          "Attention Is All You Need" — Vaswani et al. 2017
        </p>
      </div>

      {/* Attention visualization */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 30), fps }),
          background: 'rgba(15,15,40,0.85)',
          border: '1.5px solid rgba(236,72,153,0.25)',
          borderRadius: 24,
          padding: '36px 40px',
          backdropFilter: 'blur(12px)',
          width: '100%',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 26, fontWeight: 500, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', margin: '0 0 20px 0', textAlign: 'center' }}>
          Each word "attends" to relevant context:
        </p>

        {/* Word row with attention SVG */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
            {WORDS.map((word, i) => {
              const wp = spring({
                frame: Math.max(0, frame - 40 - i * 8),
                fps,
                config: { damping: 14, stiffness: 160 },
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: wp,
                    transform: `translateY(${interpolate(wp, [0, 1], [20, 0])}px)`,
                    background: i === 5 ? 'rgba(236,72,153,0.35)' : 'rgba(255,255,255,0.07)',
                    border: i === 5 ? '2px solid #EC4899' : '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                    padding: '12px 18px',
                    color: i === 5 ? '#F9A8D4' : '#fff',
                    fontSize: 28,
                    fontFamily: '"JetBrains Mono", monospace, "Noto Color Emoji"',
                    fontWeight: i === 5 ? 700 : 500,
                    textAlign: 'center',
                    minWidth: 100,
                    boxShadow: i === 5 ? '0 0 24px rgba(236,72,153,0.4)' : 'none',
                  }}
                >
                  {word}
                </div>
              );
            })}
          </div>

          {/* Attention lines SVG */}
          <svg
            width="100%"
            height={60}
            style={{ overflow: 'visible', marginTop: -8 }}
          >
            {[0, 1, 2, 3, 4].map((srcIdx) => {
              const positions = [83, 183, 290, 420, 545, 660];
              const x1 = positions[srcIdx];
              const x2 = positions[5];
              const attention = [0.9, 0.6, 0.8, 0.95, 0.7][srcIdx];
              return (
                <path
                  key={srcIdx}
                  d={`M ${x1} 0 C ${x1} 40, ${x2} 40, ${x2} 60`}
                  fill="none"
                  stroke={`rgba(236,72,153,${attention * lineProgress})`}
                  strokeWidth={attention * 4}
                />
              );
            })}
          </svg>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 24, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', margin: '16px 0 0 0', textAlign: 'center' }}>
          Attention weights show which words matter most
        </p>
      </div>

      {/* Key pillars */}
      {['Multi-Head Attention', 'Positional Encoding', 'Self-Supervised Learning'].map((item, i) => {
        const s = spring({
          frame: Math.max(0, frame - 90 - i * 18),
          fps,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EC4899', boxShadow: '0 0 12px #EC4899' }} />
            <span style={{ color: '#F9A8D4', fontSize: 30, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 600 }}>
              {item}
            </span>
          </div>
        );
      })}

      <Audio src={whoosh} startFrom={0} volume={0.5} />
      <Audio src={ding} startFrom={40} volume={0.4} />
      <Audio src={ding} startFrom={100} volume={0.35} />
    </div>
  );
};
