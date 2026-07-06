---
name: vault-analyzer
description: Analyze Obsidian vault structure — topic map, knowledge gaps, connections, statistics
---

## What it does

Analyzes the Obsidian vault via Obsidian MCP. Builds a topic map, finds orphan notes, suggests new connections, identifies knowledge gaps (topics with a single note), and shows statistics for tags and indexes.

## When to use

- On command **"analyze vault"** — full structural analysis
- **"knowledge map"** — visual topic and connection map
- **"find orphans"** — notes without incoming/outgoing links
- **"gaps <topic>"** — weakly covered subtopics
- **"vault stats"** — note, tag, and link counts

## Algorithm

### 1. Full vault analysis

1. List all INDEXES via `obsidian_vault_list("INDEXES/")`
2. Read each index via `obsidian_vault_read`
3. Get all tags via `obsidian_tag_list`
4. Find orphan notes:
   - List files in each `FILES/<topic>/` directory
   - Read files and check `backlinks` and `links`
5. Generate report

### 2. Find knowledge gaps

1. Select topic (or all)
2. Find all files in corresponding `FILES/<topic>/`
3. Compare note count with subjective completeness
4. Suggest: which subtopics are missing, which sources to add

### 3. Suggest connections

1. For each note, read tags from frontmatter
2. Find notes with overlapping tags
3. If no `[[wikilink]]` between them — suggest adding
4. Ask for confirmation before editing

### 4. Statistics

```yaml
Topics:
  - Machine Learning: 19 notes
  - Algorithms: 12 notes
  - ...
Total notes in FILES/: N
Total INDEXES: M
Total tags: K
Orphan notes: I
```

## Tools

- `obsidian_vault_list` — scan directories
- `obsidian_vault_read` — read content (returns backlinks/links/tags)
- `obsidian_search_query` — search by tags and frontmatter
- `obsidian_tag_list` — all vault tags
- `obsidian_vault_patch` — add wikilinks (with confirmation)
