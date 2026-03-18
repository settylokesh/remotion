import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { ding, whoosh, whip } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { StatCounter } from '../components/StatCounter';
import { ParticleField } from '../components/ParticleField';
import { GRADIENTS } from '../constants';

export const StatsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

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
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Dramatic background particles */}
      <ParticleField count={60} color="rgba(124,58,237,0.6)" speedFactor={200} />
      <ParticleField count={30} color="rgba(245,158,11,0.5)" speedFactor={350} />

      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-50, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.fire} size={85} weight={900}>
          🤯 Mind-Blowing
        </GradientText>
        <GradientText gradient={GRADIENTS.fire} size={85} weight={900}>
          Stats
        </GradientText>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center' }}>
        <StatCounter
          value={175}
          unit="B"
          label="GPT-3 Parameters"
          delay={15}
          gradient={GRADIENTS.purpleCyan}
        />
        <StatCounter
          value={100}
          unit="M+"
          label="ChatGPT users in 60 days"
          delay={40}
          gradient={GRADIENTS.pinkGold}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center' }}>
        <StatCounter
          value={570}
          unit="GB"
          label="GPT-3 Training Data"
          delay={65}
          gradient={GRADIENTS.cyanGreen}
        />
        <StatCounter
          value={96}
          unit="%"
          label="Human exam pass rate — GPT-4"
          delay={90}
          gradient={GRADIENTS.fire}
        />
      </div>

      {/* Scale callout */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 120), fps }),
          background: 'rgba(245,158,11,0.12)',
          border: '1.5px solid rgba(245,158,11,0.4)',
          borderRadius: 22,
          padding: '26px 48px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p style={{ color: '#FCD34D', fontSize: 30, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 700, margin: 0 }}>
          🚀 GPT-4 is estimated to have 1.8 TRILLION parameters
        </p>
      </div>

      <Audio src={whoosh} startFrom={0} volume={0.45} />
      <Audio src={ding} startFrom={15} volume={0.5} />
      <Audio src={ding} startFrom={40} volume={0.5} />
      <Audio src={ding} startFrom={65} volume={0.5} />
      <Audio src={ding} startFrom={90} volume={0.5} />
      <Audio src={whip} startFrom={120} volume={0.5} />
    </div>
  );
};
