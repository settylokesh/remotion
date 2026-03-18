import { useCurrentFrame, interpolate, staticFile, Audio } from 'remotion';
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';

import { Scene01Hook }        from './scenes/Scene01Hook';
import { Scene02WhatIsSkill } from './scenes/Scene02WhatIsSkill';
import { Scene03WhereLive }   from './scenes/Scene03WhereLive';
import { Scene04Structure }   from './scenes/Scene04Structure';
import { Scene05Frontmatter } from './scenes/Scene05Frontmatter';
import { Scene06SlashCommand } from './scenes/Scene06SlashCommand';
import { Scene07Arguments }   from './scenes/Scene07Arguments';
import { Scene08AutoTrigger } from './scenes/Scene08AutoTrigger';
import { Scene09DisableAuto } from './scenes/Scene09DisableAuto';
import { Scene10ShellInject } from './scenes/Scene10ShellInject';
import { Scene11AllowedTools } from './scenes/Scene11AllowedTools';
import { Scene12RealExample } from './scenes/Scene12RealExample';
import { Scene13Community }   from './scenes/Scene13Community';
import { Scene14Outro }       from './scenes/Scene14Outro';

import {
  COLORS, FONT,
  SCENE_DURATIONS,
  TRANSITION_DUR,
  TOTAL_FRAMES,
} from './constants';

// Module-level constants — never reconstruct per-frame
const ROOT_STYLE = {
  width: '100%',
  height: '100%',
  background: COLORS.bg,
  position: 'relative',
  overflow: 'hidden',
  fontFamily: FONT.display,
};

const SERIES_STYLE = { position: 'absolute', inset: 0, zIndex: 1 };

// Thin progress bar at the top
const ProgressBar = () => {
  const frame = useCurrentFrame();
  const progress = frame / TOTAL_FRAMES;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 4, background: 'rgba(108,92,231,0.08)',
      zIndex: 200, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${COLORS.accent}, rgba(108,92,231,0.6))`,
        borderRadius: '0 3px 3px 0',
      }} />
    </div>
  );
};

// Brand bar at the bottom
const BrandBar = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(0deg, rgba(240,240,255,0.92) 0%, transparent 100%)',
      zIndex: 100, opacity, gap: 14, paddingBottom: 20,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: COLORS.accent,
        boxShadow: `0 0 10px ${COLORS.accent}`,
      }} />
      <span style={{
        color: COLORS.textMuted,
        fontSize: 22,
        fontFamily: FONT.display,
        fontWeight: 600,
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Claude Skills
      </span>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: COLORS.accent,
        boxShadow: `0 0 10px ${COLORS.accent}`,
      }} />
    </div>
  );
};

const FADE_IN  = 20;
const FADE_OUT = 50;

export const ClaudeSkills = () => {
  return (
    <div style={ROOT_STYLE}>
      {/* Voiceover */}
      <Audio
        src={staticFile('voiceover_claude_skills.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, FADE_IN, TOTAL_FRAMES - FADE_OUT, TOTAL_FRAMES],
            [0, 1.0, 1.0, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )
        }
      />

      <ProgressBar />

      <TransitionSeries style={SERIES_STYLE}>

        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene01Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 18, stiffness: 70 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 2 — What Is a Skill */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whatIsSkill}>
          <Scene02WhatIsSkill />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 18, stiffness: 75 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 3 — Where Skills Live */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whereLive}>
          <Scene03WhereLive />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 20, stiffness: 60 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 4 — SKILL.md Structure */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.structure}>
          <Scene04Structure />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 18, stiffness: 80 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 5 — Frontmatter Fields */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.frontmatter}>
          <Scene05Frontmatter />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1080, height: 1920 })}
          timing={springTiming({ config: { damping: 20, stiffness: 60 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 6 — Slash Commands */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.slashCommand}>
          <Scene06SlashCommand />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-top-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        {/* 7 — Arguments */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.arguments}>
          <Scene07Arguments />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 18, stiffness: 75 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 8 — Auto-Trigger */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.autoTrigger}>
          <Scene08AutoTrigger />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 20, stiffness: 70 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 9 — Disable Auto */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.disableAuto}>
          <Scene09DisableAuto />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 20, stiffness: 55 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 10 — Shell Inject */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.shellInject}>
          <Scene10ShellInject />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 18, stiffness: 75 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 11 — Allowed Tools */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.allowedTools}>
          <Scene11AllowedTools />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-bottom-right' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        {/* 12 — Real Example */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.realExample}>
          <Scene12RealExample />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 20, stiffness: 70 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 13 — Community */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.community}>
          <Scene13Community />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 20, stiffness: 55 }, durationInFrames: TRANSITION_DUR })}
        />

        {/* 14 — Outro */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Scene14Outro />
        </TransitionSeries.Sequence>

      </TransitionSeries>

      <BrandBar />
    </div>
  );
};

export default ClaudeSkills;
