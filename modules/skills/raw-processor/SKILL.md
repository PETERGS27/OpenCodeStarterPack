---
name: raw-processor
description: Process INBOX/ raw data — analyze, index, distribute to FILES/<topic>/
---

## What it does

Scans all raw files in `INBOX/` (including `INBOX/AI_READED/` and `INBOX/RAW/`). Clusters them by topic, interactively creates new indexes or adds to existing ones, places notes in `DESKTOP/`, then moves them to `FILES/<topic>/`. After confirmation, deletes all processed raw files.

## When to use

- On command **"process inbox"** — full INBOX/ processing cycle
- When you need to clean up incoming files

## Data flow

```
📥 INBOX/RAW/            ← raw video/audio
   INBOX/                ← other raw files
   INBOX/AI_READED/      ← web/transcriptions (also raw — not distributed)

⚙️ raw-processor
   Read all from INBOX/* (including AI_READED/ and RAW/)
   Cluster by topic
   Interactive: create new indexes or add to existing?

📤 DESKTOP/              ← notes land here (temporary)
   ↓
   INDEXES/<topic>.md    ← wikilinks with brief descriptions
   ↓
   FILES/<topic>/        ← notes moved here from DESKTOP/

🗑️ INBOX/*               ← everything deleted after confirmation
```

## Algorithm

### 1. Scan INBOX/

- List contents via `obsidian_vault_list`
- Include all subdirectories: `INBOX/RAW/`, `INBOX/AI_READED/`, etc.
- For each file, read content via `obsidian_vault_read`
- Build a map: file → topic, keywords, content type

### 2. Cluster by topic

- Group files by common topics
- Extract key concepts per group
- Determine if indexes already exist in `INDEXES/` for these topics

### 2a. Atomic decomposition

Before creating notes — break each raw file into **atomic notes** (one topic per note). Smaller notes are easier to read and reuse. The big picture is assembled in indexes through brief `[[link|description]]` entries.

Example: one large "MCP Guide" file → `DESKTOP/MCP Setup.md`, `DESKTOP/MCP OAuth.md`, `DESKTOP/MCP Context Budget.md`, etc.

### 3. Interactive — for each topic group

For each group, ask the user:

1. **Create a new index for this topic or add to existing?**
2. **Create new notes in DESKTOP/ or append to existing?**
3. **Where in README to add a link to the new index?**

### 4. Distribute

- Notes created/saved in `DESKTOP/`
- Indexes in `INDEXES/<topic>.md` updated with `[[link|description]]`
- After user approval — notes moved from `DESKTOP/` to `FILES/<topic>/`
- Create `FILES/<topic>/` directory if it doesn't exist

### 5. Update navigation

- Update `README.md` — new topic or link in existing section
- Create `INDEXES/<topic>.md` if new

### 6. Delete raw files

- After user confirmation — delete all processed files from `INBOX/`
- Do NOT delete without confirmation

### 7. Optional vault analysis

After distribution, ask: **"Run vault analysis?"**

If yes:
1. Get all tags via `obsidian_tag_list`
2. Check each INDEX for:
   - Notes without backlinks
   - Topics with a single note (potential gaps)
3. Search for orphan notes in `FILES/<topic>/`
4. Report:
   - How many notes added
   - Total notes per topic
   - Orphan notes found
   - Weakly covered topics
