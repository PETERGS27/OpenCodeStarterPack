---
name: sandbox
description: Docker-based code sandbox — create projects, compile, run, and manage containers
---

## Docker image

The sandbox runs on `petergs27/sandbox-dev` ([Docker Hub](https://hub.docker.com/r/petergs27/sandbox-dev)) — Debian bookworm-slim with g++, python3, cmake, make, git, nodejs, npm.

```bash
# Pull pre-built image
docker pull petergs27/sandbox-dev

# Or build locally (Dockerfile included in repo)
cd OpenCodeStarterPack/modules/skills/sandbox
docker compose up -d
```

The `Dockerfile` and `docker-compose.yml` are part of the sandbox module.

## What it does

Provides an isolated environment for code development via a Docker container. Creates projects in the sandbox directory, compiles and runs code inside the container, manages container lifecycle, and exports finished code.

## When to use

- On command **"create sandbox project <name>"** — new project with template
- On command **"compile <file>"** — build C/C++/Python in container
- On command **"run <file>"** — run code in container
- **"list sandbox"** — list projects
- **"rebuild sandbox"** — rebuild dev container
- **"export <project>"** — export code from sandbox

## Container lifecycle

### Pre-hook — start container

Run before compiling or running code:

1. `docker_docker_container_list` — check if `sandbox-dev` is running
2. If not — start it

### Post-hook — stop container

Run after code execution:

1. Ask user: "Still need the sandbox or stop and remove?"
2. If not needed — stop and remove container

## Algorithm

### 1. Create project

1. Pre-hook: start container
2. Create project directory
3. Generate template files if needed
4. Post-hook: ask if sandbox is still needed

### 2. Compile code

1. Pre-hook: start container
2. Write source file to project directory
3. Compile via bash:
   ```bash
   docker exec sandbox-dev bash -c 'cd /workspace/projects/<name> && gcc -o output main.c 2>&1'
   ```
4. Post-hook: ask if sandbox is still needed

### 3. Run code

1. Pre-hook: start container
2. Execute via bash:
   ```bash
   docker exec sandbox-dev bash -c 'cd /workspace/projects/<name> && ./output'
   ```
3. Post-hook: ask if sandbox is still needed

### 4. Rebuild container

1. Stop and remove container if running
2. Rebuild image:
   ```bash
   docker compose -f modules/skills/sandbox/docker-compose.yml build
   ```
3. Start fresh container:
   ```bash
   docker compose -f modules/skills/sandbox/docker-compose.yml up -d
   ```

### 5. Export code

1. Ask which project/file to export
2. Ask destination:
   - **Obsidian note** — paste as code block
   - **Filesystem** — copy to target directory
   - **ByteStash** — create snippet via `bytestash_create_snippet`
3. Report result

## Tools

- `docker_docker_container_*` — Docker MCP for container management
- `bash` — docker exec for compile/run, docker compose for start/rebuild
- Obsidian MCP — create project notes
- `bytestash_create_snippet` — export to ByteStash
- `write` / `read` — filesystem operations
