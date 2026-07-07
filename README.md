# OpenCodeStarterPack

<p align="center">
  <a href="#english">🇬🇧 English</a> •
  <a href="#russian">🇷🇺 Русский</a>
</p>

<a id="english"></a>

**One-command starter kit for [OpenCode](https://opencode.ai).** Skills, MCP configs, rules, and prompts — modular, presettable, and updatable.

```bash
# Choose your install method:
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
npx opencode-starter-pack

# or
npx OpenCodeStarterPack
brew install https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
```

---

## Quick Start (for the impatient)

```bash
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
```

The wizard will ask where your Obsidian vault is (or create a new one) and guide you through choosing the components you need.

After installation:
1. Open that folder in **Obsidian** (Open vault → Open folder as vault)
2. Install **Local REST API** plugin (Settings → Community Plugins)
3. Run `cd <your-vault> && opencode`
4. Type `/start` inside opencode to see available skills

---

## Prerequisites

Before installing, make sure you have:

1. **[Obsidian](https://obsidian.md)** installed with at least one vault created
2. **Node.js** >= 18 (the installer can install it for you)
3. **Git** (optional, for cloning)

The vault you create with this starter pack is meant to be opened in Obsidian. All skills and rules expect Obsidian to be the frontend for your notes.

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

# or
npx OpenCodeStarterPack
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
brew reinstall https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
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

## Obsidian Setup for OpenCode

For full functionality with OpenCode, configure Obsidian as follows:

### 1. Local REST API plugin
- Open Obsidian → Settings → Community Plugins → Browse
- Search and install **"Local REST API"** (by Coddington)
- Enable it → copy the API token
- You'll need this token for `opencode.json`

### 2. Recommended plugins
- **Terminal** — run shell commands inside Obsidian (for quick launch scripts)
- **Surfing** — a web browser inside Obsidian (required if using ByteStash + quick launch)
- **Excalidraw** — whiteboard/diagrams (recommended for vault-analyzer skill)

### 3. Obsidian settings
- Settings → Files & Links → **Automatically update internal links** → enable
- Settings → Editor → **Spell check** → as you prefer
- Settings → Hotkeys → optionally set hotkeys for opencode integration

### 4. Vault path
The vault created by this starter pack (`opencode-vault` by default) should be opened as an Obsidian vault:
```
Open Obsidian → Open another vault → Open folder as vault → select the directory
```

---

## Built on [OpenCode](https://opencode.ai)

OpenCodeStarterPack is a community starter kit for **OpenCode** — an open-source AI coding assistant distributed under the [MIT License](https://github.com/anomalyco/opencode/blob/main/LICENSE).

Original author: **anomalyco** ([OpenCode on GitHub](https://github.com/anomalyco/opencode))

---

## Third-Party Components

This project includes configurations for the following third-party components, each with its own license:

| Component | Author | License | Notes |
|-----------|--------|---------|-------|
| [docker-mcp](https://www.npmjs.com/package/docker-mcp) | dazza | MIT | MCP server for Docker |
| [@cyanheads/git-mcp-server](https://www.npmjs.com/package/@cyanheads/git-mcp-server) | cyanheads | MIT | MCP server for Git |
| [@modelcontextprotocol/server-filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) | Anthropic / MCP team | MIT | MCP filesystem sandbox |
| [Context7](https://context7.com) | Context7 team | Commercial | Requires **free registration** at context7.com |
| [ByteStash](https://github.com/jordanistan/bytestash) | jordanistan | MIT | Self-hosted snippet manager |
| Obsidian MCP config | [PETERGS27](https://github.com/PETERGS27) | MIT | Custom configuration template |
| ByteStash MCP config | [PETERGS27](https://github.com/PETERGS27) | MIT | Custom configuration template |

All custom MCP configurations in this pack are distributed under the MIT License by [PETERGS27](https://github.com/PETERGS27).

---

## Glossary

| Term | What it means |
|------|---------------|
| **Vault** | An Obsidian folder — a collection of your notes and settings |
| **OpenCode** | An AI coding assistant that works from your terminal |
| **MCP** | Model Context Protocol — a way to connect OpenCode to other tools (Obsidian, Docker, Git) |
| **MCP server** | A small program that lets OpenCode talk to a specific tool (e.g., "Obsidian MCP" lets OpenCode read and write your notes) |
| **Skill** | A set of instructions that teaches OpenCode how to do a specific task (e.g., "research" skill searches the web) |
| **Preset** | A pre-defined combination of skills, MCP servers, and prompts (e.g., "study" preset has research tools, "full" has everything) |
| **API key** | A secret code that lets OpenCode connect to an AI provider (like Anthropic or OpenAI) or a service (like Context7) |
| **Local REST API** | An Obsidian plugin that allows other programs (like OpenCode) to read and write your notes |
| **Token** | A password-like string that proves OpenCode has permission to access your Obsidian vault |
| **npm** | A package manager for JavaScript — used to install OpenCodeStarterPack via `npx` |
| **brew / Homebrew** | A package manager for macOS — an alternative way to install software |
| **Terminal** | The app where you type commands (Terminal.app on macOS, PowerShell on Windows) |

---

<a id="russian"></a>
<details>
<summary>🇷🇺 Русская версия</summary>

# OpenCodeStarterPack

<p align="center">
  <a href="#english">🇬🇧 English</a> •
  <a href="#russian">🇷🇺 Русский</a>
</p>

**Однокомандный стартовый набор для [OpenCode](https://opencode.ai).** Навыки, MCP конфиги, правила и промпты — модульные, с пресетами и обновлением.

```bash
# Выбери способ установки:
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
npx opencode-starter-pack

# или
npx OpenCodeStarterPack
brew install https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
```

---

## Быстрый старт (для нетерпеливых)

```bash
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
```

Мастер спросит, где находится твоё Obsidian хранилище (или создаст новое), и поможет выбрать нужные компоненты.

После установки:
1. Открой эту папку в **Obsidian** (Open vault → Open folder as vault)
2. Установи плагин **Local REST API** (Настройки → Community Plugins)
3. Запусти `cd <твоё-хранилище> && opencode`
4. Напиши `/start` внутри opencode, чтобы увидеть доступные навыки

---

## Требования

Перед установкой убедись, что у тебя есть:

1. **[Obsidian](https://obsidian.md)** с хотя бы одним созданным хранилищем
2. **Node.js** >= 18 (установщик может установить его сам)
3. **Git** (опционально, для клонирования)

Хранилище, созданное этим стартовым набором, предназначено для открытия в Obsidian. Все навыки и правила ожидают, что Obsidian будет интерфейсом для твоих заметок.

---

## Возможности

- **8 готовых навыков** — web-extract, research, raw-processor, sandbox, mcp-manager, vault-analyzer, skill-creator и пустой шаблон
- **6 MCP конфигов** — Obsidian, Docker, Git, Sandbox, ByteStash, Context7
- **Правила + AGENTS.md** — правила управления хранилищем и инструкции для AI-агентов с постоянной памятью
- **5 промптов** — code-review, debug, refactor, architecture, explain
- **4 пресета** — minimal, study, full, custom
- **Идемпотентность** — можно запускать повторно, ничего не перезаписывает без подтверждения
- **Кроссплатформенность** — macOS, Linux, Windows

---

## Пресеты

| Пресет | Структура хранилища + Правила + Мета | Навыки | MCP | Промпты |
|--------|:-----------------------------------:|:------:|:---:|:-------:|
| **minimal** | ✅ обязательно | — | — | — |
| **study** | ✅ обязательно | research, web-extract, raw-processor, vault-analyzer | Obsidian, Context7 | — |
| **full** | ✅ обязательно | все 7 | все 6 | все 5 |
| **custom** | ✅ обязательно | выбираешь ты ✅ | выбираешь ты ✅ | выбираешь ты ✅ |

### minimal
Только скелет хранилища, конфиг OpenCode, правила и AGENTS.md с постоянной памятью. Без лишнего. Для тех, кто хочет начать с нуля.

### study
Для студентов, которые ведут заметки в Obsidian. Инструменты исследования, извлечения из веба, обработки сырых данных и анализа хранилища. Без инструментов для разработки.

### full
Всё — все навыки, MCP серверы, промпты и правила. Для программистов, инженеров и всех, кто строит свои AI-инструменты.

### custom
Выбери именно то, что нужно, с помощью интерактивных чекбоксов.

---

## Установка

### curl | bash (без требований)

```bash
curl -fsSL https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/install.sh | bash
```

Если Node.js обнаружен, интерактивный мастер запустится автоматически. Если нет — спросит, хочешь ли установить его.

### npx (требуется Node.js)

```bash
npx opencode-starter-pack

# или
npx OpenCodeStarterPack
```

Интерактивный мастер с полным выбором модулей, настройкой и применением.

### Флаги

```bash
curl -fsSL https://.../install.sh | bash -s -- \
  --preset full \
  --dir ~/Documents/MyVault \
  --non-interactive
```

| Флаг | Описание |
|------|----------|
| `--preset <имя>` | Пропустить мастера, использовать пресет: minimal, study, full |
| `--dir <путь>` | Целевая директория для хранилища |
| `--non-interactive` | Без запросов, все по умолчанию |
| `--help` | Показать справку |

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

## Что устанавливается

### Структура хранилища

```
vault/
├── .opencode/
│   ├── skills/           # Копируются из выбранных модулей
│   └── rules/            # vault-rules.md + agents-instruct.md
├── INBOX/
│   ├── AI_READED/        # Для навыка web-extract
│   └── RAW/              # Для навыка raw-processor
├── FILES/                # Организованные заметки по темам
├── DESKTOP/              # Активное рабочее пространство
├── CACHE/AI/             # Мета-файлы (AGENTS.md, STRUCTURE.md и т.д.)
├── INDEXES/              # Список чтения и указатели тем
├── README.md             # Панель управления хранилищем
└── opencode.json         # Конфиг OpenCode с MCP
```

### Навыки

| Навык | Описание |
|-------|----------|
| **web-extract** | Извлечение контента из веб-страниц и YouTube-видео с транскрипцией |
| **research** | Поиск в интернете, фильтрация результатов, добавление в список чтения |
| **raw-processor** | Сканирование INBOX/, кластеризация по темам, создание указателей, распределение по FILES/ |
| **sandbox** | Docker-песочница для кода (C/C++/Python) |
| **mcp-manager** | Добавление/удаление MCP серверов |
| **vault-analyzer** | Анализ структуры хранилища, поиск сирот, предложение связей |
| **skill-creator** | Создание новых навыков интерактивно |
| **template** | Пустой шаблон для твоих навыков |

### MCP конфиги

| MCP | Тип |
|-----|------|
| **Obsidian** | Remote (Local REST API) |
| **Docker** | Local (npx docker-mcp) |
| **Git** | Local (npx @cyanheads/git-mcp-server) |
| **Sandbox** | Local (npx server-filesystem) |
| **ByteStash** | Remote (самостоятельный менеджер сниппетов) |
| **Context7** | Remote (поиск документации) |

### Промпты

| Промпт | Назначение |
|--------|------------|
| **code-review** | Проверка кода на баги, стиль и лучшие практики |
| **debug** | Систематическая отладка |
| **refactor** | Безопасный рефакторинг с сохранением тестов |
| **architecture** | Проектирование систем и архитектурные решения |
| **explain** | Объяснение кода или концепций в деталях |

---

## Обновление

```bash
# Если установлено через curl | bash (git clone):
cd /path/to/OpenCodeStarterPack && git pull && ./install.sh

# Если установлено через npm:
npm update -g opencode-starter-pack

# Если установлено через brew:
brew reinstall https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main/Formula/opencode-starter-pack.rb
```

Обновлятор определяет, что уже установлено, и только добавляет/меняет новое. Существующие кастомизации сохраняются.

---

## Разработка

```bash
git clone https://github.com/PETERGS27/OpenCodeStarterPack.git
cd OpenCodeStarterPack
npm install
./install.sh --dir /tmp/test-vault --non-interactive
```

### Структура проекта

```
OpenCodeStarterPack/
├── README.md           # Этот файл
├── install.sh          # Bash точка входа (curl | bash)
├── package.json        # npm точка входа
├── src/wizard.js       # Интерактивный Node.js CLI
├── modules/
│   ├── index.json      # Манифест модулей
│   ├── skills/         # Шаблоны навыков (*/SKILL.md)
│   ├── mcp/            # MCP конфиги (*.json)
│   ├── rules/          # Правила хранилища + шаблон AGENTS
│   └── prompts/        # Промпты для кодинга (*.md)
├── presets/            # Определения пресетов (*.json)
├── init/               # Скрипты применения и обновления
└── Formula/            # Homebrew формула
```

---

## Настройка Obsidian для OpenCode

Для полной функциональности с OpenCode настрой Obsidian следующим образом:

### 1. Плагин Local REST API
- Открой Obsidian → Настройки → Community Plugins → Browse
- Найди и установи **"Local REST API"** (от Coddington)
- Включи его → скопируй API токен
- Он понадобится для `opencode.json`

### 2. Рекомендуемые плагины
- **Terminal** — запуск команд из Obsidian (для быстрых скриптов)
- **Surfing** — веб-браузер внутри Obsidian (требуется для ByteStash + быстрого запуска)
- **Excalidraw** — доски и диаграммы (рекомендуется для навыка vault-analyzer)

### 3. Настройки Obsidian
- Настройки → Файлы и ссылки → **Автоматически обновлять внутренние ссылки** → включить
- Настройки → Редактор → **Проверка орфографии** → как хочешь
- Настройки → Горячие клавиши → опционально настрой горячие клавиши для интеграции с opencode

### 4. Путь к хранилищу
Хранилище, созданное этим стартовым набором (`opencode-vault` по умолчанию), нужно открыть как хранилище Obsidian:

```
Открой Obsidian → Open another vault → Open folder as vault → выбери директорию
```

---

## Сделано на [OpenCode](https://opencode.ai)

OpenCodeStarterPack — это стартовый набор для **OpenCode** — открытого AI-ассистента для кодинга, распространяемого под лицензией [MIT](https://github.com/anomalyco/opencode/blob/main/LICENSE).

Оригинальный автор: **anomalyco** ([OpenCode на GitHub](https://github.com/anomalyco/opencode))

---

## Сторонние компоненты

Этот проект включает конфигурации для следующих сторонних компонентов, каждый со своей лицензией:

| Компонент | Автор | Лицензия | Примечания |
|-----------|-------|----------|------------|
| [docker-mcp](https://www.npmjs.com/package/docker-mcp) | dazza | MIT | MCP сервер для Docker |
| [@cyanheads/git-mcp-server](https://www.npmjs.com/package/@cyanheads/git-mcp-server) | cyanheads | MIT | MCP сервер для Git |
| [@modelcontextprotocol/server-filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) | Anthropic / MCP team | MIT | MCP песочница файловой системы |
| [Context7](https://context7.com) | Context7 team | Commercial | Требуется **бесплатная регистрация** на context7.com |
| [ByteStash](https://github.com/jordanistan/bytestash) | jordanistan | MIT | Самостоятельный менеджер сниппетов |
| Obsidian MCP конфиг | [PETERGS27](https://github.com/PETERGS27) | MIT | Шаблон конфигурации |
| ByteStash MCP конфиг | [PETERGS27](https://github.com/PETERGS27) | MIT | Шаблон конфигурации |

Все кастомные MCP конфигурации в этом наборе распространяются под лицензией MIT от [PETERGS27](https://github.com/PETERGS27).

---

## Глоссарий

| Термин | Значение |
|--------|----------|
| **Vault (Хранилище)** | Папка Obsidian или коллекция твоих заметок и настроек |
| **OpenCode** | AI-ассистент для кодинга, работающий из терминала |
| **MCP** | Model Context Protocol — способ подключения OpenCode к другим инструментам (Obsidian, Docker, Git) |
| **MCP сервер** | Небольшая программа, позволяющая OpenCode общаться с конкретным инструментом |
| **Навык (Skill)** | Набор инструкций, обучающих OpenCode выполнять конкретную задачу |
| **Пресет** | Предопределённая комбинация навыков, MCP серверов и промптов |
| **API ключ** | Секретный код для подключения OpenCode к AI-провайдеру или сервису |
| **Local REST API** | Плагин Obsidian, позволяющий другим программам читать и писать твои заметки |
| **Токен** | Строка-пароль, подтверждающая, что OpenCode имеет доступ к твоему хранилищу Obsidian |
| **npm** | Менеджер пакетов для JavaScript — используется для установки OpenCodeStarterPack через `npx` |
| **brew / Homebrew** | Менеджер пакетов для macOS — альтернативный способ установки ПО |
| **Терминал** | Приложение для ввода команд (Terminal.app на macOS, PowerShell на Windows) |

</details>

## License

MIT © [PETERGS27](https://github.com/PETERGS27)
