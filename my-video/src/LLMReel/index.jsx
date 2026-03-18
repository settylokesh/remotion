import { useCurrentFrame, useVideoConfig, interpolate, staticFile, Audio } from 'remotion';
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { noise2D } from '@remotion/noise';
import { COLORS, FONT, SCENE_DURATIONS, TRANSITION_DUR, TOTAL_FRAMES } from './constants';

import { HookScene } from './scenes/HookScene';
import { WhatIsLLMScene } from './scenes/WhatIsLLMScene';
import { TrainingScene } from './scenes/TrainingScene';
import { TokensScene } from './scenes/TokensScene';
import { AttentionScene } from './scenes/AttentionScene';
import { AppsScene } from './scenes/AppsScene';
import { StatsScene } from './scenes/StatsScene';
import { FutureScene } from './scenes/FutureScene';
import { CTAScene } from './scenes/CTAScene';

// Module-level constant — static string rebuilt every frame otherwise
const SCAN_LINES_BG = `repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0,0,0,0.03) 2px,
  rgba(0,0,0,0.03) 4px
)`;

const AmbientBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const orb1x = (noise2D('o1x', 0, frame / 600) + 1) / 2;
  const orb1y = (noise2D('o1y', 1, frame / 600) + 1) / 2;
  const orb2x = (noise2D('o2x', 2, frame / 500) + 1) / 2;
  const orb2y = (noise2D('o2y', 3, frame / 500) + 1) / 2;
  const orb3x = (noise2D('o3x', 4, frame / 700) + 1) / 2;
  const orb3y = (noise2D('o3y', 5, frame / 700) + 1) / 2;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: orb1x * width - 300,
          top: orb1y * height - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: orb2x * width - 250,
          top: orb2y * height - 250,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: orb3x * width - 200,
          top: orb3y * height - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

const ScanLines = () => {
  const frame = useCurrentFrame();
  const offsetY = (frame * 2) % 4;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        backgroundImage: SCAN_LINES_BG,
        backgroundPositionY: offsetY,
      }}
    />
  );
};

const LogoBar = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(0deg, rgba(5,5,16,0.9) 0%, transparent 100%)',
        zIndex: 50,
        opacity,
        gap: 16,
        paddingBottom: 16,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: COLORS.primary,
          boxShadow: `0 0 10px ${COLORS.primary}`,
        }}
      />
      <span
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 22,
          fontFamily: FONT.display,
          fontWeight: 500,
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}
      >
        Large Language Models
      </span>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: COLORS.secondary,
          boxShadow: `0 0 10px ${COLORS.secondary}`,
        }}
      />
    </div>
  );
};

const FADE_IN_FRAMES = 30;   // 1 s
const FADE_OUT_FRAMES = 60;  // 2 s

export const LLMReel = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background voiceover explanation */}
      <Audio
        src={staticFile('voiceover.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, FADE_IN_FRAMES, TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES],
            [0, 0.9, 0.9, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />

      <AmbientBackground />

      <TransitionSeries style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 20, stiffness: 60 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whatIsLLM}>
          <WhatIsLLMScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 18, stiffness: 70 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.training}>
          <TrainingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-top-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.tokens}>
          <TokensScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1080, height: 1920 })}
          timing={springTiming({ config: { damping: 20, stiffness: 60 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.attention}>
          <AttentionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 18, stiffness: 80 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.apps}>
          <AppsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-top-right' })}
          timing={springTiming({ config: { damping: 18, stiffness: 60 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.stats}>
          <StatsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: 'from-top' })}
          timing={springTiming({ config: { damping: 20, stiffness: 70 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.future}>
          <FutureScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 20, stiffness: 50 }, durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ScanLines />
      <LogoBar />
    </div>
  );
};
