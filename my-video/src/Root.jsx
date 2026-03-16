import "./index.css";
import "./load-fonts";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { LLMReel } from "./LLMReel";
import { MCPReel } from "./MCPReel";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot = () => {
  return (
    <>
      {/* 🎬 Instagram Reel: MCP Explained — 90s · 1080×1920 · 30fps */}
      <Composition
        id="MCPReel"
        component={MCPReel}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🎬 Instagram Reel: LLM Explained — 60s · 1080×1920 · 30fps */}
      <Composition
        id="LLMReel"
        component={LLMReel}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "black",
        }}
      />
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
