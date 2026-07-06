# Vault Rules

## Prohibitions
- Do not delete files.
- Do not modify existing files (only those created in the current session).
- Do not rename without explicit user permission.
- Do not overwrite existing notes — ask the user.
- Do not touch frontmatter — the user manages it.

## File placement
- Notes → `DESKTOP/`
- Web content → `INBOX/AI_READED/`
- Meta-files → `CACHE/AI/` (AGENTS, STRUCTURE, MASK, ROLES, TASKS — 5 files)
- At the start of each session, check all 5 meta-files; create if missing
- Update meta-files before and after each request (pre-request / post-request)

## Meta-file consistency (MetaVersion)
- Each meta-file contains `MetaVersion: N` in its header
- At session start, compare `MetaVersion` across all 5 files. If any differ — re-read and align

## Link syntax
- Wikilinks: `[[target|display text]]`
- Embeds: `![[image.png]]`
- Tags: `#Tag`

## Tag conventions
- Language-specific tags are capitalized appropriately
- Source tags use the original language (e.g., #YouTube, #Web)

## Note naming
- Note names are descriptive, human-readable, capitalized

## Web content processing
- Save to `INBOX/AI_READED/` in clean Markdown
- Remove ads, navigation, footers — keep only informational text
- If content relates to existing vault topics, append relevant `[[wikilinks]]`

## Reading list management
- Format: one link per line
- After processing a URL — remove its line from the file
- When all links are processed — mark status as completed

## Note creation via MCP
1. Create note with full frontmatter via `obsidian_vault_write`
2. Open note in UI via `obsidian_open_file`

## Tool hierarchy
1. `obsidian_vault_patch` — for precise edits
2. `obsidian_vault_write` / `obsidian_vault_append` — for full file writes
3. Raw filesystem — only if MCP is unavailable

## Security
- Destructive commands require user confirmation
- If MCP fails — gracefully fall back to filesystem and report degradation

## Conflict resolution
- If a note with the same name exists — ask the user, never overwrite

## Performance
- Keep meta-files lightweight: pointers and summaries, no large data

## Privacy
- All cloud AI requests must be anonymized: remove file paths, user name, MAC/IP addresses, API keys, tokens

## Rule changes
- Any new rule requires explicit user approval
