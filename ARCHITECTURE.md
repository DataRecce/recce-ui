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
