---
name: mcp-manager
description: Manage MCP servers — add ready-made, create custom, or remove existing
---

## What it does

Manages MCP (Model Context Protocol) servers. Adds new ready-made or custom MCP servers, removes existing ones. Searches for MCPs online or creates them from scratch for specific tasks.

## When to use

- On command **"manage MCP"** — start MCP server management dialog

## Algorithm

### 1. Ask action

Ask the user what to do:

- **Add ready-made MCP**
- **Create custom MCP**
- **Remove MCP**

### 2. Add ready-made MCP

- Ask: search online or user provides exact name?
- If search — find suitable MCP, show options
- After selection — configure and connect

### 3. Create custom MCP

- Ask: what task does the MCP solve?
- Ask technical details (API, port, transport type, etc.)
- Generate config and connect

### 4. Remove MCP

- Ask the MCP server name to remove
- Remove from configuration

## Tools

- `opencode.json` / `opencode.jsonc` — MCP configuration
- `.opencode/` — skills and config directory
- `webfetch` / `websearch` — search for ready-made MCPs online
