---
name: research
description: Search the web, check relevance, and add the best links to the reading list
---

## What it does

Searches for materials on a given topic, evaluates each result for relevance, quality, and uniqueness, then adds only genuinely useful links to `INDEXES/Reading List.md`.

## When to use

- On command **"research: <topic>"** — find and filter materials on a topic

## Algorithm

### 1. Wide search

Use `websearch` to search the topic from multiple angles:

- `websearch` with the topic (results, tutorials, overviews)
- `websearch` with "best resources <topic>"
- `websearch` with "<topic> guide tutorial 2025 2026"
- For tech topics — add `websearch "<topic> github"`

Collect all URLs from results (up to 30-40 links).

### 2. Initial filtering

Remove obviously unsuitable results:
- Duplicates
- Clearly irrelevant (wrong topic, ads, spam)
- Outdated for tech topics (older than 2-3 years)

### 3. Check each candidate

For each remaining URL:
- `webfetch` the URL (title + first 500 characters)
- Evaluate: relevant? Quality content? Unique?
- If yes — add to candidate list

### 4. Add to reading list

For each approved candidate:
- Read `INDEXES/Reading List.md` via `obsidian_vault_read`
- If not already present — add line:
  ```
  - [ ] <title> — <URL>
  ```
- Write updated file

### 5. Report

- Total links found
- How many filtered out
- How many added to reading list
- Which topics/areas covered

## Tools

- `websearch` — internet search
- `webfetch` — fetch page content for evaluation
- `obsidian_vault_read` / `obsidian_vault_write` — manage reading list
- `obsidian_vault_patch` — alternative for appending links
