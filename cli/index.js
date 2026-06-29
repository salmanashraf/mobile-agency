#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = 'salmanashraf/mobile-agency';
const BRANCH = 'main';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const CLAUDE_AGENTS_DIR   = path.join(os.homedir(), '.claude', 'agents');
const CLAUDE_COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands');

// ─── Manifest ────────────────────────────────────────────────────────────────

const AGENTS = {
  // Android
  'anr-investigation':       { file: 'agents/android/anr-investigation/agent.md',              platform: 'android' },
  'android-crash-analyzer':  { file: 'agents/android/android-crash-analyzer/agent.md',        platform: 'android' },
  'axiom':                   { file: 'agents/android/axiom/agent.md',                          platform: 'android' },
  'code-reviewer':           { file: 'agents/android/code-reviewer/agent.md',                  platform: 'android' },
  'compose-navigation':      { file: 'agents/android/compose-navigation/agent.md',             platform: 'android' },
  'compose-screen-builder':  { file: 'agents/android/compose-screen-builder/agent.md',         platform: 'android' },
  'compose-ui-reviewer':     { file: 'agents/android/compose-ui-reviewer/agent.md',            platform: 'android' },
  'crash-analyzer-android':  { file: 'agents/android/crash-analyzer/agent.md',                 platform: 'android' },
  'memory-leak-analyzer':    { file: 'agents/android/memory-leak-analyzer/agent.md',           platform: 'android' },
  // iOS
  'crash-analyzer-ios':      { file: 'agents/ios/crash-analyzer/agent.md',                     platform: 'ios'     },
  'swift-reviewer':          { file: 'agents/ios/swift-reviewer/agent.md',                     platform: 'ios'     },
  'swift':                   { file: 'agents/ios/swift/agent.md',                              platform: 'ios'     },
  // Flutter
  'bloc-feature-builder':    { file: 'agents/flutter/bloc-feature-builder/agent.md',           platform: 'flutter' },
  'dart':                    { file: 'agents/flutter/dart/agent.md',                           platform: 'flutter' },
  'widget-generator':        { file: 'agents/flutter/widget-generator/agent.md',               platform: 'flutter' },
  // React Native
  'bridge':                  { file: 'agents/react-native/bridge/agent.md',                    platform: 'rn'      },
  'performance-optimizer':   { file: 'agents/react-native/performance-optimizer/agent.md',     platform: 'rn'      },
  // Gaming
  'forge':                   { file: 'agents/gaming/forge/agent.md',                           platform: 'gaming'  },
  'unreal':                  { file: 'agents/gaming/unreal/agent.md',                          platform: 'gaming'  },
  'shader-generator':        { file: 'agents/unity/shader-generator/agent.md',                 platform: 'gaming'  },
  'blueprint-advisor':       { file: 'agents/unreal/blueprint-advisor/agent.md',               platform: 'gaming'  },
  // Cross-platform
  'accessibility-auditor':   { file: 'agents/cross-platform/accessibility-auditor/agent.md',   platform: 'cross'   },
  'appforge':                { file: 'agents/cross-platform/appforge/agent.md',                platform: 'cross'   },
  'ci-cd-generator':         { file: 'agents/cross-platform/ci-cd-generator/agent.md',         platform: 'cross'   },
  'crasher':                 { file: 'agents/cross-platform/crasher/agent.md',                 platform: 'cross'   },
  'figma':                   { file: 'agents/cross-platform/figma/agent.md',                   platform: 'cross'   },
  'launchpad':               { file: 'agents/cross-platform/launchpad/agent.md',               platform: 'cross'   },
  'mobile-harness':          { file: 'agents/cross-platform/mobile-harness/agent.md',          platform: 'cross'   },
  'mrecall':                 { file: 'agents/cross-platform/mrecall/agent.md',                 platform: 'cross'   },
  'perf':                    { file: 'agents/cross-platform/perf/agent.md',                    platform: 'cross'   },
  'pipeline':                { file: 'agents/cross-platform/pipeline/agent.md',                platform: 'cross'   },
  'release-notes-generator': { file: 'agents/cross-platform/release-notes-generator/agent.md', platform: 'cross'   },
  'scribe':                  { file: 'agents/cross-platform/scribe/agent.md',                  platform: 'cross'   },
  'security-scanner':        { file: 'agents/cross-platform/security-scanner/agent.md',        platform: 'cross'   },
  'sentinel':                { file: 'agents/cross-platform/sentinel/agent.md',                platform: 'cross'   },
  'store-listing-writer':    { file: 'agents/cross-platform/store-listing-writer/agent.md',    platform: 'cross'   },
};

const SKILLS = {
  // Android
  'anr-investigation':  { file: 'skills/android/anr-investigation.md',         platform: 'android' },
  'android-tdd':        { file: 'skills/android/android-tdd.md',               platform: 'android' },
  'code-review':        { file: 'skills/android/code-review.md',               platform: 'android' },
  'compose-migration':  { file: 'skills/android/compose-migration.md',         platform: 'android' },
  'compose-review':     { file: 'skills/android/compose-review.md',            platform: 'android' },
  'kotlin-modernize':   { file: 'skills/android/kotlin-modernize.md',          platform: 'android' },
  'memory-leak-investigation': { file: 'skills/android/memory-leak-investigation.md', platform: 'android' },
  'proguard-rules':     { file: 'skills/android/proguard-rules.md',            platform: 'android' },
  // iOS
  'data-persistence':   { file: 'skills/ios/data-persistence.md',              platform: 'ios'     },
  'ios-tdd':            { file: 'skills/ios/ios-tdd.md',                       platform: 'ios'     },
  'networking':         { file: 'skills/ios/networking.md',                    platform: 'ios'     },
  'ios-performance':    { file: 'skills/ios/performance.md',                   platform: 'ios'     },
  'swift-concurrency':  { file: 'skills/ios/swift-concurrency.md',             platform: 'ios'     },
  'swift-review':       { file: 'skills/ios/swift-review.md',                  platform: 'ios'     },
  'swiftui-review':     { file: 'skills/ios/swiftui-review.md',                platform: 'ios'     },
  'swiftui-state':      { file: 'skills/ios/swiftui-state.md',                 platform: 'ios'     },
  'unit-testing':       { file: 'skills/ios/unit-testing.md',                  platform: 'ios'     },
  'xcode-warnings':     { file: 'skills/ios/xcode-warnings.md',                platform: 'ios'     },
  // Flutter
  'dart-modernize':     { file: 'skills/flutter/dart-modernize.md',            platform: 'flutter' },
  'flutter-review':     { file: 'skills/flutter/flutter-review.md',            platform: 'flutter' },
  'flutter-tdd':        { file: 'skills/flutter/flutter-tdd.md',               platform: 'flutter' },
  'widget-extract':     { file: 'skills/flutter/widget-extract.md',            platform: 'flutter' },
  'widget-gen':         { file: 'skills/flutter/widget-gen.md',                platform: 'flutter' },
  // React Native
  'bridge-audit':       { file: 'skills/react-native/bridge-audit.md',         platform: 'rn'      },
  'expo-optimize':      { file: 'skills/react-native/expo-optimize.md',        platform: 'rn'      },
  'new-arch-migrate':   { file: 'skills/react-native/new-arch-migrate.md',     platform: 'rn'      },
  'rn-performance':     { file: 'skills/react-native/performance.md',          platform: 'rn'      },
  'rn-review':          { file: 'skills/react-native/rn-review.md',            platform: 'rn'      },
  'rn-tdd':             { file: 'skills/react-native/rn-tdd.md',               platform: 'rn'      },
  // Gaming
  'blueprint-to-cpp':   { file: 'skills/gaming/blueprint-to-cpp.md',           platform: 'gaming'  },
  'game-perf':          { file: 'skills/gaming/game-perf.md',                  platform: 'gaming'  },
  'shader-gen':         { file: 'skills/gaming/shader-gen.md',                 platform: 'gaming'  },
  'unity-tdd':          { file: 'skills/gaming/unity-tdd.md',                  platform: 'gaming'  },
  'shader-review':      { file: 'skills/unity/shader-review.md',               platform: 'gaming'  },
  // Cross-platform
  'accessibility-audit':{ file: 'skills/cross-platform/accessibility-audit.md', platform: 'cross'  },
  'api-versioning':     { file: 'skills/cross-platform/api-versioning.md',     platform: 'cross'   },
  'clean-code-audit':   { file: 'skills/cross-platform/clean-code-audit.md',   platform: 'cross'   },
  'crash-triage':       { file: 'skills/cross-platform/crash-triage.md',       platform: 'cross'   },
  'deeplink-debug':     { file: 'skills/cross-platform/deeplink-debug.md',     platform: 'cross'   },
  'feature-slice':      { file: 'skills/cross-platform/feature-slice.md',      platform: 'cross'   },
  'grill-mobile':       { file: 'skills/cross-platform/grill-mobile.md',       platform: 'cross'   },
  'mobile-mcp-qa':      { file: 'skills/cross-platform/mobile-mcp-qa.md',      platform: 'cross'   },
  'mrecall-graph':      { file: 'skills/cross-platform/mrecall-graph.md',      platform: 'cross'   },
  'mrecall-save':       { file: 'skills/cross-platform/mrecall-save.md',       platform: 'cross'   },
  'perf-audit':         { file: 'skills/cross-platform/perf-audit.md',         platform: 'cross'   },
  'release-prep':       { file: 'skills/cross-platform/release-prep.md',       platform: 'cross'   },
  'security-audit':     { file: 'skills/cross-platform/security-audit.md',     platform: 'cross'   },
  'store-listing':      { file: 'skills/cross-platform/store-listing.md',      platform: 'cross'   },
  // Shared
  'crash-analysis':     { file: 'skills/shared/crash-analysis.md',             platform: 'cross'   },
  'security-scan':      { file: 'skills/shared/security-scan.md',              platform: 'cross'   },
};

const WORKFLOWS = {
  'feature-ship':      { file: 'workflows/feature-ship.md'      },
  'release-cycle':     { file: 'workflows/release-cycle.md'     },
  'game-level':        { file: 'workflows/game-level.md'        },
  'crash-to-fix':      { file: 'workflows/crash-to-fix.md'      },
  'ci-setup':          { file: 'workflows/ci-setup.md'          },
  'new-screen':        { file: 'workflows/new-screen.md'        },
  'new-project-setup': { file: 'workflows/new-project-setup.md' },
  'app-launch':        { file: 'workflows/app-launch.md'        },
  'perf-sprint':       { file: 'workflows/perf-sprint.md'       },
  'mrecall-workflow':  { file: 'workflows/mrecall-workflow.md'  },
  'appforge-workflow': { file: 'workflows/appforge-workflow.md' },
  'mobile-mcp-qa':     { file: 'workflows/mobile-mcp-qa.md'     },
  'mobile-harness':    { file: 'workflows/mobile-harness.md'    },
};

const PLATFORM_AGENTS = {
  android: [
    'anr-investigation', 'android-crash-analyzer', 'axiom', 'code-reviewer', 'compose-navigation',
    'compose-screen-builder', 'compose-ui-reviewer', 'crash-analyzer-android',
    'memory-leak-analyzer',
    // cross-platform bundled for android
    'appforge', 'crasher', 'sentinel', 'mobile-harness', 'mrecall', 'perf',
    'scribe', 'pipeline', 'figma', 'launchpad',
    'accessibility-auditor', 'ci-cd-generator', 'release-notes-generator',
    'security-scanner', 'store-listing-writer',
  ],
  ios: [
    'crash-analyzer-ios', 'swift-reviewer', 'swift',
    // cross-platform bundled for ios
    'appforge', 'crasher', 'sentinel', 'mobile-harness', 'mrecall', 'perf',
    'scribe', 'pipeline', 'figma', 'launchpad',
    'accessibility-auditor', 'ci-cd-generator', 'release-notes-generator',
    'security-scanner', 'store-listing-writer',
  ],
  flutter: [
    'bloc-feature-builder', 'dart', 'widget-generator',
    // cross-platform bundled for flutter
    'appforge', 'crasher', 'sentinel', 'mobile-harness', 'mrecall', 'perf',
    'scribe', 'pipeline', 'figma', 'launchpad',
    'accessibility-auditor', 'ci-cd-generator', 'release-notes-generator',
    'security-scanner', 'store-listing-writer',
  ],
  rn: [
    'bridge', 'performance-optimizer',
    // cross-platform bundled for rn
    'appforge', 'crasher', 'sentinel', 'mobile-harness', 'mrecall', 'perf',
    'scribe', 'pipeline', 'figma', 'launchpad',
    'accessibility-auditor', 'ci-cd-generator', 'release-notes-generator',
    'security-scanner', 'store-listing-writer',
  ],
  gaming: [
    'forge', 'unreal', 'shader-generator', 'blueprint-advisor',
    // cross-platform bundled for gaming
    'appforge', 'mobile-harness', 'mrecall', 'perf',
  ],
  cross: [
    'accessibility-auditor', 'appforge', 'ci-cd-generator', 'crasher', 'figma',
    'launchpad', 'mobile-harness', 'mrecall',
    'perf', 'pipeline', 'release-notes-generator', 'scribe', 'security-scanner',
    'sentinel', 'store-listing-writer',
  ],
};

const PLATFORM_SKILLS = {
  android: [
    'anr-investigation', 'android-tdd', 'code-review', 'compose-migration', 'compose-review',
    'kotlin-modernize', 'memory-leak-investigation', 'proguard-rules',
    // cross-platform bundled for android
    'accessibility-audit', 'api-versioning', 'clean-code-audit', 'crash-analysis', 'crash-triage',
    'deeplink-debug', 'feature-slice', 'grill-mobile', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'perf-audit',
    'release-prep', 'security-audit', 'security-scan', 'store-listing',
  ],
  ios: [
    'data-persistence', 'ios-tdd', 'networking', 'ios-performance',
    'swift-concurrency', 'swift-review', 'swiftui-review', 'swiftui-state',
    'unit-testing', 'xcode-warnings',
    // cross-platform bundled for ios
    'accessibility-audit', 'api-versioning', 'clean-code-audit', 'crash-analysis', 'crash-triage',
    'deeplink-debug', 'feature-slice', 'grill-mobile', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'perf-audit',
    'release-prep', 'security-audit', 'security-scan', 'store-listing',
  ],
  flutter: [
    'dart-modernize', 'flutter-review', 'flutter-tdd', 'widget-extract', 'widget-gen',
    // cross-platform bundled for flutter
    'accessibility-audit', 'api-versioning', 'clean-code-audit', 'crash-analysis', 'crash-triage',
    'deeplink-debug', 'feature-slice', 'grill-mobile', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'perf-audit',
    'release-prep', 'security-audit', 'security-scan', 'store-listing',
  ],
  rn: [
    'bridge-audit', 'expo-optimize', 'new-arch-migrate', 'rn-performance',
    'rn-review', 'rn-tdd',
    // cross-platform bundled for rn
    'accessibility-audit', 'api-versioning', 'clean-code-audit', 'crash-analysis', 'crash-triage',
    'deeplink-debug', 'feature-slice', 'grill-mobile', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'perf-audit',
    'release-prep', 'security-audit', 'security-scan', 'store-listing',
  ],
  gaming: [
    'blueprint-to-cpp', 'clean-code-audit', 'game-perf', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'security-audit', 'shader-gen',
    'unity-tdd', 'shader-review',
  ],
  cross: [
    'accessibility-audit', 'api-versioning', 'clean-code-audit', 'crash-analysis', 'crash-triage',
    'deeplink-debug', 'feature-slice', 'grill-mobile', 'mobile-mcp-qa',
    'mrecall-graph', 'mrecall-save', 'perf-audit',
    'release-prep', 'security-audit', 'security-scan', 'store-listing',
  ],
};

// Workflows are always installed regardless of platform selection
const ALL_WORKFLOWS = Object.keys(WORKFLOWS);

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

async function downloadFile(remotePath, destPaths) {
  const content = await fetchRemote(remotePath);
  for (const destPath of destPaths) {
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, content);
  }
  return content;
}

async function fetchRemote(remotePath) {
  const localPath = path.join(PACKAGE_ROOT, remotePath);
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf8');
  }
  return fetch(`${RAW}/${remotePath}`);
}

// Collect all agent/skill/workflow names and their remote paths for a platform set
function collectItems(platforms) {
  const agentNames = new Set();
  const skillNames = new Set();
  for (const p of platforms) {
    (PLATFORM_AGENTS[p] || []).forEach(a => agentNames.add(a));
    (PLATFORM_SKILLS[p] || []).forEach(s => skillNames.add(s));
  }
  return { agentNames: [...agentNames], skillNames: [...skillNames] };
}

// ─── Install targets ─────────────────────────────────────────────────────────

async function installForClaude(platforms) {
  log('Installing for Claude Code...');
  ensureDir(CLAUDE_AGENTS_DIR);
  ensureDir(CLAUDE_COMMANDS_DIR);

  const { agentNames, skillNames } = collectItems(platforms);

  // Agents → ~/.claude/agents/<name>.md AND ~/.claude/commands/<name>.md
  process.stdout.write(`\n   Agents (${agentNames.length})\n`);
  await Promise.all(agentNames.map(async (name) => {
    const meta = AGENTS[name];
    if (!meta) return;
    const agentDest   = path.join(CLAUDE_AGENTS_DIR,   `${name}.md`);
    const commandDest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    await downloadFile(meta.file, [agentDest, commandDest]);
    ok(name);
  }));

  // Skills → ~/.claude/commands/<slug>.md
  process.stdout.write(`\n   Skills (${skillNames.length})\n`);
  await Promise.all(skillNames.map(async (name) => {
    const meta = SKILLS[name];
    if (!meta) return;
    const dest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    await downloadFile(meta.file, [dest]);
    ok(name);
  }));

  // Workflows → ~/.claude/commands/<name>.md (always)
  process.stdout.write(`\n   Workflows (${ALL_WORKFLOWS.length})\n`);
  await Promise.all(ALL_WORKFLOWS.map(async (name) => {
    const meta = WORKFLOWS[name];
    if (!meta) return;
    const dest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    await downloadFile(meta.file, [dest]);
    ok(name);
  }));

  console.log('');
  log(`Agents   → ${dim(CLAUDE_AGENTS_DIR)}`);
  log(`Commands → ${dim(CLAUDE_COMMANDS_DIR)}`);
  log(`           (agents + skills + workflows as slash commands)`);
}

async function installForCursor(platforms) {
  log('Installing for Cursor (.cursor/rules/)...');
  const rulesDir = path.join(process.cwd(), '.cursor', 'rules');
  ensureDir(rulesDir);

  const { agentNames, skillNames } = collectItems(platforms);
  const total = agentNames.length + skillNames.length + ALL_WORKFLOWS.length;
  process.stdout.write(`\n   Rules (${total})\n`);

  // Agents
  await Promise.all(agentNames.map(async (name) => {
    const meta = AGENTS[name];
    if (!meta) return;
    const dest = path.join(rulesDir, `${name}.mdc`);
    await downloadFile(meta.file, [dest]);
    ok(name);
  }));

  // Skills
  await Promise.all(skillNames.map(async (name) => {
    const meta = SKILLS[name];
    if (!meta) return;
    const dest = path.join(rulesDir, `${name}.mdc`);
    await downloadFile(meta.file, [dest]);
    ok(name);
  }));

  // Workflows
  await Promise.all(ALL_WORKFLOWS.map(async (name) => {
    const meta = WORKFLOWS[name];
    if (!meta) return;
    const dest = path.join(rulesDir, `${name}.mdc`);
    await downloadFile(meta.file, [dest]);
    ok(name);
  }));

  console.log('');
  log(`Rules → ${dim(rulesDir)}`);
}

async function installForWindsurf(platforms) {
  log('Installing for Windsurf (.windsurfrules)...');

  const { agentNames, skillNames } = collectItems(platforms);
  const total = agentNames.length + skillNames.length + ALL_WORKFLOWS.length;
  process.stdout.write(`\n   Fetching ${total} files...\n`);

  const parts = [];

  const agentContents = await Promise.all(
    agentNames.map(name => {
      const meta = AGENTS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  agentContents.forEach((c, i) => { if (c) { parts.push(`# Agent: ${agentNames[i]}\n\n${c}`); ok(agentNames[i]); } });

  const skillContents = await Promise.all(
    skillNames.map(name => {
      const meta = SKILLS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  skillContents.forEach((c, i) => { if (c) { parts.push(`# Skill: ${skillNames[i]}\n\n${c}`); ok(skillNames[i]); } });

  const workflowContents = await Promise.all(
    ALL_WORKFLOWS.map(name => {
      const meta = WORKFLOWS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  workflowContents.forEach((c, i) => { if (c) { parts.push(`# Workflow: ${ALL_WORKFLOWS[i]}\n\n${c}`); ok(ALL_WORKFLOWS[i]); } });

  const dest = path.join(process.cwd(), '.windsurfrules');
  fs.writeFileSync(dest, parts.join('\n\n---\n\n'));

  console.log('');
  log(`.windsurfrules → ${dim(dest)}`);
}

async function installForCopilot(platforms) {
  log('Installing for GitHub Copilot (.github/copilot-instructions.md)...');
  const githubDir = path.join(process.cwd(), '.github');
  ensureDir(githubDir);

  const { agentNames, skillNames } = collectItems(platforms);
  const total = agentNames.length + skillNames.length;
  process.stdout.write(`\n   Fetching ${total} files...\n`);

  const parts = [
    '# Mobile Agency — AI Dev Team Instructions',
    '',
    `> Auto-generated by mobile-agency CLI from github.com/${REPO}`,
    '',
  ];

  parts.push('## Agents\n');
  const agentContents = await Promise.all(
    agentNames.map(name => {
      const meta = AGENTS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  agentContents.forEach((c, i) => {
    if (c) { parts.push(`### ${agentNames[i]}\n\n${c}`); ok(agentNames[i]); }
  });

  parts.push('\n## Skills\n');
  const skillContents = await Promise.all(
    skillNames.map(name => {
      const meta = SKILLS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  skillContents.forEach((c, i) => {
    if (c) { parts.push(`### ${skillNames[i]}\n\n${c}`); ok(skillNames[i]); }
  });

  const dest = path.join(githubDir, 'copilot-instructions.md');
  fs.writeFileSync(dest, parts.join('\n\n'));

  console.log('');
  log(`Copilot instructions → ${dim(dest)}`);
}

async function installForCodex(platforms) {
  log('Installing for Codex (AGENTS.md)...');

  const { agentNames, skillNames } = collectItems(platforms);
  const total = agentNames.length + skillNames.length + ALL_WORKFLOWS.length;
  process.stdout.write(`\n   Fetching ${total} files...\n`);

  const parts = [
    '# Mobile Agency — AGENTS.md',
    '',
    `> Auto-generated by mobile-agency CLI from github.com/${REPO}`,
    '',
  ];

  parts.push('## Agents\n');
  const agentContents = await Promise.all(
    agentNames.map(name => {
      const meta = AGENTS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  agentContents.forEach((c, i) => {
    if (c) { parts.push(`### ${agentNames[i]}\n\n${c}`); ok(agentNames[i]); }
  });

  parts.push('\n## Skills\n');
  const skillContents = await Promise.all(
    skillNames.map(name => {
      const meta = SKILLS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  skillContents.forEach((c, i) => {
    if (c) { parts.push(`### ${skillNames[i]}\n\n${c}`); ok(skillNames[i]); }
  });

  parts.push('\n## Workflows\n');
  const workflowContents = await Promise.all(
    ALL_WORKFLOWS.map(name => {
      const meta = WORKFLOWS[name];
      return meta ? fetchRemote(meta.file) : Promise.resolve(null);
    })
  );
  workflowContents.forEach((c, i) => {
    if (c) { parts.push(`### ${ALL_WORKFLOWS[i]}\n\n${c}`); ok(ALL_WORKFLOWS[i]); }
  });

  const dest = path.join(process.cwd(), 'AGENTS.md');
  fs.writeFileSync(dest, parts.join('\n\n'));

  console.log('');
  log(`AGENTS.md → ${dim(dest)}`);
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
    ? ['android', 'ios', 'flutter', 'rn', 'gaming', 'cross']
    : [platform];

  console.log('');
  console.log(bold('Mobile Agency'));
  console.log(dim(`   github.com/${REPO}`));
  console.log('');
  console.log(`   Platform : ${bold(platform)}`);
  console.log(`   Tool     : ${bold(tool)}`);
  console.log('');

  if (tool === 'claude'   || tool === 'all') await installForClaude(platforms);
  if (tool === 'cursor'   || tool === 'all') await installForCursor(platforms);
  if (tool === 'windsurf' || tool === 'all') await installForWindsurf(platforms);
  if (tool === 'copilot'  || tool === 'all') await installForCopilot(platforms);
  if (tool === 'codex'    || tool === 'all') await installForCodex(platforms);

  console.log('');
  console.log(green(bold('  Done. Happy shipping.')));
  console.log('');
}

async function cmdAdd(args) {
  const type = args[0]; // 'agent' | 'skill' | 'workflow'
  const name = args[1];

  if (!type || !name) {
    console.error('\nUsage: npx mobile-agency add agent <name>');
    console.error('       npx mobile-agency add skill <name>');
    console.error('       npx mobile-agency add workflow <name>\n');
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
    ensureDir(CLAUDE_COMMANDS_DIR);
    const agentDest   = path.join(CLAUDE_AGENTS_DIR,   `${name}.md`);
    const commandDest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    log(`Fetching ${bold(name)} agent...`);
    await downloadFile(meta.file, [agentDest, commandDest]);
    ok(`${name} → ${dim(agentDest)}`);
    ok(`${name} → ${dim(commandDest)}`);
  } else if (type === 'skill') {
    const meta = SKILLS[name];
    if (!meta) {
      err(`Unknown skill: ${name}`);
      console.log(`\n  Available skills: ${Object.keys(SKILLS).join(', ')}\n`);
      process.exit(1);
    }
    ensureDir(CLAUDE_COMMANDS_DIR);
    const dest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    log(`Fetching ${bold(name)} skill...`);
    await downloadFile(meta.file, [dest]);
    ok(`${name} → ${dim(dest)}`);
  } else if (type === 'workflow') {
    const meta = WORKFLOWS[name];
    if (!meta) {
      err(`Unknown workflow: ${name}`);
      console.log(`\n  Available workflows: ${Object.keys(WORKFLOWS).join(', ')}\n`);
      process.exit(1);
    }
    ensureDir(CLAUDE_COMMANDS_DIR);
    const dest = path.join(CLAUDE_COMMANDS_DIR, `${name}.md`);
    log(`Fetching ${bold(name)} workflow...`);
    await downloadFile(meta.file, [dest]);
    ok(`${name} → ${dim(dest)}`);
  } else {
    err(`Unknown type: ${type}. Use 'agent', 'skill', or 'workflow'.`);
    process.exit(1);
  }

  console.log('');
}

function cmdList() {
  const agentCount    = Object.keys(AGENTS).length;
  const skillCount    = Object.keys(SKILLS).length;
  const workflowCount = Object.keys(WORKFLOWS).length;

  console.log('');
  console.log(bold(`Mobile Agency — Agents (${agentCount}), Skills (${skillCount}), Workflows (${workflowCount})`));
  console.log(dim(`   github.com/${REPO}`));
  console.log('');

  console.log(bold(`  AGENTS (${agentCount})`));
  const agentsByPlatform = {};
  for (const [name, meta] of Object.entries(AGENTS)) {
    if (!agentsByPlatform[meta.platform]) agentsByPlatform[meta.platform] = [];
    agentsByPlatform[meta.platform].push(name);
  }
  for (const [platform, names] of Object.entries(agentsByPlatform)) {
    console.log(`    ${yellow(platform.padEnd(10))} ${names.join(', ')}`);
  }

  console.log('');
  console.log(bold(`  SKILLS (${skillCount})`));
  const skillsByPlatform = {};
  for (const [name, meta] of Object.entries(SKILLS)) {
    if (!skillsByPlatform[meta.platform]) skillsByPlatform[meta.platform] = [];
    skillsByPlatform[meta.platform].push(name);
  }
  for (const [platform, names] of Object.entries(skillsByPlatform)) {
    console.log(`    ${yellow(platform.padEnd(10))} ${names.join(', ')}`);
  }

  console.log('');
  console.log(bold(`  WORKFLOWS (${workflowCount})`));
  console.log(`    ${yellow('all'.padEnd(10))} ${Object.keys(WORKFLOWS).join(', ')}`);

  console.log('');
  console.log(bold('  INSTALL'));
  console.log(dim('    npx mobile-agency install                         # everything (claude)'));
  console.log(dim('    npx mobile-agency install --platform android      # android only'));
  console.log(dim('    npx mobile-agency install --tool cursor           # cursor only'));
  console.log(dim('    npx mobile-agency install --tool windsurf         # windsurf only'));
  console.log(dim('    npx mobile-agency install --tool copilot          # github copilot'));
  console.log(dim('    npx mobile-agency install --tool codex            # openai codex (AGENTS.md)'));
  console.log(dim('    npx mobile-agency install --tool all              # every tool'));
  console.log(dim('    npx mobile-agency add agent crasher               # one agent'));
  console.log(dim('    npx mobile-agency add skill grill-mobile          # one skill'));
  console.log(dim('    npx mobile-agency add workflow feature-ship       # one workflow'));
  console.log('');
}

function cmdHelp() {
  console.log('');
  console.log(bold('  npx mobile-agency <command> [options]'));
  console.log('');
  console.log('  Commands:');
  console.log(`    ${bold('install')}                         Install agents, skills, and workflows`);
  console.log(`    ${bold('add')} agent|skill|workflow <name>  Install a single item`);
  console.log(`    ${bold('list')}                            List all available agents, skills, and workflows`);
  console.log(`    ${bold('help')}                            Show this help`);
  console.log('');
  console.log('  Install options:');
  console.log('    --platform  android | ios | flutter | rn | gaming | cross | all  (default: all)');
  console.log('    --tool      claude | cursor | windsurf | copilot | codex | all   (default: claude)');
  console.log('');
  console.log('  What gets installed per tool:');
  console.log('');
  console.log('    claude    Agents   → ~/.claude/agents/<name>.md');
  console.log('              Agents   → ~/.claude/commands/<name>.md  (slash commands)');
  console.log('              Skills   → ~/.claude/commands/<slug>.md  (slash commands)');
  console.log('              Workflows→ ~/.claude/commands/<name>.md  (slash commands, always)');
  console.log('');
  console.log('    cursor    Each agent/skill/workflow → .cursor/rules/<name>.mdc');
  console.log('');
  console.log('    windsurf  All files concatenated   → .windsurfrules');
  console.log('');
  console.log('    copilot   All agents + skills      → .github/copilot-instructions.md');
  console.log('');
  console.log('    codex     All agents/skills/workflows → AGENTS.md');
  console.log('');
  console.log('  Examples:');
  console.log(dim('    npx mobile-agency install'));
  console.log(dim('    npx mobile-agency install --platform android'));
  console.log(dim('    npx mobile-agency install --platform ios --tool cursor'));
  console.log(dim('    npx mobile-agency install --tool all'));
  console.log(dim('    npx mobile-agency add agent crasher'));
  console.log(dim('    npx mobile-agency add skill grill-mobile'));
  console.log(dim('    npx mobile-agency add workflow feature-ship'));
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
