#!/usr/bin/env node

import { createRequire } from 'module';
import { existsSync, readFileSync, writeFileSync, mkdirSync, cpSync, chmodSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Dynamic import of ESM packages
let chalk, inquirer;
try {
  chalk = (await import('chalk')).default;
  inquirer = (await import('inquirer')).default;
} catch {
  console.log('Installing dependencies...');
  execSync('npm install --no-audit --no-fund --loglevel=error', { cwd: ROOT, stdio: 'inherit' });
  chalk = (await import('chalk')).default;
  inquirer = (await import('inquirer')).default;
}

// ---- Utils ----
function readJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function detectOS() {
  const p = process.platform;
  if (p === 'darwin') return 'macos';
  if (p === 'linux') return 'linux';
  if (p === 'win32') return 'windows';
  return 'unknown';
}

function hasCommand(cmd) {
  try { execSync(`which ${cmd} 2>/dev/null`, { stdio: 'ignore' }); return true; }
  catch { return false; }
}

function hasDocker() {
  try {
    execSync('docker info 2>/dev/null', { stdio: 'ignore' });
    return true;
  } catch { return false; }
}

function generateMetaFiles(vaultPath, userName, language) {
  const cacheDir = join(vaultPath, 'CACHE', 'AI');
  mkdirSync(cacheDir, { recursive: true });

  const files = {
    'AGENTS.md': `# AGENTS — AI Agent Instructions

You are an assistant in an Obsidian vault.

---

## Mandatory role hierarchy

Every user request goes through a strict role chain:

**Manager → Orchestrator → [Scout] → [Preprocessor] → [Web Content Processor] → [Note Creator] → [Linker] → [Architect] → Manager**

---

## Process

1. **Understand** — what needs to be done (Manager)
2. **Plan** — break into steps, assign roles (Orchestrator)
3. **Execute** — use MCP or filesystem
4. **Report** — briefly what was done (Manager)

---

## Meta-files (CACHE/AI/*)

- Update BEFORE and AFTER each request
- Files: AGENTS.md, STRUCTURE.md, MASK.md, ROLES.md, TASKS.md

---

## Priorities

- Safety > Performance
- Accuracy > Speed
- Context freshness > Convenience
- Surgical MCP edits > Full file rewrites

---

## Syntax

- Wikilinks: [[target|display text]]
- Tags: #Tag
`,

    'STRUCTURE.md': `# STRUCTURE — Vault Directory Tree & Registry

MetaVersion: 1

## Directory Tree
\`\`\`
/
├── INBOX/
│   ├── AI_READED/
│   └── RAW/
├── CACHE/
│   └── AI/
├── DESKTOP/
├── FILES/
├── .opencode/
│   ├── skills/
│   └── rules/
├── INDEXES/
├── README.md
└── opencode.json
\`\`\`

## File Registry
| Path | Purpose |
|------|---------|
| opencode.json | OpenCode config with MCP |
| CACHE/AI/ | AI meta-files |
| .opencode/skills/ | OpenCode skills |
| .opencode/rules/ | Vault rules |
| DESKTOP/ | Active notes |
| FILES/ | Organized materials |
| INDEXES/ | Indexes and reading list |
| INBOX/ | Incoming content |
| README.md | Vault dashboard |
`,

    'MASK.md': `# MASK — Persona & Session Memory

MetaVersion: 1

## Base Persona
**Obsidian Assistant — Context Architect and Project Steward**

## Communication Style
- **Language:** ${language}
- **Tone:** Technical, concise, direct

## Session Memory
- **Current Goal:** Initial vault setup
- **Last Action:** Installation via OpenCodeStarterPack
- **Active Role:** Architect
- **Session Start:** ${new Date().toISOString().split('T')[0]}
`,

    'ROLES.md': `# ROLES — Role Definitions

MetaVersion: 1

## 1. Note Creator
Create notes in DESKTOP/. Use obsidian_vault_write.

## 2. Linker
Add wikilinks between notes. Use obsidian_vault_patch.

## 3. Architect
Manage meta-files (CACHE/AI/*). Update before and after each request.

## 4. Web Content Processor
Fetch web pages and YouTube videos. Save clean Markdown to INBOX/AI_READED/.

## 5. Orchestrator
Coordinate all other roles. Break tasks into sub-tasks.

## 6. Preprocessor
Analyze raw content. Distill key concepts.

## 7. Manager
Handle user communication. Report results.

## 8. Scout
Search for resources. Evaluate and save links to reading list.
`,

    'TASKS.md': `# TASKS — Project Task Breakdown

MetaVersion: 1

## Initialisation
- [x] Vault structure created
- [x] Meta-files created
- [x] OpenCode config generated

## Future
- [ ] Configure Obsidian Local REST API
- [ ] Connect OpenCode to provider
- [ ] Start taking notes
- [ ] Fill FILES/ with topics
`,

  };

  for (const [name, content] of Object.entries(files)) {
    const path = join(cacheDir, name);
    if (!existsSync(path)) {
      writeFileSync(path, content, 'utf-8');
      console.log(chalk.green('  ✓'), `Created CACHE/AI/${name}`);
    } else {
      writeFileSync(path, content, 'utf-8');
      console.log(chalk.yellow('  ↻'), `Updated CACHE/AI/${name}`);
    }
  }
}

function generateOpencodeJson(vaultPath, config) {
  const mcp = {};

  if (config.mcpObsidian) {
    mcp.obsidian = {
      type: 'remote',
      url: `http://127.0.0.1:${config.obsidianPort}/mcp/`,
      headers: { Authorization: 'Bearer ...' },
    };
  }
  if (config.mcpDocker) {
    mcp.docker = {
      type: 'local',
      command: ['npx', '-y', 'docker-mcp'],
    };
  }
  if (config.mcpGit) {
    mcp.git = {
      type: 'local',
      command: ['npx', '-y', '@cyanheads/git-mcp-server'],
    };
  }
  if (config.mcpSandbox) {
    mcp.sandbox = {
      type: 'local',
      command: ['npx', '-y', '@modelcontextprotocol/server-filesystem', config.sandboxPath],
    };
  }
  if (config.mcpBytestash) {
    mcp.bytestash = {
      type: 'remote',
      url: 'http://localhost:7654/mcp',
      headers: { Authorization: 'Bearer ...' },
    };
  }
  if (config.mcpContext7) {
    mcp.context7 = {
      type: 'remote',
      url: 'https://mcp.context7.com/mcp',
      headers: { Authorization: 'Bearer ...' },
    };
  }

  const opencodeConfig = {
    $schema: 'https://opencode.ai/config.json',
    mcp: Object.keys(mcp).length > 0 ? mcp : undefined,
    model: config.model || 'anthropic/claude-sonnet-4-5',
    lsp: true,
  };

  const path = join(vaultPath, 'opencode.json');
  writeFileSync(path, JSON.stringify(opencodeConfig, null, 2) + '\n', 'utf-8');
  console.log(chalk.green('  ✓'), 'Generated opencode.json');
}

function generateVaultStructure(vaultPath) {
  const dirs = [
    'INBOX/AI_READED',
    'INBOX/RAW',
    'DESKTOP',
    'FILES',
    'INDEXES',
    '.opencode/skills',
    '.opencode/rules',
  ];
  for (const d of dirs) {
    mkdirSync(join(vaultPath, d), { recursive: true });
  }
  console.log(chalk.green('  ✓'), 'Vault structure created');

  // Generate README.md
  const readmePath = join(vaultPath, 'README.md');
  if (!existsSync(readmePath)) {
    writeFileSync(readmePath, `# Vault

Obsidian vault powered by OpenCodeStarterPack.

## Structure
- \`DESKTOP/\` — active notes
- \`FILES/\` — organized materials by topic
- \`INDEXES/\` — topic indexes and reading list
- \`INBOX/\` — incoming content (AI_READED, RAW)
- \`CACHE/AI/\` — meta-files
`, 'utf-8');
    console.log(chalk.green('  ✓'), 'Created README.md');
  }

  // Generate .gitignore
  const gitignorePath = join(vaultPath, '.opencode', '.gitignore');
  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, 'node_modules\npackage.json\npackage-lock.json\nbun.lock\n.gitignore\n', 'utf-8');
    console.log(chalk.green('  ✓'), 'Created .opencode/.gitignore');
  }
}

function copySkills(vaultPath, skills) {
  const srcSkills = join(ROOT, 'modules', 'skills');
  const destSkills = join(vaultPath, '.opencode', 'skills');

  for (const skill of skills) {
    const src = join(srcSkills, skill);
    const dest = join(destSkills, skill);
    if (existsSync(src)) {
      mkdirSync(dest, { recursive: true });
      const content = readFileSync(join(src, 'SKILL.md'), 'utf-8');
      writeFileSync(join(dest, 'SKILL.md'), content, 'utf-8');
      console.log(chalk.green('  ✓'), `Copied skill: ${skill}`);
    } else {
      console.log(chalk.yellow('  !'), `Skill not found: ${skill}`);
    }
  }
}

function copyRules(vaultPath) {
  const srcRules = join(ROOT, 'modules', 'rules');
  const destRules = join(vaultPath, '.opencode', 'rules');

  mkdirSync(destRules, { recursive: true });

  const files = ['vault-rules.md', 'agents-instruct.md'];
  for (const f of files) {
    const src = join(srcRules, f);
    const dest = join(destRules, f);
    if (existsSync(src)) {
      const content = readFileSync(src, 'utf-8');
      writeFileSync(dest, content, 'utf-8');
      console.log(chalk.green('  ✓'), `Copied rule: ${f}`);
    }
  }

  // Copy agents-instruct as AGENTS.md to CACHE/AI/ if not exists
  const agentsCache = join(vaultPath, 'CACHE', 'AI', 'AGENTS.md');
  if (!existsSync(agentsCache) && existsSync(join(destRules, 'agents-instruct.md'))) {
    const content = readFileSync(join(destRules, 'agents-instruct.md'), 'utf-8');
    writeFileSync(agentsCache, content, 'utf-8');
  }
}

function copyPrompts(vaultPath, prompts) {
  const srcPrompts = join(ROOT, 'modules', 'prompts');
  const destPrompts = join(vaultPath, '.opencode', 'prompts');

  mkdirSync(destPrompts, { recursive: true });

  for (const p of prompts) {
    const src = join(srcPrompts, `${p}.md`);
    const dest = join(destPrompts, `${p}.md`);
    if (existsSync(src)) {
      const content = readFileSync(src, 'utf-8');
      writeFileSync(dest, content, 'utf-8');
      console.log(chalk.green('  ✓'), `Copied prompt: ${p}`);
    }
  }
}

// ---- Get module selections for a preset ----
function getPresetModules(preset) {
  const manifest = readJSON(join(ROOT, 'modules', 'index.json'));

  if (preset === 'custom') {
    return null; // Will be determined interactively
  }

  const presetFile = join(ROOT, 'presets', `${preset}.json`);
  if (!existsSync(presetFile)) {
    console.error(chalk.red(`Preset "${preset}" not found. Available: minimal, study, full, custom`));
    process.exit(1);
  }

  return readJSON(presetFile);
}

// ---- Main ----
async function main() {
  console.log(chalk.cyan.bold('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║       OpenCodeStarterPack v1.0.0         ║'));
  console.log(chalk.cyan.bold('╚══════════════════════════════════════════╝'));
  console.log();

  // Parse CLI args
  const args = process.argv.slice(2);
  const cliPreset = args.includes('--preset') ? args[args.indexOf('--preset') + 1] : null;
  const cliDir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : null;
  const nonInteractive = args.includes('--non-interactive');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.white(`
Usage: opencode-starter-pack [options]

One-command starter kit for OpenCode — skills, MCP configs, rules & prompts.

Options:
  --preset <name>       Skip the wizard, use a preset:
                        minimal, study, full, custom
  --dir <path>          Target directory for the vault
  --non-interactive     Use all defaults, no prompts
  --help, -h            Show this message

Examples:
  npx opencode-starter-pack
  npx opencode-starter-pack --preset full --dir ~/Documents/MyVault
  curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash -s -- --non-interactive
`));
    process.exit(0);
  }

  // ---- Step 1: Environment detection ----
  console.log(chalk.cyan('── Environment Detection ──'));
  const os = detectOS();
  console.log(`  OS:          ${chalk.green(os)}`);
  console.log(`  Docker:      ${hasDocker() ? chalk.green('✓') : chalk.yellow('✗')}`);
  console.log(`  Git:         ${hasCommand('git') ? chalk.green('✓') : chalk.yellow('✗')}`);
  console.log(`  Whisper:     ${hasCommand('whisper') ? chalk.green('✓') : chalk.yellow('✗')}`);
  console.log(`  OpenCode:    ${hasCommand('opencode') ? chalk.green('✓') : chalk.yellow('✗')}`);
  console.log();

  // ---- Step 2: Preset selection ----
  console.log(chalk.cyan('── Configuration ──'));

  let preset;
  if (cliPreset) {
    preset = cliPreset;
    console.log(`  Preset:       ${chalk.green(preset)} (from CLI)`);
  } else {
    const { preset: selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'preset',
        message: 'Select a preset:',
        choices: [
          { name: 'minimal  — vault + rules + meta only', value: 'minimal' },
          { name: 'study    — for students (research, web-extract, vault tools)', value: 'study' },
          { name: 'full     — everything (skills, MCP, prompts)', value: 'full' },
          { name: 'custom   — pick your own modules', value: 'custom' },
        ],
      },
    ]);
    preset = selected;
    console.log(`  Preset:       ${chalk.green(preset)}`);
  }

  const presetConfig = getPresetModules(preset);

  // ---- Step 2b: Custom module selection ----
  let selectedSkills = presetConfig ? presetConfig.modules.skills : [];
  let selectedMcp = presetConfig ? presetConfig.modules.mcp : [];
  let selectedPrompts = presetConfig ? presetConfig.modules.prompts : [];
  let includeRules = presetConfig ? presetConfig.modules.rules.length > 0 : true;

  if (preset === 'custom') {
    const manifest = readJSON(join(ROOT, 'modules', 'index.json'));

    const skillsChoices = Object.entries(manifest.modules.skills.items).map(([k, v]) => ({
      name: `${k.padEnd(20)} ${v.description}`,
      value: k,
    }));

    const mcpChoices = Object.entries(manifest.modules.mcp.items).map(([k, v]) => ({
      name: `${k.padEnd(15)} ${v.description}`,
      value: k,
    }));

    const promptChoices = Object.entries(manifest.modules.prompts.items).map(([k, v]) => ({
      name: `${k.padEnd(15)} ${v.description}`,
      value: k,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'skills',
        message: 'Select skills to install:',
        choices: skillsChoices,
      },
      {
        type: 'checkbox',
        name: 'mcp',
        message: 'Select MCP servers:',
        choices: mcpChoices,
      },
      {
        type: 'confirm',
        name: 'rules',
        message: 'Include vault rules and AGENTS.md?',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'prompts',
        message: 'Select prompts to install:',
        choices: promptChoices,
      },
    ]);

    selectedSkills = answers.skills;
    selectedMcp = answers.mcp;
    includeRules = answers.rules;
    selectedPrompts = answers.prompts;
  }

  // ---- Step 3: Configuration questions ----
  const defaultVaultPath = cliDir ? resolve(cliDir) : join(process.cwd(), 'opencode-vault');

  let answers;
  if (nonInteractive) {
    // Non-interactive mode: use defaults
    answers = {
      vaultPath: defaultVaultPath,
      userName: 'User',
      language: 'english',
      provider: 'anthropic/claude-sonnet-4-5',
      otherProvider: null,
      obsidianPort: '27123',
      sandboxPath: join(process.env.HOME || '/home', 'Documents', 'Sandbox'),
      installWhisper: false,
      quickLaunch: false,
      context7Register: false,
    };
  } else {
    const questions = [];
    // Skip vault path question if --dir was provided
    if (!cliDir) {
      questions.push({
        type: 'input',
        name: 'vaultPath',
        message: `Path to your Obsidian vault:
  (if you already have one, point to its directory)
  (if not, a new one will be created)`,
        default: defaultVaultPath,
      });
    }
    questions.push(
      {
        type: 'input',
        name: 'userName',
        message: 'What is your name?',
        default: 'User',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Preferred language:',
        choices: ['english', 'russian'],
        default: 'english',
      },
      {
        type: 'list',
        name: 'provider',
        message: 'AI provider:',
        choices: [
          { name: 'Anthropic (Claude)', value: 'anthropic/claude-sonnet-4-5' },
          { name: 'OpenAI (GPT-4o)', value: 'openai/gpt-4o' },
          { name: 'Ollama (local)', value: 'ollama/llama3' },
          { name: 'Other', value: 'other' },
        ],
      },
      {
        type: 'input',
        name: 'otherProvider',
        message: 'Enter provider/model (e.g., openai/gpt-4):',
        when: (a) => a.provider === 'other',
      },
      {
        type: 'input',
        name: 'obsidianPort',
        message: 'Obsidian Local REST API port:',
        default: '27123',
        when: () => selectedMcp.includes('obsidian') || (!presetConfig && true),
      },
      {
        type: 'input',
        name: 'sandboxPath',
        message: 'Sandbox directory path:',
        default: join(process.env.HOME || '/home', 'Documents', 'Sandbox'),
        when: () => selectedMcp.includes('sandbox') || selectedSkills.includes('sandbox'),
      },
      {
        type: 'confirm',
        name: 'installWhisper',
        message: 'Install Whisper for audio transcription? (requires brew/apt)',
        default: false,
        when: () => selectedSkills.includes('web-extract'),
      },
      {
        type: 'confirm',
        name: 'quickLaunch',
        message: 'Generate a quick-launch script (start.sh) for OpenCode + Obsidian Terminal plugin?',
        default: true,
        when: () => selectedMcp.includes('bytestash'),
      },
      {
        type: 'confirm',
        name: 'context7Register',
        message: 'Open browser to register for Context7 API key? (free, required for Context7 MCP)',
        default: true,
        when: () => selectedMcp.includes('context7'),
      }
    );
    answers = await inquirer.prompt(questions);
  }

  // ---- Context7 registration ----
  if (answers.context7Register && selectedMcp.includes('context7')) {
    console.log(chalk.cyan('\n── Context7 Registration ──'));
    console.log(chalk.white('  Opening https://context7.com in your browser...'));
    try {
      const { execSync } = await import('child_process');
      if (os === 'macos') execSync('open https://context7.com', { stdio: 'ignore' });
      else if (os === 'linux') execSync('xdg-open https://context7.com 2>/dev/null || true', { stdio: 'ignore' });
      else if (os === 'windows') execSync('start https://context7.com', { stdio: 'ignore' });
    } catch { /* ignore */ }
    console.log(chalk.white('  After registration, paste your API key into opencode.json'));
    console.log(chalk.white('  Context7 section.'));
    console.log();
  }

  // ---- Surfing plugin warning ----
  if (answers.quickLaunch && selectedMcp.includes('bytestash')) {
    console.log(chalk.yellow('  ⚠  Quick launch with ByteStash requires the Obsidian Surfing plugin.'));
    console.log(chalk.white('     Install: Obsidian → Settings → Community Plugins → Surfing'));
    console.log();
  }

  // If --dir was provided via CLI, use it directly
  if (cliDir) {
    answers.vaultPath = defaultVaultPath;
  }

  const vaultPath = resolve(answers.vaultPath);

  // ---- Step 4: Apply ----
  console.log(chalk.cyan('\n── Installing OpenCodeStarterPack ──\n'));

  // Check if target exists
  if (existsSync(vaultPath)) {
    let overwrite = false;
    if (nonInteractive) {
      console.log(chalk.white(`    Non-interactive mode: installing OpenCode config files`));
      overwrite = true;
    } else {
      console.log(chalk.yellow(`  ! Existing vault found at this location`));
      console.log(chalk.white(`    Your notes and files will NOT be touched.`));
      console.log(chalk.white(`    Only OpenCode config files (.opencode/, CACHE/AI/, opencode.json)`));
      console.log(chalk.white(`    will be added or updated.`));
      console.log();
      const resp = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Add OpenCode configuration to this vault?',
          default: true,
        },
      ]);
      overwrite = resp.overwrite;
    }
    if (!overwrite) {
      console.log(chalk.yellow('  Skipping — existing vault preserved'));
      console.log(chalk.cyan('\n── Done ──\n'));
      return;
    }
  }

  // Generate vault structure
  generateVaultStructure(vaultPath);

  // Generate meta-files
  generateMetaFiles(vaultPath, answers.userName, answers.language);

  // Copy rules
  if (includeRules) {
    copyRules(vaultPath);
  }

  // Copy skills
  if (selectedSkills.length > 0) {
    copySkills(vaultPath, selectedSkills);
  }

  // Copy prompts
  if (selectedPrompts.length > 0) {
    copyPrompts(vaultPath, selectedPrompts);
  }

  // Generate opencode.json
  const modelName = answers.provider === 'other' ? answers.otherProvider : answers.provider;
  generateOpencodeJson(vaultPath, {
    ...answers,
    model: modelName,
    mcpObsidian: selectedMcp.includes('obsidian'),
    mcpDocker: selectedMcp.includes('docker'),
    mcpGit: selectedMcp.includes('git'),
    mcpSandbox: selectedMcp.includes('sandbox'),
    mcpBytestash: selectedMcp.includes('bytestash'),
    mcpContext7: selectedMcp.includes('context7'),
  });

  // ---- Generate start.sh ----
  if (answers.quickLaunch) {
    const startShPath = join(vaultPath, 'start.sh');
    const bytestashDir = join(process.env.HOME || '/home', 'Documents', 'Docker', 'Bytestash');
    const opencodeBin = join(process.env.HOME || '/home', '.opencode', 'bin', 'opencode');
    const startShContent = `#!/bin/bash
set -e

BYTESTASH_DIR="${bytestashDir}"
VAULT_DIR="${vaultPath}"

cleanup() {
  echo "Stopping Bytestash..."
  (cd "$BYTESTASH_DIR" && docker compose down 2>/dev/null || true)
  echo "Done."
}

trap cleanup EXIT

echo "Starting Bytestash..."
(cd "$BYTESTASH_DIR" && docker compose up -d)

echo "Waiting for Bytestash to be ready..."
sleep 3

echo "Opening Bytestash in Obsidian..."
if command -v open &>/dev/null; then
  open "obsidian://web-open?url=http://localhost:7654/" 2>/dev/null || echo "  (could not open Bytestash in Obsidian)"
fi

echo "Starting OpenCode..."
cd "$VAULT_DIR"
opencode
`;
    writeFileSync(startShPath, startShContent, 'utf-8');
    chmodSync(startShPath, 0o755);
    console.log(chalk.green('  ✓'), 'Generated start.sh (quick launch script)');
    console.log(chalk.white('     Run: cd', vaultPath, '&& ./start.sh'));
  }

  // ---- Whisper installation ----
  if (answers.installWhisper) {
    console.log(chalk.cyan('\n── Installing Whisper ──'));
    try {
      if (os === 'macos') {
        execSync('brew install openai-whisper yt-dlp ffmpeg', { stdio: 'inherit' });
      } else if (os === 'linux') {
        execSync('sudo apt-get install -y whisper yt-dlp ffmpeg', { stdio: 'inherit' });
      }
      console.log(chalk.green('  ✓'), 'Whisper installed');
    } catch {
      console.log(chalk.yellow('  !'), 'Whisper installation failed. Install manually.');
    }
  }

  // ---- Summary ----
  console.log(chalk.cyan('\n── Installation Complete ──\n'));
  console.log(chalk.green(`  ✓ Vault created at: ${vaultPath}`));
  console.log(`  ✓ Skills:       ${selectedSkills.length > 0 ? selectedSkills.join(', ') : 'none'}`);
  console.log(`  ✓ MCP servers:  ${selectedMcp.length > 0 ? selectedMcp.join(', ') : 'none'}`);
  console.log(`  ✓ Rules:        ${includeRules ? 'yes' : 'no'}`);
  console.log(`  ✓ Prompts:      ${selectedPrompts.length > 0 ? selectedPrompts.join(', ') : 'none'}`);
  console.log();

  console.log(chalk.cyan('── Next Steps ──\n'));

  console.log(chalk.white('  1. Open vault in Obsidian:'));
  console.log(chalk.white(`     Open Obsidian → Open another vault → Open folder as vault → select:`));
  console.log(chalk.white(`       ${vaultPath}`));
  console.log(chalk.white(''));
  console.log(chalk.white('  2. Install required Obsidian plugins:'));
  console.log(chalk.white('     Settings → Community Plugins → Browse:'));
  console.log(chalk.white('     - "Local REST API" (by Coddington) → Install & Enable'));
  console.log(chalk.white('     - "Terminal" → Install & Enable (for quick launch)'));
  if (selectedMcp.includes('bytestash')) {
    console.log(chalk.white('     - "Surfing" → Install & Enable (for ByteStash integration)'));
  }
  console.log(chalk.white(''));
  console.log(chalk.white(`  3. Get Obsidian API token:`));
  console.log(chalk.white('     Settings → Local REST API → Copy token'));
  console.log(chalk.white(`  4. Edit ${vaultPath}/opencode.json:`));
  console.log(chalk.white('     - Paste the token into Authorization fields'));
  if (answers.context7Register) {
    console.log(chalk.white('     - Paste your Context7 API key into the context7 section'));
  }
  console.log(chalk.white(`  5. Run: cd ${vaultPath} && opencode`));
  console.log(chalk.white('  6. Connect to provider: /connect in opencode TUI'));
  console.log(chalk.white('  7. Run: /start to see available skills'));
  if (existsSync(join(vaultPath, 'start.sh'))) {
    console.log(chalk.white(''));
    console.log(chalk.white('  Quick launch with ByteStash:'));
    console.log(chalk.white(`    cd ${vaultPath} && ./start.sh`));
  }
  console.log();
}

main().catch((err) => {
  console.error(chalk.red('\nError:'), err.message);
  process.exit(1);
});
