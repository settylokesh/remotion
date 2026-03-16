import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { whoosh, uiSwitch } from '@remotion/sfx';
import { GlowText, GradientText } from '../components/GlowText';
import { ParticleField } from '../components/ParticleField';
import { COLORS, GRADIENTS } from '../constants';

const DEFINITION = [
  'A deep learning model',
  'trained on massive text data',
  'that understands & generates',
  'human-like language. ✨',
];

export const WhatIsLLMScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  const acronymLetters = [
    { letter: 'L', word: 'Large', color: COLORS.primary },
    { letter: 'L', word: 'Language', color: COLORS.secondary },
    { letter: 'M', word: 'Model', color: COLORS.highlight },
  ];

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
        gap: 50,
        padding: '80px 60px',
      }}
    >
      <ParticleField count={40} color="rgba(6,182,212,0.5)" speedFactor={280} />

      {/* Acronym breakdown */}
      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-60, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.purpleCyan} size={100} weight={900}>
          What is an LLM?
        </GradientText>
      </div>

      {/* L L M breakdown cards */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
        }}
      >
        {acronymLetters.map(({ letter, word, color }, i) => {
          const s = spring({
            frame: Math.max(0, frame - i * 20),
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          return (
            <div
              key={i}
              style={{
                transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
                opacity: s,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                background: `${color}22`,
                border: `2px solid ${color}66`,
                borderRadius: 20,
                padding: '28px 30px',
                minWidth: 220,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 40px ${color}22`,
              }}
            >
              <span
                style={{
                  fontSize: 100,
                  fontWeight: 900,
                  color,
                  fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
                  textShadow: `0 0 30px ${color}88`,
                  lineHeight: 1,
                }}
              >
                {letter}
              </span>
              <span
                style={{
                  fontSize: 30,
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
                  fontWeight: 600,
                }}
              >
                {word}
              </span>
            </div>
          );
        })}
      </div>

      {/* Definition lines */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
          background: 'rgba(15,15,40,0.8)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 24,
          padding: '40px 50px',
          backdropFilter: 'blur(14px)',
          width: '100%',
          maxWidth: 900,
        }}
      >
        {DEFINITION.map((line, i) => {
          const s = spring({
            frame: Math.max(0, frame - 60 - i * 18),
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
                color: i === DEFINITION.length - 1 ? '#A78BFA' : 'rgba(255,255,255,0.85)',
                fontSize: 34,
                fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
                fontWeight: i === DEFINITION.length - 1 ? 700 : 500,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      <Audio src={whoosh} startFrom={0} volume={0.5} />
      <Audio src={uiSwitch} startFrom={20} volume={0.4} />
      <Audio src={uiSwitch} startFrom={40} volume={0.4} />
      <Audio src={uiSwitch} startFrom={60} volume={0.4} />
    </div>
  );
};
