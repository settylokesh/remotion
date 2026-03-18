import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { uiSwitch, whoosh, ding } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { ParticleField } from '../components/ParticleField';
import { GRADIENTS } from '../constants';

const APPS = [
  { name: 'ChatGPT', desc: '100M users in 60 days', emoji: '💬', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.4)' },
  { name: 'Claude', desc: 'Constitutional AI by Anthropic', emoji: '🧠', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.15)', borderColor: 'rgba(124,58,237,0.4)' },
  { name: 'Gemini', desc: 'Multimodal by Google DeepMind', emoji: '🌟', color: '#06B6D4', bgColor: 'rgba(6,182,212,0.15)', borderColor: 'rgba(6,182,212,0.4)' },
  { name: 'Llama 3', desc: 'Open source by Meta AI', emoji: '🦙', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.4)' },
  { name: 'Copilot', desc: 'AI-powered code generation', emoji: '👨‍💻', color: '#EC4899', bgColor: 'rgba(236,72,153,0.15)', borderColor: 'rgba(236,72,153,0.4)' },
];

export const AppsScene = () => {
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
        gap: 36,
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      <ParticleField count={35} color="rgba(16,185,129,0.5)" speedFactor={300} />

      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-50, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.cyanGreen} size={88} weight={900}>
          Powering the
        </GradientText>
        <GradientText gradient={GRADIENTS.cyanGreen} size={88} weight={900}>
          AI Revolution
        </GradientText>
      </div>

      {APPS.map(({ name, desc, emoji, color, bgColor, borderColor }, i) => {
        const s = spring({
          frame: Math.max(0, frame - 20 - i * 22),
          fps,
          config: { damping: 13, stiffness: 110 },
        });
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -50 : 50, 0])}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              background: bgColor,
              border: `2px solid ${borderColor}`,
              borderRadius: 22,
              padding: '22px 34px',
              width: '100%',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 30px ${color}18`,
            }}
          >
            <span style={{ fontSize: 54 }}>{emoji}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: color,
                  fontSize: 38,
                  fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
                  fontWeight: 800,
                  marginBottom: 4,
                  textShadow: `0 0 20px ${color}66`,
                }}
              >
                {name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 26, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"' }}>
                {desc}
              </div>
            </div>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `${color}33`,
                border: `2px solid ${color}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}` }} />
            </div>
          </div>
        );
      })}

      {APPS.map((_, i) => (
        <Audio key={i} src={uiSwitch} startFrom={20 + i * 22} endAt={30 + i * 22} volume={0.35} />
      ))}
      <Audio src={whoosh} startFrom={0} volume={0.45} />
    </div>
  );
};
