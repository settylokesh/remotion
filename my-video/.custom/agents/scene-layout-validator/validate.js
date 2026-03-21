/**
 * Scene Layout Validator
 *
 * Validates that Remotion scene layouts fit within the 1080x1920 viewport.
 * Checks for common overflow/overlap issues in scene JSX files.
 *
 * Usage: node validate.js <scene-file-path>
 *   e.g.  node validate.js src/MCPReel/scenes/ProblemScene.jsx
 */

const fs = require('fs');
const path = require('path');

const VIEWPORT = { width: 1080, height: 1920 };

// Max recommended font sizes
const FONT_LIMITS = {
  title: 90,
  subtitle: 36,
  cardLabel: 26,
  cardDesc: 22,
};

function validate(filePath) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  const src = fs.readFileSync(absPath, 'utf8');
  const warnings = [];
  const errors = [];

  // 1. Check for SceneWrapper gap/padding
  const gapMatch = src.match(/gap[=:]\s*\{?\s*(\d+)/);
  if (gapMatch) {
    const gap = parseInt(gapMatch[1], 10);
    if (gap > 40) {
      warnings.push(`Large gap value (${gap}px). For content-heavy scenes, keep gap <= 32px.`);
    }
  }

  // 2. Check for large font sizes
  const fontMatches = [...src.matchAll(/fontSize:\s*(\d+)/g)];
  for (const m of fontMatches) {
    const size = parseInt(m[1], 10);
    if (size > FONT_LIMITS.title) {
      errors.push(`Font size ${size}px exceeds max title size (${FONT_LIMITS.title}px).`);
    }
  }

  // 3. Check for rotate + translateX pattern (risky for overflow)
  const rotateTranslate = [...src.matchAll(/rotate\(\$\{[^}]+\}deg\)\s*translateX\((\d+)px\)/g)];
  for (const m of rotateTranslate) {
    const dist = parseInt(m[1], 10);
    if (dist > 120) {
      warnings.push(
        `rotate() + translateX(${dist}px) may cause elements to escape parent bounds. ` +
        `Consider using cardinal positioning (top/right/bottom/left) instead.`
      );
    }
  }

  // 4. Check for absolute positioning without explicit parent size
  const hasAbsolute = src.includes("position: 'absolute'") || src.includes('position:"absolute"');
  const hasExplicitParent = src.match(/width:\s*\d+,\s*height:\s*\d+/);
  if (hasAbsolute && !hasExplicitParent) {
    warnings.push(
      'Absolute-positioned children found but no parent with explicit width/height. ' +
      'This may cause overflow.'
    );
  }

  // 5. Check for emoji in text that might render inconsistently
  const emojiInContent = [...src.matchAll(/>[^<]*[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu)];
  if (emojiInContent.length > 3) {
    warnings.push(
      `${emojiInContent.length} emoji found in content. Emoji render size varies across platforms; ` +
      `consider using explicit fontSize on emoji spans.`
    );
  }

  // 6. Check for padding values
  const paddingMatch = src.match(/padding[=:]\s*['"](\d+)px\s+(\d+)px['"]/);
  if (paddingMatch) {
    const vPad = parseInt(paddingMatch[1], 10);
    const hPad = parseInt(paddingMatch[2], 10);
    if (vPad > 80) {
      warnings.push(`Vertical padding ${vPad}px is large. For dense scenes, use 50-60px.`);
    }
    if (hPad > 60) {
      warnings.push(`Horizontal padding ${hPad}px is large. Keep at 50-60px for dense scenes.`);
    }
  }

  // Report
  console.log(`\n--- Layout Validation: ${path.basename(filePath)} ---`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ No layout issues detected.');
  }
  for (const e of errors) console.log(`❌ ERROR: ${e}`);
  for (const w of warnings) console.log(`⚠️  WARN:  ${w}`);
  console.log('');

  return errors.length === 0 ? 0 : 1;
}

// CLI entry
const file = process.argv[2];
if (!file) {
  console.log('Usage: node validate.js <scene-file.jsx>');
  process.exit(1);
}
process.exit(validate(file));
