#!/usr/bin/env node
/**
 * Voiceover Sync Validator
 *
 * Validates that a Remotion reel's scene durations, voiceover generation script,
 * and composition registration are all in sync.
 *
 * Usage: node validate.js <reel-name>
 *   e.g. node validate.js LLMReel
 *        node validate.js MCPReel
 */

const fs = require('fs');
const path = require('path');

const REEL_NAME = process.argv[2];
if (!REEL_NAME) {
  console.error('Usage: node validate.js <ReelName>');
  process.exit(1);
}

const SRC_DIR = path.resolve(__dirname, '../../../src');
const SCRIPTS_DIR = path.resolve(__dirname, '../../../scripts');

let errors = [];
let warnings = [];

function error(msg) { errors.push(`ERROR: ${msg}`); }
function warn(msg) { warnings.push(`WARN: ${msg}`); }

// 1. Read the constants file
const reelDir = path.join(SRC_DIR, REEL_NAME);
if (!fs.existsSync(reelDir)) {
  console.error(`Reel directory not found: ${reelDir}`);
  process.exit(1);
}

const constantsPath = path.join(reelDir, 'constants.js');
const indexPath = path.join(reelDir, 'index.jsx');

if (!fs.existsSync(constantsPath)) {
  error(`No constants.js found in ${reelDir}`);
}

const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// 2. Check that index.jsx imports SCENE_DURATIONS from constants
if (!indexContent.includes('SCENE_DURATIONS') || !indexContent.includes("from './constants'")) {
  error('index.jsx does not import SCENE_DURATIONS from constants.js');
}

// 3. Check that index.jsx does NOT define its own SCENE_DURATIONS
const localDurMatch = indexContent.match(/^const SCENE_DURATIONS\s*=/m);
if (localDurMatch) {
  error('index.jsx defines its own SCENE_DURATIONS — should import from constants.js');
}

// 4. Check constants.js exports SCENE_DURATIONS
if (!constantsContent.includes('export const SCENE_DURATIONS')) {
  error('constants.js does not export SCENE_DURATIONS');
}

// 5. Extract scene durations from constants.js
const durMatch = constantsContent.match(/SCENE_DURATIONS\s*=\s*\{([^}]+)\}/);
const sceneDurations = {};
if (durMatch) {
  const entries = durMatch[1].matchAll(/(\w+)\s*:\s*(\d+)/g);
  for (const [, name, dur] of entries) {
    sceneDurations[name] = parseInt(dur);
  }
}

// 6. Extract TRANSITION_DUR
const tdMatch = constantsContent.match(/TRANSITION_DUR\s*=\s*(\d+)/);
const transitionDur = tdMatch ? parseInt(tdMatch[1]) : 0;

// 7. Extract TOTAL_FRAMES
const tfMatch = constantsContent.match(/TOTAL_FRAMES\s*=\s*(\d+)/);
const totalFrames = tfMatch ? parseInt(tfMatch[1]) : 0;

// 8. Validate math
const sceneNames = Object.keys(sceneDurations);
const numScenes = sceneNames.length;
const numTransitions = numScenes - 1;
const grossSum = Object.values(sceneDurations).reduce((a, b) => a + b, 0);
const calculatedNet = grossSum - (numTransitions * transitionDur);

if (calculatedNet !== totalFrames) {
  error(`Duration math mismatch: sum(${grossSum}) - ${numTransitions}×${transitionDur} = ${calculatedNet}, but TOTAL_FRAMES = ${totalFrames}`);
}

// 9. Check Root.jsx composition
const rootPath = path.join(SRC_DIR, 'Root.jsx');
if (fs.existsSync(rootPath)) {
  const rootContent = fs.readFileSync(rootPath, 'utf-8');
  const compMatch = rootContent.match(new RegExp(`id="${REEL_NAME}"[\\s\\S]*?durationInFrames=\\{(\\d+)\\}`));
  if (compMatch) {
    const regDuration = parseInt(compMatch[1]);
    if (regDuration !== totalFrames) {
      error(`Root.jsx registers ${REEL_NAME} with durationInFrames={${regDuration}} but TOTAL_FRAMES=${totalFrames}`);
    }
  } else {
    warn(`Could not find ${REEL_NAME} composition in Root.jsx`);
  }
}

// 10. Check voiceover script exists and uses per-scene generation
const voScripts = fs.readdirSync(SCRIPTS_DIR).filter(f => f.startsWith('generate-voiceover') && f.endsWith('.py'));
const reelLower = REEL_NAME.toLowerCase();
const voScript = voScripts.find(f => f.includes(reelLower.replace('reel', ''))) || voScripts[0];

if (voScript) {
  const voContent = fs.readFileSync(path.join(SCRIPTS_DIR, voScript), 'utf-8');
  if (!voContent.includes('SCENE_SCRIPTS') && !voContent.includes('SCENE_ORDER')) {
    error(`Voiceover script ${voScript} does not use per-scene generation (missing SCENE_SCRIPTS/SCENE_ORDER)`);
  }
  if (voContent.match(/^SCRIPT\s*=\s*\(/m) && !voContent.match(/^SCENE_SCRIPTS\s*=\s*\{/m)) {
    error(`Voiceover script ${voScript} uses single continuous SCRIPT instead of per-scene SCENE_SCRIPTS`);
  }
} else {
  warn('No voiceover generation script found');
}

// 11. Report
console.log(`\n=== Voiceover Sync Validation: ${REEL_NAME} ===\n`);
console.log(`Scenes: ${numScenes}`);
console.log(`Gross frame sum: ${grossSum}`);
console.log(`Transitions: ${numTransitions} × ${transitionDur} = ${numTransitions * transitionDur} overlap`);
console.log(`Calculated net: ${calculatedNet}`);
console.log(`TOTAL_FRAMES: ${totalFrames}`);
console.log();

if (errors.length === 0 && warnings.length === 0) {
  console.log('All checks passed!');
} else {
  for (const e of errors) console.log(e);
  for (const w of warnings) console.log(w);
}

process.exit(errors.length > 0 ? 1 : 0);
