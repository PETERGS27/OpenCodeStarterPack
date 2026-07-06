#!/usr/bin/env node

import { createRequire } from 'module';
import { existsSync, readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
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
    };
  } else {
    const questions = [];
    // Skip vault path question if --dir was provided
    if (!cliDir) {
      questions.push({
        type: 'input',
        name: 'vaultPath',
        message: 'Where to create the vault?',
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
      }
    );
    answers = await inquirer.prompt(questions);
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
    console.log(chalk.yellow(`  ⚠  Directory already exists: ${vaultPath}`));
    let overwrite = false;
    if (nonInteractive) {
      overwrite = true;
    } else {
      const resp = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite existing config files? (existing notes will NOT be touched)',
          default: false,
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
  console.log(chalk.white('  1. Open Obsidian → Settings → Local REST API → enable'));
  console.log(chalk.white('     → copy the token'));
  console.log(chalk.white(`  2. Edit ${vaultPath}/opencode.json → paste token into Authorization`));
  console.log(chalk.white(`  3. Run: cd ${vaultPath} && opencode`));
  console.log(chalk.white('  4. Connect to provider: /connect in opencode TUI'));
  console.log(chalk.white('  5. Run: /start to see available skills'));
  console.log();
}

main().catch((err) => {
  console.error(chalk.red('\nError:'), err.message);
  process.exit(1);
});
