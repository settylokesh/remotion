# Emoji & Font Rendering

## Problem

Remotion renders frames using headless Chromium, which does **not** include emoji fonts or custom web fonts. Characters outside the basic font set render as □ (box/tofu) in the final video, even though they display correctly in the Remotion Studio preview (which uses the full desktop browser).

## Diagnosis

Symptoms:
- Emoji characters (🚀, ✨, 🤖, etc.) appear as □ in rendered MP4
- Custom fonts (Space Grotesk, Inter, JetBrains Mono) fall back to system defaults
- Preview in `npm run dev` looks fine, only the rendered output is broken

## Required Setup (3 layers)

### Layer 1: System emoji font

On Linux (including CI/CD, Docker, Codespaces):
```bash
sudo apt-get install -y fonts-noto-color-emoji
fc-cache -f
```

macOS and Windows have built-in emoji fonts (Apple Color Emoji, Segoe UI Emoji).

### Layer 2: Remotion font bundle (`src/load-fonts.js`)

Load all fonts via `@remotion/google-fonts` so they are **bundled into the Remotion build** and don't depend on the system:

```js
import { loadFont as loadNotoColorEmoji } from "@remotion/google-fonts/NotoColorEmoji";

loadNotoColorEmoji("normal", {
  weights: ["400"],
  subsets: ["emoji"],
});
```

This file must be imported from `Root.jsx`:
```js
import "./load-fonts";
```

### Layer 3: CSS fontFamily fallback

Every `fontFamily` declaration (in constants.js and inline styles) must include `"Noto Color Emoji"` as the **last** fallback:

```js
// ✅ Correct
fontFamily: '"Space Grotesk", sans-serif, "Noto Color Emoji"'

// ❌ Wrong — emoji will render as boxes
fontFamily: '"Space Grotesk", sans-serif'
```

## Adding a New Font

1. Check if it exists in `@remotion/google-fonts`:
   ```bash
   ls node_modules/@remotion/google-fonts/dist/esm/ | grep -i "FontName"
   ```
2. Add a `loadFont` call in `src/load-fonts.js` with specific weights and subsets
3. Add the font name to the `fontFamily` string in the relevant `constants.js`
4. Always keep `"Noto Color Emoji"` as the last fallback

## Anti-Patterns

- Relying on system-installed fonts without `@remotion/google-fonts` loading
- Using `fontFamily` without emoji fallback on elements that display emoji
- Loading all weights/subsets of a font (causes render timeouts)
- Putting emoji font first in the fontFamily chain (blocks text font matching)
