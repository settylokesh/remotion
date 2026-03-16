#!/usr/bin/env node
/**
 * Render Troubleshooter — diagnoses common rendering issues.
 *
 * Usage: node .custom/agents/render-troubleshooter/diagnose.js [ReelName]
 *
 * Checks:
 *  1. System emoji font installed
 *  2. src/load-fonts.js exists and loads NotoColorEmoji
 *  3. Root.jsx imports load-fonts
 *  4. fontFamily declarations include emoji fallback
 *  5. Python dependencies available
 *  6. ffmpeg available
 *  7. Voiceover sync (delegates to voiceover-sync-validator if reel specified)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../../..");
const SRC = path.join(ROOT, "src");

let errors = 0;
let warnings = 0;

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}
function fail(msg) {
  console.log(`  ❌ ${msg}`);
  errors++;
}
function warn(msg) {
  console.log(`  ⚠️  ${msg}`);
  warnings++;
}

// ── 1. System emoji font ──
console.log("\n🔍 Checking system emoji font...");
try {
  const fcList = execSync("fc-list", { encoding: "utf8" });
  if (/noto color emoji/i.test(fcList)) {
    pass("Noto Color Emoji is installed");
  } else {
    fail(
      'Noto Color Emoji NOT found. Run: sudo apt-get install -y fonts-noto-color-emoji && fc-cache -f'
    );
  }
} catch {
  warn("Could not run fc-list (font checks skipped on this platform)");
}

// ── 2. load-fonts.js ──
console.log("\n🔍 Checking src/load-fonts.js...");
const loadFontsPath = path.join(SRC, "load-fonts.js");
if (fs.existsSync(loadFontsPath)) {
  const content = fs.readFileSync(loadFontsPath, "utf8");
  if (content.includes("NotoColorEmoji")) {
    pass("load-fonts.js loads NotoColorEmoji");
  } else {
    fail("load-fonts.js exists but does NOT load NotoColorEmoji");
  }
  if (content.includes("Inter")) {
    pass("load-fonts.js loads Inter");
  } else {
    warn("load-fonts.js does not load Inter font");
  }
  if (content.includes("SpaceGrotesk")) {
    pass("load-fonts.js loads SpaceGrotesk");
  } else {
    warn("load-fonts.js does not load SpaceGrotesk font");
  }
  if (content.includes("JetBrainsMono")) {
    pass("load-fonts.js loads JetBrainsMono");
  } else {
    warn("load-fonts.js does not load JetBrainsMono font");
  }
} else {
  fail("src/load-fonts.js does NOT exist — fonts will not be bundled for rendering");
}

// ── 3. Root.jsx imports load-fonts ──
console.log("\n🔍 Checking Root.jsx...");
const rootPath = path.join(SRC, "Root.jsx");
if (fs.existsSync(rootPath)) {
  const rootContent = fs.readFileSync(rootPath, "utf8");
  if (rootContent.includes("load-fonts")) {
    pass("Root.jsx imports load-fonts");
  } else {
    fail('Root.jsx does NOT import load-fonts. Add: import "./load-fonts";');
  }
} else {
  fail("src/Root.jsx not found");
}

// ── 4. fontFamily emoji fallback ──
console.log("\n🔍 Checking fontFamily emoji fallbacks...");
const reelDirs = ["LLMReel", "MCPReel"];
for (const reel of reelDirs) {
  const constantsPath = path.join(SRC, reel, "constants.js");
  if (!fs.existsSync(constantsPath)) continue;

  const constantsContent = fs.readFileSync(constantsPath, "utf8");
  const fontMatches = constantsContent.match(/fontFamily.*?['"`]([^'"`]+)['"`]/g) ||
    constantsContent.match(/display:\s*['"]([^'"]+)['"]/g) ||
    constantsContent.match(/mono:\s*['"]([^'"]+)['"]/g);

  // Check the FONT object
  if (constantsContent.includes("Noto Color Emoji")) {
    pass(`${reel}/constants.js includes Noto Color Emoji fallback`);
  } else {
    fail(`${reel}/constants.js is missing "Noto Color Emoji" in FONT declarations`);
  }

  // Check scene files for inline fontFamily without emoji fallback
  const scenesDir = path.join(SRC, reel, "scenes");
  if (fs.existsSync(scenesDir)) {
    const sceneFiles = fs.readdirSync(scenesDir).filter((f) => f.endsWith(".jsx"));
    for (const file of sceneFiles) {
      const filePath = path.join(scenesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const fontFamilyMatches = fileContent.match(/fontFamily:\s*['"]([^'"]+)['"]/g);
      if (fontFamilyMatches) {
        for (const match of fontFamilyMatches) {
          if (!match.includes("FONT.") && !match.includes("Noto Color Emoji")) {
            fail(`${reel}/scenes/${file}: inline fontFamily missing emoji fallback: ${match}`);
          }
        }
      }
    }
  }
}

// ── 5. Python dependencies ──
console.log("\n🔍 Checking Python dependencies...");
try {
  execSync('python3 -c "import edge_tts"', { encoding: "utf8" });
  pass("edge-tts is installed");
} catch {
  warn("edge-tts not installed. Run: pip install edge-tts");
}
try {
  execSync('python3 -c "import pydub"', { encoding: "utf8" });
  pass("pydub is installed");
} catch {
  warn("pydub not installed. Run: pip install pydub");
}

// ── 6. ffmpeg ──
console.log("\n🔍 Checking ffmpeg...");
try {
  execSync("ffmpeg -version", { encoding: "utf8" });
  pass("ffmpeg is installed");
} catch {
  warn("ffmpeg not installed. Run: sudo apt-get install ffmpeg");
}

// ── 7. Voiceover sync (if reel specified) ──
const reelName = process.argv[2];
if (reelName) {
  console.log(`\n🔍 Checking voiceover sync for ${reelName}...`);
  const validatorPath = path.join(
    ROOT,
    ".custom/agents/voiceover-sync-validator/validate.js"
  );
  if (fs.existsSync(validatorPath)) {
    try {
      const result = execSync(`node "${validatorPath}" ${reelName}`, {
        encoding: "utf8",
        cwd: ROOT,
      });
      console.log(result);
    } catch (e) {
      console.log(e.stdout || e.message);
    }
  } else {
    warn("voiceover-sync-validator not found, skipping sync check");
  }
}

// ── Summary ──
console.log("\n" + "─".repeat(50));
if (errors === 0 && warnings === 0) {
  console.log("✅ All checks passed — rendering environment is ready.");
} else {
  if (errors > 0) console.log(`❌ ${errors} error(s) found — these WILL cause rendering issues.`);
  if (warnings > 0) console.log(`⚠️  ${warnings} warning(s) — may cause issues in some environments.`);
}
console.log("");
process.exit(errors > 0 ? 1 : 0);
