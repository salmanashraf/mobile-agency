#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = 'salmanashraf/mobile-agency';
const BRANCH = 'main';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

const CLAUDE_AGENTS_DIR = path.join(os.homedir(), '.claude', 'agents');
const CLAUDE_SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

// ─── Manifest ────────────────────────────────────────────────────────────────

const AGENTS = {
  axiom:    { file: 'agents/android/axiom/agent.md',                   platform: 'android' },
  swift:    { file: 'agents/ios/swift/agent.md',                       platform: 'ios'     },
  dart:     { file: 'agents/flutter/dart/agent.md',                    platform: 'flutter' },
  bridge:   { file: 'agents/react-native/bridge/agent.md',             platform: 'rn'      },
  forge:    { file: 'agents/gaming/forge/agent.md',                    platform: 'gaming'  },
  unreal:   { file: 'agents/gaming/unreal/agent.md',                   platform: 'gaming'  },
  crasher:  { file: 'agents/cross-platform/crasher/agent.md',          platform: 'cross'   },
  sentinel: { file: 'agents/cross-platform/sentinel/agent.md',         platform: 'cross'   },
  launchpad:{ file: 'agents/cross-platform/launchpad/agent.md',        platform: 'cross'   },
  pipeline: { file: 'agents/cross-platform/pipeline/agent.md',         platform: 'cross'   },
  perf:     { file: 'agents/cross-platform/perf/agent.md',             platform: 'cross'   },
  scribe:   { file: 'agents/cross-platform/scribe/agent.md',           platform: 'cross'   },
  figma:    { file: 'agents/cross-platform/figma/agent.md',            platform: 'cross'   },
};

const SKILLS = {
  'android-tdd':       { file: 'skills/android/android-tdd.md',              platform: 'android' },
  'compose-review':    { file: 'skills/android/compose-review.md',            platform: 'android' },
  'compose-migration': { file: 'skills/android/compose-migration.md',         platform: 'android' },
  'kotlin-modernize':  { file: 'skills/android/kotlin-modernize.md',          platform: 'android' },
  'proguard-rules':    { file: 'skills/android/proguard-rules.md',            platform: 'android' },
  'ios-tdd':           { file: 'skills/ios/ios-tdd.md',                       platform: 'ios'     },
  'swiftui-review':    { file: 'skills/ios/swiftui-review.md',                platform: 'ios'     },
  'swift-concurrency': { file: 'skills/ios/swift-concurrency.md',             platform: 'ios'     },
  'xcode-warnings':    { file: 'skills/ios/xcode-warnings.md',                platform: 'ios'     },
  'flutter-tdd':       { file: 'skills/flutter/flutter-tdd.md',               platform: 'flutter' },
  'flutter-review':    { file: 'skills/flutter/flutter-review.md',            platform: 'flutter' },
  'widget-extract':    { file: 'skills/flutter/widget-extract.md',            platform: 'flutter' },
  'dart-modernize':    { file: 'skills/flutter/dart-modernize.md',            platform: 'flutter' },
  'rn-tdd':            { file: 'skills/react-native/rn-tdd.md',               platform: 'rn'      },
  'rn-review':         { file: 'skills/react-native/rn-review.md',            platform: 'rn'      },
  'new-arch-migrate':  { file: 'skills/react-native/new-arch-migrate.md',     platform: 'rn'      },
  'expo-optimize':     { file: 'skills/react-native/expo-optimize.md',        platform: 'rn'      },
  'unity-tdd':         { file: 'skills/gaming/unity-tdd.md',                  platform: 'gaming'  },
  'shader-gen':        { file: 'skills/gaming/shader-gen.md',                 platform: 'gaming'  },
  'game-perf':         { file: 'skills/gaming/game-perf.md',                  platform: 'gaming'  },
  'blueprint-to-cpp':  { file: 'skills/gaming/blueprint-to-cpp.md',           platform: 'gaming'  },
  'grill-mobile':      { file: 'skills/cross-platform/grill-mobile.md',       platform: 'cross'   },
  'crash-triage':      { file: 'skills/cross-platform/crash-triage.md',       platform: 'cross'   },
  'perf-audit':        { file: 'skills/cross-platform/perf-audit.md',         platform: 'cross'   },
  'store-listing':     { file: 'skills/cross-platform/store-listing.md',      platform: 'cross'   },
  'feature-slice':     { file: 'skills/cross-platform/feature-slice.md',      platform: 'cross'   },
  'release-prep':      { file: 'skills/cross-platform/release-prep.md',       platform: 'cross'   },
  'accessibility-audit':{ file: 'skills/cross-platform/accessibility-audit.md',platform: 'cross'  },
  'api-versioning':    { file: 'skills/cross-platform/api-versioning.md',     platform: 'cross'   },
  'deeplink-debug':    { file: 'skills/cross-platform/deeplink-debug.md',     platform: 'cross'   },
};

const PLATFORM_AGENTS = {
  android: ['axiom', 'crasher', 'sentinel', 'perf', 'scribe', 'pipeline', 'figma', 'launchpad'],
  ios:     ['swift', 'crasher', 'sentinel', 'perf', 'scribe', 'pipeline', 'figma', 'launchpad'],
  flutter: ['dart',  'crasher', 'sentinel', 'perf', 'scribe', 'pipeline', 'figma', 'launchpad'],
  rn:      ['bridge','crasher', 'sentinel', 'perf', 'scribe', 'pipeline', 'figma', 'launchpad'],
  gaming:  ['forge', 'unreal', 'perf'],
  cross:   ['crasher','sentinel','launchpad','pipeline','perf','scribe','figma'],
};

const PLATFORM_SKILLS = {
  android: ['android-tdd','compose-review','compose-migration','kotlin-modernize','proguard-rules',
            'grill-mobile','crash-triage','perf-audit','store-listing','feature-slice','release-prep'],
  ios:     ['ios-tdd','swiftui-review','swift-concurrency','xcode-warnings',
            'grill-mobile','crash-triage','perf-audit','store-listing','feature-slice','release-prep'],
  flutter: ['flutter-tdd','flutter-review','widget-extract','dart-modernize',
            'grill-mobile','crash-triage','perf-audit','store-listing','feature-slice','release-prep'],
  rn:      ['rn-tdd','rn-review','new-arch-migrate','expo-optimize',
            'grill-mobile','crash-triage','perf-audit','store-listing','feature-slice','release-prep'],
  gaming:  ['unity-tdd','shader-gen','game-perf','blueprint-to-cpp'],
  cross:   ['grill-mobile','crash-triage','perf-audit','store-listing','feature-slice',
            'release-prep','accessibility-audit','api-versioning','deeplink-debug'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg)  { process.stdout.write(`  ${msg}\n`); }
function ok(msg)   { process.stdout.write(`  ✓ ${msg}\n`); }
function err(msg)  { process.stderr.write(`  ✗ ${msg}\n`); }
function bold(s)   { return `\x1b[1m${s}\x1b[0m`; }
function dim(s)    { return `\x1b[2m${s}\x1b[0m`; }
function green(s)  { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString()));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadFile(remotePath, destPath) {
  const url = `${RAW}/${remotePath}`;
  const content = await fetch(url);
  ensureDir(path.dirname(destPath));
  fs.writeFileSync(destPath, content);
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdInstall(args) {
  let platform = 'all';
  let tool = 'claude';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--platform' || args[i] === '-p') platform = args[++i];
    if (args[i] === '--tool'     || args[i] === '-t') tool     = args[++i];
  }

  const platforms = platform === 'all'
    ? ['android','ios','flutter','rn','gaming','cross']
    : [platform];

  console.log('');
  console.log(bold('📱 Mobile Agency'));
  console.log(dim(`   github.com/${REPO}`));
  console.log('');
  console.log(`   Platform : ${bold(platform)}`);
  console.log(`   Tool     : ${bold(tool)}`);
  console.log('');

  if (tool === 'claude' || tool === 'all') {
    await installForClaude(platforms);
  }
  if (tool === 'cursor' || tool === 'all') {
    await installForCursor();
  }
  if (tool === 'windsurf' || tool === 'all') {
    await installForWindsurf();
  }

  console.log('');
  console.log(green(bold('  🚀 Done. Happy shipping.')));
  console.log('');
}

async function installForClaude(platforms) {
  log('Installing for Claude Code...');
  ensureDir(CLAUDE_AGENTS_DIR);
  ensureDir(CLAUDE_SKILLS_DIR);

  const agentNames = new Set();
  const skillNames = new Set();

  for (const p of platforms) {
    (PLATFORM_AGENTS[p] || []).forEach(a => agentNames.add(a));
    (PLATFORM_SKILLS[p] || []).forEach(s => skillNames.add(s));
  }

  // Agents
  const agentList = [...agentNames];
  process.stdout.write(`\n   Agents (${agentList.length})\n`);
  await Promise.all(agentList.map(async (name) => {
    const meta = AGENTS[name];
    if (!meta) return;
    const dest = path.join(CLAUDE_AGENTS_DIR, `${name}.md`);
    await downloadFile(meta.file, dest);
    ok(name);
  }));

  // Skills
  const skillList = [...skillNames];
  process.stdout.write(`\n   Skills (${skillList.length})\n`);
  await Promise.all(skillList.map(async (name) => {
    const meta = SKILLS[name];
    if (!meta) return;
    const dest = path.join(CLAUDE_SKILLS_DIR, `${name}.md`);
    await downloadFile(meta.file, dest);
    ok(name);
  }));

  console.log('');
  log(`Agents → ${dim(CLAUDE_AGENTS_DIR)}`);
  log(`Skills → ${dim(CLAUDE_SKILLS_DIR)}`);
}

async function installForCursor() {
  log('Installing for Cursor (.cursorrules)...');
  const parts = await Promise.all([
    fetch(`${RAW}/agents/cross-platform/crasher/agent.md`),
    fetch(`${RAW}/agents/cross-platform/sentinel/agent.md`),
    fetch(`${RAW}/skills/cross-platform/grill-mobile.md`),
  ]);
  fs.writeFileSync('.cursorrules', parts.join('\n\n---\n\n'));
  ok('.cursorrules written');
}

async function installForWindsurf() {
  log('Installing for Windsurf (.windsurfrules)...');
  const parts = await Promise.all([
    fetch(`${RAW}/agents/cross-platform/crasher/agent.md`),
    fetch(`${RAW}/skills/cross-platform/grill-mobile.md`),
  ]);
  fs.writeFileSync('.windsurfrules', parts.join('\n\n---\n\n'));
  ok('.windsurfrules written');
}

async function cmdAdd(args) {
  const type = args[0]; // 'agent' | 'skill'
  const name = args[1];

  if (!type || !name) {
    console.error('\nUsage: npx mobile-agency add agent <name>');
    console.error('       npx mobile-agency add skill <name>\n');
    process.exit(1);
  }

  console.log('');

  if (type === 'agent') {
    const meta = AGENTS[name];
    if (!meta) {
      err(`Unknown agent: ${name}`);
      console.log(`\n  Available agents: ${Object.keys(AGENTS).join(', ')}\n`);
      process.exit(1);
    }
    ensureDir(CLAUDE_AGENTS_DIR);
    const dest = path.join(CLAUDE_AGENTS_DIR, `${name}.md`);
    log(`Fetching ${bold(name)} agent...`);
    await downloadFile(meta.file, dest);
    ok(`${name} → ${dim(dest)}`);
  } else if (type === 'skill') {
    const meta = SKILLS[name];
    if (!meta) {
      err(`Unknown skill: ${name}`);
      console.log(`\n  Available skills: ${Object.keys(SKILLS).join(', ')}\n`);
      process.exit(1);
    }
    ensureDir(CLAUDE_SKILLS_DIR);
    const dest = path.join(CLAUDE_SKILLS_DIR, `${name}.md`);
    log(`Fetching ${bold(name)} skill...`);
    await downloadFile(meta.file, dest);
    ok(`${name} → ${dim(dest)}`);
  } else {
    err(`Unknown type: ${type}. Use 'agent' or 'skill'.`);
    process.exit(1);
  }

  console.log('');
}

function cmdList() {
  console.log('');
  console.log(bold('📱 Mobile Agency — Available agents and skills'));
  console.log(dim(`   github.com/${REPO}`));
  console.log('');

  console.log(bold('  AGENTS (13)'));
  const agentsByPlatform = {};
  for (const [name, meta] of Object.entries(AGENTS)) {
    if (!agentsByPlatform[meta.platform]) agentsByPlatform[meta.platform] = [];
    agentsByPlatform[meta.platform].push(name);
  }
  for (const [platform, names] of Object.entries(agentsByPlatform)) {
    console.log(`    ${yellow(platform.padEnd(10))} ${names.join(', ')}`);
  }

  console.log('');
  console.log(bold('  SKILLS (28)'));
  const skillsByPlatform = {};
  for (const [name, meta] of Object.entries(SKILLS)) {
    if (!skillsByPlatform[meta.platform]) skillsByPlatform[meta.platform] = [];
    skillsByPlatform[meta.platform].push(name);
  }
  for (const [platform, names] of Object.entries(skillsByPlatform)) {
    console.log(`    ${yellow(platform.padEnd(10))} ${names.join(', ')}`);
  }

  console.log('');
  console.log(bold('  INSTALL'));
  console.log(dim('    npx mobile-agency install                      # everything'));
  console.log(dim('    npx mobile-agency install --platform android   # android only'));
  console.log(dim('    npx mobile-agency add agent crasher            # one agent'));
  console.log(dim('    npx mobile-agency add skill grill-mobile       # one skill'));
  console.log('');
}

function cmdHelp() {
  console.log('');
  console.log(bold('  npx mobile-agency <command> [options]'));
  console.log('');
  console.log('  Commands:');
  console.log(`    ${bold('install')}                Install agents and skills`);
  console.log(`    ${bold('add')} agent|skill <name> Install a single agent or skill`);
  console.log(`    ${bold('list')}                   List all available agents and skills`);
  console.log(`    ${bold('help')}                   Show this help`);
  console.log('');
  console.log('  Install options:');
  console.log('    --platform  android | ios | flutter | rn | gaming | cross | all (default: all)');
  console.log('    --tool      claude | cursor | windsurf | all (default: claude)');
  console.log('');
  console.log('  Examples:');
  console.log(dim('    npx mobile-agency install'));
  console.log(dim('    npx mobile-agency install --platform android'));
  console.log(dim('    npx mobile-agency install --platform ios --tool cursor'));
  console.log(dim('    npx mobile-agency add agent crasher'));
  console.log(dim('    npx mobile-agency add skill grill-mobile'));
  console.log('');
  console.log(dim(`  github.com/${REPO}`));
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const [,, cmd, ...args] = process.argv;

  try {
    switch (cmd) {
      case 'install': await cmdInstall(args); break;
      case 'add':     await cmdAdd(args);     break;
      case 'list':    cmdList();              break;
      case 'help':
      case '--help':
      case '-h':
      case undefined: cmdHelp();              break;
      default:
        console.error(`\n  Unknown command: ${cmd}\n`);
        cmdHelp();
        process.exit(1);
    }
  } catch (e) {
    console.error(`\n  Error: ${e.message}\n`);
    process.exit(1);
  }
}

main();
