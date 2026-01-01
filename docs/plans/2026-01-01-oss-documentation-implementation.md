# OSS Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add standard OSS governance files and restructure documentation for clear audience separation (consumers vs contributors).

**Architecture:** Copy governance files from main Recce repo with email updates. Create new CONTRIBUTING.md and ARCHITECTURE.md. Rewrite README.md to focus on consumers with clear contributor offramp.

**Tech Stack:** Markdown, Git

---

## Task 1: Add LICENSE File

**Files:**
- Create: `LICENSE`
- Source: `/Users/jaredmscott/repos/recce/recce/LICENSE`

**Step 1: Copy LICENSE from main Recce repo**

```bash
cp /Users/jaredmscott/repos/recce/recce/LICENSE /Users/jaredmscott/repos/recce/recce-ui/LICENSE
```

**Step 2: Verify the file was copied correctly**

```bash
head -5 LICENSE
```

Expected output should show Apache License header.

**Step 3: Commit**

```bash
git add LICENSE
git commit -s -m "chore: add Apache 2.0 LICENSE file

Copy LICENSE from main Recce repository.
Matches parent project licensing."
```

---

## Task 2: Add CODE_OF_CONDUCT.md

**Files:**
- Create: `CODE_OF_CONDUCT.md`
- Source: `/Users/jaredmscott/repos/recce/recce/CODE_OF_CONDUCT.md`

**Step 1: Copy CODE_OF_CONDUCT from main Recce repo**

```bash
cp /Users/jaredmscott/repos/recce/recce/CODE_OF_CONDUCT.md /Users/jaredmscott/repos/recce/recce-ui/CODE_OF_CONDUCT.md
```

**Step 2: Update email address**

Replace `conduct@infuseai.io` with `conduct@reccehq.com` on line 63.

Before:
```
conduct@infuseai.io
```

After:
```
conduct@reccehq.com
```

**Step 3: Verify the change**

```bash
grep -n "reccehq.com" CODE_OF_CONDUCT.md
```

Expected: Line 63 should show `conduct@reccehq.com`

**Step 4: Commit**

```bash
git add CODE_OF_CONDUCT.md
git commit -s -m "chore: add CODE_OF_CONDUCT.md

Contributor Covenant 2.0 code of conduct.
Contact: conduct@reccehq.com"
```

---

## Task 3: Add SECURITY.md

**Files:**
- Create: `SECURITY.md`
- Source: `/Users/jaredmscott/repos/recce/recce/SECURITY.md`

**Step 1: Copy SECURITY.md from main Recce repo**

```bash
cp /Users/jaredmscott/repos/recce/recce/SECURITY.md /Users/jaredmscott/repos/recce/recce-ui/SECURITY.md
```

**Step 2: Update email address**

Replace `dev@infuseai.io` with `security@reccehq.com` on line 11.

Before:
```
Please report (suspected) security vulnerabilities to **dev@infuseai.io**.
```

After:
```
Please report (suspected) security vulnerabilities to **security@reccehq.com**.
```

**Step 3: Update the thank you line at the end**

Line 25 - change "Recce" to "@datarecce/ui" for clarity:

Before:
```
Thank you for helping to keep Recce and its users safe!
```

After:
```
Thank you for helping to keep @datarecce/ui and its users safe!
```

**Step 4: Verify the changes**

```bash
grep -n "reccehq.com\|@datarecce/ui" SECURITY.md
```

Expected: Line 11 shows `security@reccehq.com`, Line 25 shows `@datarecce/ui`

**Step 5: Commit**

```bash
git add SECURITY.md
git commit -s -m "chore: add SECURITY.md

Security vulnerability reporting policy.
Contact: security@reccehq.com
48-hour response commitment."
```

---

## Task 4: Create ARCHITECTURE.md

**Files:**
- Create: `ARCHITECTURE.md`

**Step 1: Create ARCHITECTURE.md with full content**

Create the file with the following content:

```markdown
# Architecture

This document explains the architecture of `@datarecce/ui` for developers who want to understand how the library works internally.

## Overview

`@datarecce/ui` is a **wrapper library** that packages React components from the open-source [Recce](https://github.com/DataRecce/recce) project for distribution via npm. Rather than duplicating code, it uses a git submodule to reference the source and re-exports components for npm consumers.

## The Wrapper Pattern

### Problem Statement

The main Recce project is a Python-based data validation tool with a React frontend. The frontend components live in `js/src/` within a monorepo structure optimized for the Python package, not for standalone npm distribution.

We needed to:
- Distribute React components via npm as `@datarecce/ui`
- Keep a single source of truth (the main Recce repo)
- Allow minimal customizations without forking
- Maintain synchronized dependencies

### Solution: Git Submodule + Re-exports

```
┌─────────────────────────────────────────────────────────┐
│  @datarecce/ui (this repository)                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  src/                                             │  │
│  │  ├── index.ts          (main entry point)        │  │
│  │  ├── components/       (re-exports)              │  │
│  │  ├── api/              (re-exports)              │  │
│  │  ├── hooks/            (re-exports)              │  │
│  │  ├── types/            (re-exports)              │  │
│  │  ├── lib/              (custom overrides)        │  │
│  │  └── global-styles.css (theme configuration)     │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│                         │ imports via path aliases      │
│                         ▼                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │  recce-source/ (git submodule)                    │  │
│  │  └── js/src/                                      │  │
│  │      ├── components/   (actual implementations)  │  │
│  │      ├── lib/          (utilities, hooks)        │  │
│  │      ├── constants/    (shared constants)        │  │
│  │      └── utils/        (helper functions)        │  │
│  │                                                   │  │
│  │  Points to: github.com/DataRecce/recce           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  dist/ (build output)                             │  │
│  │  ├── *.js, *.mjs       (CJS + ESM bundles)       │  │
│  │  ├── *.d.ts, *.d.mts   (TypeScript declarations) │  │
│  │  └── styles.css        (aggregated CSS)          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Why This Pattern?

| Approach | Pros | Cons |
|----------|------|------|
| **Fork the repo** | Full control | Maintenance burden, drift from upstream |
| **npm dependency** | Simple | Can't customize build, can't use path aliases |
| **Git submodule** | Single source of truth, full build control | Submodule complexity |

We chose git submodule because it gives us build-time control while maintaining a single source of truth.

## Build Pipeline

### tsdown: The Bundler

We use [tsdown](https://tsdown.dev/) (built on Rolldown) to compile TypeScript, bundle modules, and generate type definitions in a single tool.

```
Source Files                    tsdown                      Output
─────────────────────────────────────────────────────────────────────
src/index.ts          ──┐                        ┌──► dist/index.js
src/components/       ──┼──► tsdown.config.ts ───┼──► dist/index.mjs
src/api/              ──┤    (entry points,      ├──► dist/index.d.ts
src/hooks/            ──┤     aliases,           ├──► dist/components.js
src/types/            ──┤     externals)         ├──► dist/api.js
src/theme.ts          ──┤                        ├──► dist/hooks.js
src/global-styles.css ──┘                        └──► dist/*.css
```

**Key configuration (`tsdown.config.ts`):**

- **Entry points:** Multiple entry points for tree-shaking (`index`, `components`, `api`, `hooks`, `types`, `theme`)
- **Formats:** Dual output (CommonJS `.js` + ESM `.mjs`)
- **Externals:** React, MUI, Emotion, TanStack Query (peer dependencies)
- **Path aliases:** Map `@/` and `src/` to `recce-source/js/src/`

### CSS Aggregation

CSS is handled in two stages:

**Stage 1: tsdown extracts CSS from each entry point**
```
src/components/ ──► dist/components-BeAjVBV3.css
src/global-styles.css ──► dist/global-styles.css
```

**Stage 2: `scripts/create-styles.js` aggregates into single import**
```css
/* dist/styles.css */
@import './global-styles.css';      /* Must be first! CSS variables */
@import './components-BeAjVBV3.css';
@import './components-iUxcqtUB.css';
```

**Why order matters:** Global styles define CSS custom properties (`--recce-*`) that component styles reference. Global must load first.

## Path Aliases

TypeScript and tsdown both resolve path aliases:

| Alias | Resolves To | Purpose |
|-------|-------------|---------|
| `@/` | `./recce-source/js/src/` | Import from OSS source |
| `src/` | `./recce-source/js/src/` | Alternative alias |
| `public/` | `./recce-source/js/public/` | Static assets |

### Custom Overrides

Sometimes the wrapper needs different behavior than OSS. Use alias overrides:

```typescript
// tsdown.config.ts
alias: {
  // Override specific module
  '@/lib/hooks/useAppRouter': './src/lib/hooks/useAppRouter.ts',
  // General aliases
  '@': './recce-source/js/src/',
}
```

This redirects all imports of `@/lib/hooks/useAppRouter` to our custom version while leaving other imports unchanged.

## Dependency Management

### Peer Dependencies (External)

These are NOT bundled. Consumers must install them:

- `react`, `react-dom` - UI framework
- `@mui/material`, `@emotion/react` - Component library + styling
- `@tanstack/react-query` - Server state management
- `@xyflow/react` - Flow diagram library
- `axios` - HTTP client

**Why external?** Prevents version conflicts and bundle bloat. Consumers likely already have these.

### Bundled Dependencies

These ARE included in the bundle:

- `html-to-image` - Screenshot functionality
- `html2canvas-pro` - Canvas rendering

**Why bundled?** Version-sensitive libraries where we need exact versions.

### Synced Dependencies

Dependencies from `recce-source/js/package.json` are synchronized via `scripts/sync-deps.js`:

```bash
pnpm run sync:deps
```

This ensures version alignment between wrapper and OSS source.

## Key Design Decisions

### Why Not Just Publish from Main Recce Repo?

The main repo is optimized for Python distribution (`pip install recce`). The JS code is built and embedded into the Python package. Separate npm publishing would require significant changes to the main repo's build system.

### Why tsdown Over Webpack/Vite/Rollup?

- **Single tool:** TypeScript compilation + bundling + type generation
- **Speed:** Built on Rolldown (Rust-based)
- **Simplicity:** One config file vs. multiple tools

### Why Dual Format (CJS + ESM)?

- ESM for modern bundlers (Vite, esbuild)
- CJS for older Node.js tooling and Jest
- Maximum compatibility with consumer build systems

### Why Filter OSS Type Errors?

The OSS code may have TypeScript errors we can't fix (would require PRs to main repo). Two type-check modes:

- `pnpm type:check` - Filters OSS errors, checks wrapper code only
- `pnpm type:check:all` - Shows all errors, useful for debugging imports

## Directory Reference

```
recce-ui/
├── src/                         # Wrapper source (what we maintain)
│   ├── index.ts                 # Main entry, re-exports everything
│   ├── components/index.ts      # Component re-exports
│   ├── api/index.ts             # API utility re-exports
│   ├── hooks/index.ts           # Hook re-exports
│   ├── types/index.ts           # Type re-exports
│   ├── theme.ts                 # MUI theme configuration
│   ├── global-styles.css        # CSS variables, theme config
│   ├── lib/                     # Custom overrides
│   │   └── hooks/
│   │       └── useAppRouter.ts  # Custom router hook
│   └── mui-augmentation.d.ts    # MUI type extensions
│
├── recce-source/                # Git submodule (DO NOT EDIT)
│   └── js/src/                  # Actual component source
│
├── scripts/
│   ├── create-styles.js         # CSS aggregation
│   ├── sync-deps.js             # Dependency sync
│   ├── sync-submodule.sh        # Submodule update
│   └── check-exports.js         # Export validation
│
├── dist/                        # Build output (generated)
├── tsdown.config.ts             # Build configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies, scripts, exports
```

## Further Reading

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development workflow
- [CLAUDE.md](./CLAUDE.md) - Full technical reference for AI assistants
- [tsdown documentation](https://tsdown.dev/)
- [Main Recce repository](https://github.com/DataRecce/recce)
```

**Step 2: Verify the file was created**

```bash
wc -l ARCHITECTURE.md
```

Expected: ~250-300 lines

**Step 3: Commit**

```bash
git add ARCHITECTURE.md
git commit -s -m "docs: add ARCHITECTURE.md

Deep-dive documentation covering:
- Git submodule wrapper pattern
- Build pipeline with tsdown
- CSS aggregation strategy
- Path alias system
- Dependency management approach"
```

---

## Task 5: Create CONTRIBUTING.md

**Files:**
- Create: `CONTRIBUTING.md`

**Step 1: Create CONTRIBUTING.md with full content**

Create the file with the following content:

```markdown
# Contributing to @datarecce/ui

Thank you for your interest in contributing! This guide will help you get set up and submit your first contribution.

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Quick Start

Get from zero to a working development environment in 5 steps:

### 1. Clone with Submodules

```bash
# IMPORTANT: Use --recursive to initialize the submodule
git clone --recursive https://github.com/DataRecce/recce-ui.git
cd recce-ui
```

**Why `--recursive`?** This repo uses a git submodule (`recce-source/`) that contains the actual component source code. Without it, imports will fail.

**Forgot `--recursive`?** Run these commands:
```bash
git submodule init
git submodule update
```

### 2. Install Dependencies

```bash
pnpm install
```

**Note:** This project requires [pnpm](https://pnpm.io/). Install it with `npm install -g pnpm` if needed.

### 3. Build the Library

```bash
make build
# or: pnpm build
```

### 4. Run Type Checking

```bash
make type-check
# or: pnpm type:check
```

### 5. You're Ready!

You can now make changes and test them.

## Understanding the Architecture

This is a **wrapper library** that packages components from the main [Recce](https://github.com/DataRecce/recce) project for npm distribution.

```
┌─────────────────────────────────────┐
│  src/ (this repo)                   │
│  - Re-exports from submodule        │
│  - Custom overrides when needed     │
└──────────────┬──────────────────────┘
               │ imports
┌──────────────▼──────────────────────┐
│  recce-source/ (git submodule)      │
│  - Actual component implementations │
│  - Points to DataRecce/recce repo   │
└─────────────────────────────────────┘
```

**Key principle:** Don't edit files in `recce-source/`. It's a submodule pointing to OSS code.

For a deep dive, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development Workflow

### Making Changes

**Adding a new component export:**

1. Find the component in `recce-source/js/src/components/`
2. Add the export to `src/components/index.ts`:
   ```typescript
   export { NewComponent } from '@/components';
   ```
3. Run `pnpm build` and `pnpm type:check`

**Adding a custom override:**

If you need wrapper-specific behavior:

1. Create your implementation in `src/lib/`
2. Add an alias override in `tsdown.config.ts`
3. See `src/lib/hooks/useAppRouter.ts` for an example

### Syncing with Upstream

When the main Recce repo has updates you need:

```bash
make sync
```

This will:
1. Update `recce-source/` to the latest commit
2. Sync dependencies from OSS `package.json`
3. Install updated dependencies

### Testing Locally in Another Project

To test your changes in a consuming application:

```bash
# In recce-ui directory
make build
make link    # Creates global pnpm link

# In your consumer project
pnpm link --global @datarecce/ui

# When done testing
pnpm unlink @datarecce/ui
```

### Available Commands

```bash
make help           # Show all commands
make build          # Build the package
make type-check     # Type check (filters OSS errors)
make type-check-all # Type check (shows all errors)
make sync           # Sync submodule and dependencies
make clean          # Remove build artifacts
make verify         # Full verification (sync + build + type-check)
make link           # Create global link for local testing
make unlink         # Remove global link
```

## Submitting Changes

### Branch Naming

Create a branch from `main` with one of these prefixes:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `hotfix/` - Critical production fixes

```bash
git checkout main
git pull origin main
git checkout -b feature/add-new-component
```

### Commit Requirements

**1. Sign-off (DCO)**

Every commit must include a sign-off line:

```bash
git commit -s -m "Your commit message"
```

This adds `Signed-off-by: Your Name <your.email@example.com>` certifying you have the right to submit this code.

**2. Conventional Commits**

Use structured commit messages:

```
<type>(<scope>): <description>

[optional body]

Signed-off-by: Your Name <your.email@example.com>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance (deps, build, CI)

**Examples:**
```bash
git commit -s -m "feat(components): add DataGrid export"
git commit -s -m "fix(build): resolve CSS ordering issue"
git commit -s -m "docs: update installation instructions"
```

### Pull Request Process

1. Push your branch to GitHub
2. Open a PR against `main`
3. Fill out the PR template
4. Wait for review

**PR Checklist:**
- [ ] `make verify` passes
- [ ] Commits are signed off
- [ ] Changes are documented if user-facing

## Common Issues

### "Cannot find module '../recce-source/js/src/...'"

**Cause:** Submodule not initialized.

**Fix:**
```bash
git submodule init
git submodule update
```

### Dependency mismatch after sync

**Cause:** OSS updated dependencies that aren't installed locally.

**Fix:**
```bash
pnpm run sync:deps
pnpm install
```

### Type errors in OSS code

**Cause:** The OSS code may have TypeScript errors we don't control.

**Fix:** Use filtered type checking for development:
```bash
pnpm type:check      # Filters OSS errors (use this)
pnpm type:check:all  # Shows all errors (for debugging)
```

### Build succeeds but exports are missing

**Cause:** New components in OSS aren't exported from wrapper.

**Fix:**
```bash
pnpm check:exports   # Shows missing/stale exports
# Then add missing exports to src/components/index.ts
```

## Getting Help

- **Questions:** Open a [GitHub Discussion](https://github.com/DataRecce/recce-ui/discussions)
- **Bugs:** Open a [GitHub Issue](https://github.com/DataRecce/recce-ui/issues)
- **Chat:** Join [Discord](https://discord.com/invite/VpwXRC34jz) or [dbt Slack #tools-recce](https://getdbt.slack.com/archives/C05C28V7CPP)

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep-dive
- [CLAUDE.md](./CLAUDE.md) - Full reference for AI assistants
- [Main Recce Docs](https://docs.reccehq.com/)
```

**Step 2: Verify the file was created**

```bash
wc -l CONTRIBUTING.md
```

Expected: ~200-250 lines

**Step 3: Commit**

```bash
git add CONTRIBUTING.md
git commit -s -m "docs: add CONTRIBUTING.md

Contributor guide covering:
- Quick start (5 steps to dev environment)
- Architecture overview with diagram
- Development workflow (making changes, syncing, testing)
- Commit conventions and PR process
- Common issues and solutions"
```

---

## Task 6: Rewrite README.md (Consumer Focus)

**Files:**
- Modify: `README.md`

**Step 1: Rewrite README.md with consumer-focused content**

Replace the entire file with:

```markdown
<p align="center">
    <a href="https://reccehq.com">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://reccehq.com/assets/images/recce-logo-stacked.avif">
            <source media="(prefers-color-scheme: light)" srcset="https://reccehq.com/assets/images/recce-logo-stacked.avif">
            <img alt="Recce" src="https://reccehq.com/assets/images/recce-logo-stacked.avif" width="200">
        </picture>
    </a>
</p>

<h1 align="center">@datarecce/ui</h1>

<p align="center">
    React components for building data validation and review interfaces.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@datarecce/ui"><img src="https://img.shields.io/npm/v/@datarecce/ui?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/DataRecce/recce-ui/blob/main/LICENSE"><img src="https://img.shields.io/github/license/DataRecce/recce-ui?style=flat-square" alt="license"></a>
    <a href="https://www.npmjs.com/package/@datarecce/ui"><img src="https://img.shields.io/npm/dm/@datarecce/ui?style=flat-square" alt="downloads"></a>
</p>

---

## What is this?

`@datarecce/ui` is the React component library extracted from [Recce](https://github.com/DataRecce/recce), a data validation tool for dbt projects. Use it to build custom data comparison, profiling, and validation interfaces in your React applications.

## Looking to Contribute?

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

Check out our [Contributing Guide](./CONTRIBUTING.md) to get started with development setup, coding standards, and the PR process.

## Quick Start

### Installation

```bash
npm install @datarecce/ui
# or
pnpm add @datarecce/ui
```

### Peer Dependencies

Install the required peer dependencies:

```bash
npm install react react-dom @mui/material @emotion/react @tanstack/react-query @xyflow/react axios
```

### Basic Setup

Wrap your application with the required providers:

```tsx
import { MuiProvider, ToasterProvider } from "@datarecce/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiProvider>
        <ToasterProvider>
          {/* Your app components */}
        </ToasterProvider>
      </MuiProvider>
    </QueryClientProvider>
  );
}
```

### Using Components

```tsx
import { LineageView, QueryForm, SchemaView } from "@datarecce/ui";

function MyDataView() {
  return (
    <div>
      <LineageView />
      <QueryForm />
      <SchemaView />
    </div>
  );
}
```

### Import Styles

```tsx
import "@datarecce/ui/styles";
```

## Available Components

### Lineage & Visualization
- `LineageView` - Interactive lineage graph
- `LineagePage` - Full lineage interface with controls
- `GraphNode`, `GraphEdge` - Graph primitives

### Query & SQL
- `QueryForm` - SQL query input
- `SqlEditor` - CodeMirror-based editor
- `QueryResultView` - Results display

### Data Profiling
- `ProfileDiffForm` - Profile comparison
- `HistogramChart` - Distribution visualization
- `TopKSummaryList` - Top-K values

### Schema
- `SchemaView` - Structure display
- `SchemaDiffView` - Schema comparison

### Validation
- `CheckList` - Validation checks
- `CheckDetail` - Check details
- `RunList`, `RunView` - Execution runs

## Entry Points

```tsx
// All exports
import { LineageView, QueryForm } from "@datarecce/ui";

// Specific categories
import { LineageView } from "@datarecce/ui/components";
import { axiosClient } from "@datarecce/ui/api";
import { useLineageViewContext } from "@datarecce/ui/hooks";
import type { DataFrame, Check } from "@datarecce/ui/types";
```

## Requirements

| Dependency | Version |
|------------|---------|
| Node.js | >= 20 |
| React | 18.x or 19.x |
| @mui/material | 7.x |
| @emotion/react | 11.x |
| @tanstack/react-query | 5.x |
| @xyflow/react | 12.x |
| axios | 1.x |

## Links

- [Recce Documentation](https://docs.reccehq.com/)
- [Main Recce Project](https://github.com/DataRecce/recce)
- [npm Package](https://www.npmjs.com/package/@datarecce/ui)
- [Issue Tracker](https://github.com/DataRecce/recce-ui/issues)

## Support

- [Discord](https://discord.com/invite/VpwXRC34jz)
- [dbt Slack #tools-recce](https://getdbt.slack.com/archives/C05C28V7CPP)
- [Email: help@reccehq.com](mailto:help@reccehq.com)

## License

[Apache-2.0](./LICENSE)
```

**Step 2: Verify the new README length**

```bash
wc -l README.md
```

Expected: ~130-150 lines (down from ~280)

**Step 3: Commit**

```bash
git add README.md
git commit -s -m "docs: rewrite README.md for consumer focus

Restructured README to focus on library consumers:
- Added branding and badges
- Added 'Looking to Contribute?' section
- Streamlined quick start
- Moved dev setup to CONTRIBUTING.md
- Reduced from ~280 to ~140 lines"
```

---

## Task 7: Final Verification

**Step 1: Verify all files exist**

```bash
ls -la LICENSE CODE_OF_CONDUCT.md SECURITY.md ARCHITECTURE.md CONTRIBUTING.md README.md
```

Expected: All 6 files should be listed.

**Step 2: Run build to ensure nothing broke**

```bash
make build
```

Expected: Build completes successfully.

**Step 3: Run type check**

```bash
make type-check
```

Expected: Type check passes.

**Step 4: Review git log**

```bash
git log --oneline -7
```

Expected: 6 commits for each file plus any prior commits.

---

## Summary

| Task | File | Action |
|------|------|--------|
| 1 | LICENSE | Copy from main Recce |
| 2 | CODE_OF_CONDUCT.md | Copy + update email |
| 3 | SECURITY.md | Copy + update email |
| 4 | ARCHITECTURE.md | Create new |
| 5 | CONTRIBUTING.md | Create new |
| 6 | README.md | Rewrite |
| 7 | - | Verification |
