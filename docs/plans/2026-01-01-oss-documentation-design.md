# OSS Documentation Overhaul Design

**Date:** 2026-01-01
**Status:** Approved
**Author:** Brainstorming session with Claude

## Problem Statement

The recce-ui repository is a public open source library but lacks standard OSS documentation and has poor audience separation:

1. **Missing quick start path** - New contributors don't know where to begin
2. **Submodule confusion** - People forget `--recursive` or don't understand the wrapper pattern
3. **Tribal knowledge gaps** - Important context only exists in developers' heads
4. **Missing standard OSS files** - No LICENSE, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md
5. **README.md is out of date** - Mixes consumer and contributor concerns

## Goals

- Serve **two audiences** clearly: library consumers and contributors
- Provide **quick start paths** for both audiences
- Add **standard OSS governance files** matching the main Recce project
- Document the **wrapper/submodule architecture** for contributors
- Use **GitHub Releases** for changelog (no CHANGELOG.md file)

## Design

### File Structure

```
recce-ui/
├── README.md              # Consumer-focused (install, use, get help)
├── CONTRIBUTING.md        # Contributor-focused (dev setup, PR process)
├── ARCHITECTURE.md        # Deep technical dive on wrapper pattern
├── LICENSE                # Apache 2.0 (copy from main Recce)
├── CODE_OF_CONDUCT.md     # Contributor Covenant (copy from main Recce)
├── SECURITY.md            # Vulnerability reporting (adapt from main Recce)
└── CLAUDE.md              # AI assistant context (already exists, keep as-is)
```

### Audience Mapping

| File | Audience | Purpose |
|------|----------|---------|
| README.md | Library consumers | Install, use, get help |
| CONTRIBUTING.md | Contributors | Dev setup, submit PRs |
| ARCHITECTURE.md | Curious developers | Understand the codebase |
| LICENSE | Legal | Apache 2.0 terms |
| CODE_OF_CONDUCT.md | Community | Behavior expectations |
| SECURITY.md | Security researchers | Report vulnerabilities |

### Content Flow

```
New user lands on repo
         │
         ▼
    README.md
    "What is this? How do I install?"
         │
         ├──► Consumer path: Quick Start → Use components
         │
         └──► Contributor path: "Looking to Contribute?"
                        │
                        ▼
               CONTRIBUTING.md
               "Clone, build, submit PR"
                        │
                        ▼ (optional)
               ARCHITECTURE.md
               "How does this all work?"
```

---

## File Specifications

### 1. README.md (Consumer Focus)

**Goal:** Help someone quickly understand what this is, install it, and get a basic example working.

**Target length:** ~100 lines

**Structure:**

```markdown
# @datarecce/ui

[Logo/Banner - matching main Recce branding]

[Badges: npm version, license, build status]

One-line pitch: React components for building data validation UIs.

## What is this?

2-3 sentences: This is the UI component library extracted from Recce.
Use it to build custom data validation interfaces in your React apps.
Link to main Recce project for context.

## Looking to Contribute?

Brief intro (2-3 sentences) welcoming contributors.
Link to CONTRIBUTING.md for development setup and PR guidelines.

## Quick Start

1. Install: `pnpm add @datarecce/ui`
2. Add peer deps (one command)
3. Minimal working example (10-15 lines)

## Available Components

Brief categorized list with 1-line descriptions.
Link to full API docs (if they exist) or CLAUDE.md for details.

## Requirements

- Node.js, React versions
- Peer dependencies table

## Links & Support

- Main Recce project
- Documentation
- Discord/Slack
- Issue tracker

## License

Apache-2.0 (one line + link)
```

**What moves OUT of README:**
- All development setup (pnpm install, make commands)
- Submodule workflow
- Project structure details
- Type checking commands

---

### 2. CONTRIBUTING.md (Contributor Focus)

**Goal:** Get a new contributor from zero to "I can make changes and submit a PR" with minimal friction.

**Target length:** ~200 lines

**Structure:**

```markdown
# Contributing to @datarecce/ui

Welcome message + link to CODE_OF_CONDUCT.md

## Quick Start (The Happy Path)

Step-by-step from clone to running locally:
1. Clone with --recursive (with explanation WHY)
2. pnpm install
3. make build
4. make type-check
5. "You're ready to develop!"

## Understanding the Architecture

Brief explanation of the wrapper pattern:
- recce-source/ is a git submodule pointing to main Recce
- src/ contains re-exports and minimal customizations
- Why this pattern exists (single source of truth)

Link to ARCHITECTURE.md for deep dive.

## Development Workflow

### Making Changes
- Where to add new exports (src/components/index.ts, etc.)
- When to use custom overrides (src/lib/)
- Running type checks, builds

### Syncing with Upstream
- make sync workflow
- What to do when submodule gets out of date

### Testing Locally in Another Project
- make link workflow

## Submitting Changes

### Branch Naming
- feature/, fix/, hotfix/ prefixes

### Commit Requirements
- Signed-off-by (DCO) - with example command
- Conventional commit format - with examples

### Pull Request Process
- What to include
- Review expectations

## Common Issues & Solutions

Top 3-5 gotchas:
- Forgot --recursive when cloning
- Dependency mismatch after sync
- Type errors from OSS code

## Getting Help

- Where to ask questions
- Issue tracker link
```

---

### 3. ARCHITECTURE.md (Deep Dive)

**Goal:** Explain the "why" and "how" of the wrapper pattern for developers who want to truly understand the codebase.

**Target length:** ~300 lines

**Structure:**

```markdown
# Architecture

## Overview

Why this library exists - packaging Recce OSS components for npm.

## The Wrapper Pattern

### Problem Statement
- Recce OSS lives in a monorepo with Python backend
- Need to distribute just the React components via npm
- Don't want to duplicate/fork the code

### Solution: Git Submodule Wrapper

┌─────────────────────────────────────────┐
│  @datarecce/ui (this repo)              │
│  ┌─────────────────────────────────┐    │
│  │  src/                           │    │
│  │  - Re-exports from submodule    │    │
│  │  - Custom overrides when needed │    │
│  └──────────────┬──────────────────┘    │
│                 │ imports               │
│  ┌──────────────▼──────────────────┐    │
│  │  recce-source/ (git submodule)  │    │
│  │  → github.com/DataRecce/recce   │    │
│  │  └── js/src/ (component source) │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

## Build Pipeline

### How tsdown Bundles Everything

[Flow diagram: source → tsdown → dist/]

- Entry points and what they contain
- Path alias resolution
- External vs bundled dependencies

### CSS Aggregation

[Diagram showing CSS flow]

- Why global-styles must load first
- How create-styles.js aggregates CSS

## Path Aliases

Table showing alias → actual path mappings.
How overrides work (useAppRouter example).

## Dependency Management

### Peer Dependencies
Why certain deps are external (React, MUI, etc.)

### Synced Dependencies
How sync-deps.js keeps versions aligned with OSS.

### Bundled Dependencies
What gets included and why (html-to-image, etc.)

## Key Design Decisions

### Why Submodule Instead of npm Dependency?
- Need to bundle, not just import
- Path alias flexibility
- Build-time customization

### Why tsdown?
- Single tool for TS + bundling + types
- Simpler than webpack/rollup/vite combo

### Why Dual Format (CJS + ESM)?
- Maximum compatibility with consumers
```

---

### 4. LICENSE

**Action:** Copy verbatim from main Recce repo (`/Users/jaredmscott/repos/recce/recce/LICENSE`)

```
Apache License 2.0
Copyright 2023 InfuseAI Inc.
```

No changes needed - same company, same license.

---

### 5. CODE_OF_CONDUCT.md

**Action:** Copy from main Recce repo with email update.

**Source:** `/Users/jaredmscott/repos/recce/recce/CODE_OF_CONDUCT.md`

**Changes:**
- Update contact email from `conduct@infuseai.io` to `conduct@reccehq.com`

Uses Contributor Covenant 2.0 (industry standard).

---

### 6. SECURITY.md

**Action:** Copy from main Recce repo with updates.

**Source:** `/Users/jaredmscott/repos/recce/recce/SECURITY.md`

**Changes:**
- Update contact email from `dev@infuseai.io` to `security@reccehq.com`
- Keep same 48-hour response commitment
- Keep same version support table

---

## Implementation Plan

### Phase 1: Governance Files (Low Risk)

1. Copy LICENSE from main Recce (no changes)
2. Copy CODE_OF_CONDUCT.md, update email to `conduct@reccehq.com`
3. Copy SECURITY.md, update email to `security@reccehq.com`

### Phase 2: New Documentation

4. Create ARCHITECTURE.md with deep-dive content
5. Create CONTRIBUTING.md with contributor workflow

### Phase 3: README Rewrite

6. Rewrite README.md with consumer focus
   - Add branding/badges
   - Add "Looking to Contribute?" section
   - Streamline to ~100 lines
   - Move dev content to CONTRIBUTING.md

### Phase 4: Verification

7. Review all links work correctly
8. Commit with conventional commit message

---

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| License | Apache 2.0 | Match main Recce project |
| Changelog | GitHub Releases only | Less maintenance, no file needed |
| Email domain | @reccehq.com | Consistent Recce branding |
| Security contact | security@reccehq.com | Dedicated inbox for vulnerabilities |
| Conduct contact | conduct@reccehq.com | Dedicated inbox for conduct issues |
| Architecture docs | Separate ARCHITECTURE.md | Keep CONTRIBUTING.md focused |

---

## Success Criteria

- [ ] New contributor can go from clone to working build in < 5 minutes
- [ ] Consumer can install and render a component in < 5 minutes
- [ ] All standard OSS files present (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)
- [ ] README focuses on consumers, links to CONTRIBUTING for developers
- [ ] Submodule pattern is clearly explained with diagrams
