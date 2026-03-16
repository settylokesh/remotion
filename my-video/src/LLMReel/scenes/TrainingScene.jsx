import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
} from 'remotion';
import { whoosh, ding } from '@remotion/sfx';
import { GradientText } from '../components/GlowText';
import { DataStream } from '../components/DataStream';
import { GRADIENTS } from '../constants';

const DATA_FACTS = [
  { icon: '📚', label: 'Books & Literature', size: '45 GB', color: '#7C3AED' },
  { icon: '🌐', label: 'Web & Wikipedia', size: '300 GB', color: '#06B6D4' },
  { icon: '💻', label: 'Code Repositories', size: '95 GB', color: '#10B981' },
  { icon: '📰', label: 'News & Forums', size: '130 GB', color: '#F59E0B' },
];

export const TrainingScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const totalProgress = interpolate(frame, [30, 120], [0, 570], {
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
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Background data stream */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
        <DataStream columnCount={8} />
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-50, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
        }}
      >
        <GradientText gradient={GRADIENTS.cyanGreen} size={88} weight={900}>
          How It's Trained
        </GradientText>
      </div>

      {/* Total dataset counter */}
      <div
        style={{
          opacity: spring({ frame: Math.max(0, frame - 20), fps }),
          background: 'rgba(6,182,212,0.15)',
          border: '2px solid rgba(6,182,212,0.5)',
          borderRadius: 24,
          padding: '30px 60px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 60px rgba(6,182,212,0.2)',
        }}
      >
        <GradientText gradient={GRADIENTS.cyanGreen} size={120} weight={900}>
          {Math.round(totalProgress)} GB
        </GradientText>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 32, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"' }}>
          of training data
        </div>
      </div>

      {/* Data source cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
        {DATA_FACTS.map(({ icon, label, size, color }, i) => {
          const s = spring({
            frame: Math.max(0, frame - 40 - i * 18),
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          const barW = interpolate(
            Math.max(0, frame - 50 - i * 18),
            [0, 60],
            [0, 100],
            { extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
                background: `${color}15`,
                border: `1.5px solid ${color}44`,
                borderRadius: 18,
                padding: '20px 30px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: 44 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 28, fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"', fontWeight: 600, marginBottom: 8 }}>
                  {label}
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${barW}%`,
                      height: '100%',
                      background: color,
                      borderRadius: 4,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                </div>
              </div>
              <div style={{ color, fontSize: 36, fontFamily: '"JetBrains Mono", monospace, "Noto Color Emoji"', fontWeight: 700 }}>
                {size}
              </div>
            </div>
          );
        })}
      </div>

      <Audio src={whoosh} startFrom={0} volume={0.55} />
      <Audio src={ding} startFrom={50} volume={0.35} />
    </div>
  );
};
