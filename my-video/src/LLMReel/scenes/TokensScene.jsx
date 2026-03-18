import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { mouseClick, uiSwitch } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { TokenBlock } from '../components/TokenBlock';
import { ParticleField } from '../components/ParticleField';
import { GRADIENTS } from '../constants';

const SENTENCE_TOKENS = ['The', ' AI', ' rev', 'olution', ' is', ' NOW', ' 🔥'];

export const TokensScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  // When tokens are revealed
  const tokensVisible = interpolate(frame, [30, 35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Arrow animation
  const arrowScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 150 },
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
        gap: 48,
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      <ParticleField count={35} color="rgba(245,158,11,0.5)" speedFactor={260} />

      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-50, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.pinkGold} size={92} weight={900}>
          Tokenization
        </GradientText>
      </div>

      {/* Explanation card */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 10), fps }),
          background: 'rgba(15,15,40,0.85)',
          border: '1.5px solid rgba(245,158,11,0.35)',
          borderRadius: 22,
          padding: '30px 44px',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 32,
            fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"',
            fontWeight: 500,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          LLMs split text into <span style={{ color: '#FCD34D', fontWeight: 700 }}>tokens</span> —<br />
          chunks of characters they can understand
        </p>
      </div>

      {/* Raw text */}
      <div style={{ textAlign: 'center', opacity: spring({ frame: Math.max(0, frame - 15), fps }) }}>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 26, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', marginBottom: 12 }}>
          Raw input:
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 52,
            fontFamily: '"JetBrains Mono", monospace, "Noto Color Emoji"',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 14,
            padding: '16px 36px',
          }}
        >
          "The AI revolution is NOW 🔥"
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          transform: `scale(${arrowScale})`,
          opacity: arrowScale,
          fontSize: 60,
          color: '#F59E0B',
          textShadow: '0 0 20px #F59E0B',
        }}
      >
        ↓
      </div>

      {/* Tokens */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
          opacity: tokensVisible,
        }}
      >
        {SENTENCE_TOKENS.map((token, i) => (
          <TokenBlock key={i} token={token} index={i} delay={35 + i * 10} />
        ))}
      </div>

      {/* Token count */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 80), fps }),
          background: 'rgba(245,158,11,0.15)',
          border: '1.5px solid rgba(245,158,11,0.4)',
          borderRadius: 50,
          padding: '12px 36px',
        }}
      >
        <span style={{ color: '#FCD34D', fontSize: 32, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 700 }}>
          7 tokens · GPT-4 uses up to 128K tokens
        </span>
      </div>

      {SENTENCE_TOKENS.map((_, i) => (
        <Audio key={i} src={mouseClick} startFrom={35 + i * 10} endAt={45 + i * 10} volume={0.35} />
      ))}
    </div>
  );
};
