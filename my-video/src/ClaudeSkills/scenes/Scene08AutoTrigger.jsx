import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Background } from '../components/Background';
import { FONT, COLORS } from '../constants';

export const Scene08AutoTrigger = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS  = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 12, stiffness: 100 } });
  const step1S   = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 90 } });
  const arrow1S  = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 14, stiffness: 100 } });
  const step2S   = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 14, stiffness: 90 } });
  const arrow2S  = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 14, stiffness: 100 } });
  const step3S   = spring({ frame: Math.max(0, frame - 125), fps, config: { damping: 14, stiffness: 90 } });

  const Block = ({ icon, text, highlight, s }) => (
    <div style={{
      opacity: s,
      transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
      background: highlight ? COLORS.accentLight : COLORS.codeBg,
      border: `1.5px solid ${highlight ? COLORS.accentBorder : COLORS.codeBorder}`,
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <span style={{ fontSize: 36, flexShrink: 0 }}>{icon}</span>
      <span style={{
        fontFamily: FONT.display,
        fontSize: 30,
        fontWeight: highlight ? 600 : 500,
        color: highlight ? COLORS.accent : COLORS.text,
      }}>
        {text}
      </span>
    </div>
  );

  const Arrow = ({ s }) => (
    <div style={{
      opacity: s,
      transform: `scaleY(${interpolate(s, [0, 1], [0, 1])})`,
      transformOrigin: 'top center',
      display: 'flex',
      justifyContent: 'center',
      padding: '4px 0',
    }}>
      <span style={{ fontSize: 32, color: COLORS.accent }}>↓</span>
    </div>
  );

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 80px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Background />

      <div style={{ zIndex: 1, width: '100%', maxWidth: 840 }}>
        {/* Header */}
        <div style={{
          opacity: headerS,
          transform: `translateY(${interpolate(headerS, [0, 1], [30, 0])}px)`,
          fontFamily: FONT.display,
          fontSize: 60,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: '-1px',
          marginBottom: 36,
        }}>
          Auto-trigger
        </div>

        <Block
          icon="💬"
          text='"can you explain this code?"'
          highlight={false}
          s={step1S}
        />
        <Arrow s={arrow1S} />
        <Block
          icon="🔍"
          text='Claude reads: description: "Use when explaining code…"'
          highlight={false}
          s={step2S}
        />
        <Arrow s={arrow2S} />
        <Block
          icon="✅"
          text="Skill auto-loads — no slash needed"
          highlight={true}
          s={step3S}
        />
      </div>

      <Audio src="https://remotion.media/switch.wav" startFrom={0} endAt={18} volume={0.2} />
    </div>
  );
};
