# OpenCodeStarterPack

**One-command starter kit for [OpenCode](https://opencode.ai).** Skills, MCP configs, rules, and prompts — modular, presettable, and updatable.

```bash
# Choose your install method:
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
npx opencode-starter-pack
brew install https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
```

---

## Features

- **8 ready-to-use skills** — web-extract, research, raw-processor, sandbox, mcp-manager, vault-analyzer, skill-creator, and a blank template
- **6 MCP configs** — Obsidian, Docker, Git, Sandbox, ByteStash, Context7
- **Rules + AGENTS.md** — vault management rules and AI agent instructions with persistent memory (meta-files)
- **5 prompts** — code-review, debug, refactor, architecture, explain
- **4 presets** — minimal, study, full, custom
- **Idempotent** — safe to re-run, never overwrites without confirmation
- **Multi-platform** — macOS, Linux, Windows

---

## Presets

| Preset | Vault Structure + Rules + Meta | Skills | MCP | Prompts |
|--------|:-----------------------------:|:------:|:---:|:-------:|
| **minimal** | ✅ mandatory | — | — | — |
| **study** | ✅ mandatory | research, web-extract, raw-processor, vault-analyzer | Obsidian, Context7 | — |
| **full** | ✅ mandatory | all 7 | all 6 | all 5 |
| **custom** | ✅ mandatory | you choose ✅ | you choose ✅ | you choose ✅ |

### minimal
Just the vault skeleton, OpenCode config, rules, and AGENTS.md with persistent memory. No extras. For those who want to start from scratch.

### study
For students who take notes in Obsidian. Research tools, web extraction, raw data processing, and vault analysis. No dev tools.

### full
Everything — all skills, MCP servers, prompts, and rules. For programmers, engineers, and anyone building their own AI tools.

### custom
Pick exactly what you need with interactive checkboxes.

---

## Installation

### curl | bash (no prerequisites)

```bash
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
```

If Node.js is detected, the interactive wizard launches automatically. If not, you'll be asked whether to install it.

### npx (requires Node.js)

```bash
npx opencode-starter-pack
```

Interactive wizard with full module selection, configuration, and apply.

### flags

```bash
curl -fsSL https://.../install.sh | bash -s -- \
  --preset full \
  --dir ~/Documents/MyVault \
  --non-interactive
```

| Flag | Description |
|------|-------------|
| `--preset <name>` | Skip the wizard, use a preset: minimal, study, full |
| `--dir <path>` | Target directory for the vault |
| `--non-interactive` | No prompts, use all defaults |
| `--help` | Show usage |

### brew (macOS)

```bash
brew install https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
```

### git clone

```bash
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
cd OpenCodeStarterPack
./install.sh
```

---

## What gets installed

### Vault structure

```
vault/
├── .opencode/
│   ├── skills/           # Copied from selected modules
│   └── rules/            # vault-rules.md + agents-instruct.md
├── INBOX/
│   ├── AI_READED/        # For web-extract skill
│   └── RAW/              # For raw-processor skill
├── FILES/                # Organized notes by topic
├── DESKTOP/              # Active workspace
├── CACHE/AI/             # Meta-files (AGENTS.md, STRUCTURE.md, etc.)
├── INDEXES/              # Reading list and topic indexes
├── README.md             # Vault dashboard
└── opencode.json         # OpenCode config with MCP
```

### Skills

| Skill | Description |
|-------|-------------|
| **web-extract** | Extract content from web pages and YouTube videos with transcription |
| **research** | Search the web, filter results, add to reading list |
| **raw-processor** | Scan INBOX/, cluster by topic, create indexes, distribute to FILES/ |
| **sandbox** | Docker-based code sandbox (C/C++/Python) |
| **mcp-manager** | Add/remove MCP servers |
| **vault-analyzer** | Analyze vault structure, find orphans, suggest connections |
| **skill-creator** | Create new skills interactively |
| **template** | Blank skill template for your own skills |

### MCP configs

| MCP | Type |
|-----|------|
| **Obsidian** | Remote (Local REST API) |
| **Docker** | Local (npx docker-mcp) |
| **Git** | Local (npx @cyanheads/git-mcp-server) |
| **Sandbox** | Local (npx server-filesystem) |
| **ByteStash** | Remote (self-hosted snippet manager) |
| **Context7** | Remote (documentation search) |

### Prompts

| Prompt | Use case |
|--------|----------|
| **code-review** | Review code for bugs, style, and best practices |
| **debug** | Systematic debugging workflow |
| **refactor** | Safe refactoring with test preservation |
| **architecture** | System design and architecture decisions |
| **explain** | Explain code or concepts in detail |

---

## Updating

```bash
# If installed via curl | bash (git clone):
cd /path/to/OpenCodeStarterPack && git pull && ./install.sh

# If installed via npm:
npm update -g opencode-starter-pack

# If installed via brew:
brew install https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
```

The updater detects what's already installed and only adds/changes what's new. Existing customizations are preserved.

---

## Development

```bash
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
cd OpenCodeStarterPack
npm install
./install.sh --dir /tmp/test-vault --non-interactive
```

### Project structure

```
OpenCodeStarterPack/
├── README.md           # This file
├── install.sh          # Bash entry point (curl | bash)
├── package.json        # npm entry point
├── src/wizard.js       # Interactive Node.js CLI
├── modules/
│   ├── index.json      # Module manifest
│   ├── skills/         # Skill templates (*/SKILL.md)
│   ├── mcp/            # MCP configs (*.json)
│   ├── rules/          # Vault rules + AGENTS template
│   └── prompts/        # Coding prompts (*.md)
├── presets/            # Preset definitions (*.json)
├── init/               # Apply + update scripts
└── Formula/            # Homebrew formula
```

---

## Built on [OpenCode](https://opencode.ai)

OpenCodeStarterPack is a community starter kit for **OpenCode** — an open-source AI coding assistant distributed under the [MIT License](https://github.com/anomalyco/opencode/blob/main/LICENSE).

Original author: **anomalyco** ([OpenCode on GitHub](https://github.com/anomalyco/opencode))

---

## License

MIT © [PETERGS27](https://github.com/PETERGS27)
