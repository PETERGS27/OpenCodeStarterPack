---
name: skill-creator
description: Create new OpenCode skills interactively
---

## What it does

Creates a new skill (SKILL.md) in `.opencode/skills/<name>/` — a structured set of instructions for OpenCode, triggered by a key phrase.

## When to use

- On command **"create skill"** or **"new skill"**
- When a repetitive process should be formalized as a skill

## Algorithm

### 1. Ask the user

Ask sequentially:

1. **Skill name** — latin, kebab-case (directory name)
2. **Description** — 1 sentence for frontmatter `description`
3. **Trigger phrase** — phrase that should invoke this skill
4. **What it does** — 2-3 sentences describing functionality
5. **Step-by-step algorithm** — numbered steps

### 2. Create directory

```bash
mkdir -p ".opencode/skills/<name>/"
```

### 3. Generate SKILL.md

Format:

```markdown
---
name: <name>
description: <description>
---

## What it does

<functionality description>

## When to use

- On command **"<trigger>"** — <what happens>

## Algorithm

### 1. ...

<step-by-step algorithm>

## Tools

- list of available commands/tools...
```

### 4. Write file

Use `write` to create `.opencode/skills/<name>/SKILL.md`

### 5. Report

- Skill created
- Trigger phrase
- File location

## Format rules

- Frontmatter: required `name` and `description`
- Trigger phrases: **bold**
- Algorithm steps: numbered
- File paths: relative to vault root

## Directory structure

```
.opencode/skills/<name>/
├── SKILL.md          # main file (required)
└── ...               # optional helper files, scripts
```
