import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadNotoColorEmoji } from "@remotion/google-fonts/NotoColorEmoji";

// Load all fonts used across compositions so they are available during rendering.
// "Noto Color Emoji" ensures emoji characters render correctly in headless Chromium.

loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

loadJetBrainsMono("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

loadNotoColorEmoji("normal", {
  weights: ["400"],
  subsets: ["emoji"],
});
