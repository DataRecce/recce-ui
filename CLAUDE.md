# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Recce UI (`@datarecce/ui`) is a React component library for building data validation and review interfaces. It provides the UI components used in [Recce](https://github.com/DataRecce/recce), a data validation tool for dbt projects. The library enables developers to create data comparison, profiling, and validation workflows with pre-built, production-ready components.

**Key Architecture:** This is a wrapper library that packages the open-source Recce project for npm distribution. It uses a git submodule pattern where actual component source lives in `recce-source/` (pointing to the main Recce repository), while `src/` contains only re-exports and minimal customizations for the npm package.

## Critical Constraints & Guidelines

### Do NOT:

- ❌ **Skip submodule initialization**: Always clone with `--recursive` flag or run `git submodule init && git submodule update`
- ❌ **Edit files in recce-source/ directly**: This is OSS code from the main Recce repo; use patches if modifications are needed
- ❌ **Use npm or yarn**: Must use `pnpm` as specified in .npmrc and package.json
- ❌ **Bypass pre-commit hooks**: Never use `--no-verify` on commits; hooks enforce quality standards
- ❌ **Commit node_modules or dist/**: These are build artifacts and dependencies (gitignored)
- ❌ **Edit generated files in dist/**: Always regenerate via `pnpm build` or `make build`
- ❌ **Publish without running build**: `prepublishOnly` hook ensures this, but never bypass it
- ❌ **Add dependencies not in recce-source**: Keep dependency lists synchronized with OSS package
- ❌ **Use interactive git commands**: Never use `git rebase -i`, `git add -i` (interactive prompts don't work)

### Always:

- ✅ **Initialize submodules with --recursive flag**: `git clone --recursive` or use submodule commands after clone
- ✅ **Use pnpm for package management**: Package manager is locked to pnpm via .npmrc
- ✅ **Run make sync when updating from OSS**: This updates submodule, syncs deps, and installs
- ✅ **Build before testing locally with link**: Run `make build` then `make link` for local testing
- ✅ **Run type:check before committing**: Ensure `pnpm type:check` passes to catch errors early
- ✅ **Keep dependencies in sync with recce-source**: Use `pnpm run sync:deps` to synchronize
- ✅ **Update VERSION file with package.json**: Both must match for consistency
- ✅ **Test component exports**: Run `pnpm check:exports` to find new/stale exports

## Git Development Practices

### Branch Naming

All new code MUST be developed in a branch with one of these prefixes, branched directly from `main`:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `hotfix/` - Critical production fixes

```bash
# Create a new feature branch
git checkout main
git pull origin main
git checkout -b feature/my-new-feature
```

### Commit Requirements

**1. Sign-off (DCO):** Every commit MUST include a "Signed-off-by:" line per the [Developer Certificate of Origin](https://developercertificate.org/):

```bash
git commit -s -m "Your commit message"
```

**2. Semantic/Conventional Commits:** Use structured commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
Signed-off-by: Your Name <your.email@example.com>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (deps, build, CI)

**Examples:**

```bash
git commit -s -m "feat(components): add LineageView export"
git commit -s -m "fix(build): ensure global-styles loaded first"
git commit -s -m "docs: update CLAUDE.md with submodule workflow"
git commit -s -m "chore(deps): sync dependencies from recce-source"
```

**Additional Guidelines:**

- Commit frequently during development
- Use worktrees for parallel work (`git worktree --help`)
- Main branch requires PRs
- Pre-commit hooks enforce quality—never skip them

## Code Organization Philosophy

### Wrapper Architecture

This project follows a **git submodule wrapper pattern**:

```
┌─────────────────────────────────────┐
│  @datarecce/ui (npm package)        │
│  ┌─────────────────────────────┐   │
│  │  src/ (wrapper layer)       │   │
│  │  - Re-exports               │   │
│  │  - Minimal overrides        │   │
│  └─────────────────────────────┘   │
│           ↓ imports                 │
│  ┌─────────────────────────────┐   │
│  │  recce-source/js/src/       │   │
│  │  (git submodule - OSS code) │   │
│  │  - Actual implementations   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Why this pattern:**
- Maintains single source of truth (Recce OSS repository)
- Enables npm distribution without duplicating code
- Allows customizations without forking
- Keeps dependencies synchronized automatically

### Dependency Rules

**What can import what:**

- ✅ `src/` can re-export from `recce-source/js/src/` via path aliases (`@/`, `src/`)
- ✅ `scripts/` can read/sync from `recce-source/js/package.json`
- ✅ `tsdown.config.ts` can override specific modules (like `useAppRouter`)
- ❌ Never modify `recce-source/` files directly (OSS code, use patches if needed)
- ❌ Don't add dependencies not present in `recce-source/js/package.json`
- ❌ Don't import from `dist/` in source files

### Where to Add New Code

| What You're Adding | Where It Goes | Notes |
|--------------------|---------------|-------|
| New component export | `src/components/index.ts` | Add re-export from recce-source |
| New API export | `src/api/index.ts` | Add re-export from recce-source |
| New hook export | `src/hooks/index.ts` | Add re-export from recce-source |
| New type export | `src/types/index.ts` | Add re-export from recce-source |
| Custom override | `src/lib/` | Only when OSS version needs wrapper-specific logic |
| Build script | `scripts/` | For build-time processing |
| Global styles | `src/global-styles.css` | Theme config and CSS variables |
| Theme customization | `src/theme.ts` or `src/mui-augmentation.d.ts` | MUI theme extensions |

## Architecture & Tech Stack

### Component Library Package

**Build & Distribution:**
- **Node.js >=20** - JavaScript runtime (specified in .nvmrc and package.json engines)
- **pnpm** - Package manager (NOT npm or yarn, locked via .npmrc)
- **TypeScript 5.9** - Type safety and .d.ts generation
- **tsdown 0.18.3** - Unified TypeScript bundler (replaces webpack/rollup/vite)

tsdown handles the entire build pipeline: TypeScript compilation, bundling, minification, and type definition generation. It produces dual-format output (CJS + ESM) with source maps and tree-shakeable exports.

**UI Framework & Styling:**
- **React 18/19** - UI library (peer dependency, supports both versions)
- **MUI Material 7** - Component framework with custom theme extensions
- **Emotion** - CSS-in-JS styling engine (required by MUI)
- **Tailwind CSS 4** - Utility classes (consumers import separately)

MUI provides the base component system. The library extends MUI with 9 custom colors (brand, iochmara, cyan, amber, green, red, rose, fuchsia, neutral) and custom size variant "xsmall" for buttons and chips.

**State Management & Data:**
- **TanStack Query 5** - Server state and API caching (peer dependency)
- **Axios** - HTTP client for API requests (peer dependency)
- **React Flow (@xyflow/react 12)** - Lineage graph visualization

**Additional Libraries:**
- **CodeMirror 6** - SQL and YAML editors with syntax highlighting
- **Chart.js** - Data visualization (histograms, bar charts)
- **ag-Grid** - High-performance data grids
- **date-fns** - Date manipulation utilities
- **Git Submodules** - OSS code integration from https://github.com/DataRecce/recce

### Key Design Patterns

**Submodule Integration:**
- Actual component source lives in `recce-source/js/src/`
- Wrapper layer in `src/` re-exports for npm packaging
- Path aliases (`@/`, `src/`) map to submodule paths
- Dependencies synced via `scripts/sync-deps.js`

**Build Pipeline:**
- tsdown compiles TypeScript to CJS + ESM
- CSS extracted and aggregated into `dist/styles.css`
- Type definitions generated as `.d.ts` files
- Tree-shakeable exports via package.json "exports" field

**Theme System:**
- MUI theme with custom color palette
- CSS custom properties for light/dark mode
- Global styles with `@theme` directive (Tailwind v4)
- Theme available as `@datarecce/ui/theme` export

## Project Structure

```
recce-ui/
├── src/                         # Wrapper/re-export source files
│   ├── index.ts                 # Main entry point (re-exports everything)
│   ├── components/index.ts      # Component exports (150+ components)
│   ├── api/index.ts             # API client utilities
│   ├── hooks/index.ts           # Custom React hooks
│   ├── types/index.ts           # TypeScript type definitions
│   ├── theme.ts                 # MUI theme exports
│   ├── global-styles.css        # Global CSS (theme config, CSS variables)
│   ├── lib/                     # Custom wrapper implementations
│   │   └── hooks/
│   │       ├── RouteConfigContext.ts    # Routing context for wrapper
│   │       └── useAppRouter.ts          # Custom router hook
│   ├── global.d.ts              # Global type declarations for SVG/CSS
│   └── mui-augmentation.d.ts    # MUI theme type extensions
│
├── recce-source/                # Git submodule (DataRecce/recce OSS)
│   ├── .git                     # Submodule git reference
│   └── js/src/                  # Actual component implementations
│       ├── components/          # 27 component directories
│       │   ├── lineage/         # Lineage visualization
│       │   ├── query/           # SQL query interface
│       │   ├── check/           # Validation checks
│       │   ├── run/             # Execution runs
│       │   ├── schema/          # Schema inspection
│       │   └── ...
│       ├── lib/                 # Shared utilities and hooks
│       ├── constants/           # Application constants
│       └── utils/               # Helper functions
│
├── scripts/
│   ├── create-styles.js         # Aggregates CSS into dist/styles.css
│   ├── sync-deps.js             # Syncs dependencies from recce-source
│   ├── sync-submodule.sh        # Updates git submodule
│   ├── apply-patches.js         # Applies patches to submodule (if any)
│   └── check-exports.js         # Validates component exports
│
├── dist/                        # Built output (generated by tsdown)
│   ├── *.js / *.mjs             # CJS and ESM bundles
│   ├── *.d.ts / *.d.mts         # TypeScript declarations
│   ├── *.css                    # Component stylesheets
│   ├── styles.css               # Aggregated CSS (all imports)
│   └── *.map                    # Source maps
│
├── Makefile                     # Build automation commands
├── package.json                 # Dependencies, scripts, exports
├── pnpm-workspace.yaml          # pnpm workspace config
├── tsconfig.json                # TypeScript configuration
├── tsdown.config.ts             # tsdown bundler configuration
├── .npmrc                       # npm/pnpm registry settings
├── .nvmrc                       # Node version (24.12.0)
├── .gitmodules                  # Git submodule reference
├── VERSION                      # Version number (synced with package.json)
└── README.md                    # Package documentation
```

## Development Commands

### Initial Setup

**Prerequisites:**
- Node.js >= 20 (check with `node --version`)
- pnpm (install with `npm install -g pnpm`)
- Git with submodule support

**First Time Setup:**

```bash
# Clone repository WITH submodules
git clone --recursive https://github.com/DataRecce/recce-ui.git
cd recce-ui

# If you forgot --recursive, initialize submodules now:
git submodule init
git submodule update

# Install dependencies
pnpm install

# Build the library
make build

# Run type checking
make type-check
```

### Build and Development

```bash
# Show all available commands
make help

# Build the package (tsdown + CSS aggregation)
make build
# OR
pnpm build

# Watch mode for development (rebuilds on file changes)
pnpm dev

# Type checking (filters out OSS errors)
make type-check
# OR
pnpm type:check

# Type checking including OSS errors (for debugging)
make type-check-all
# OR
pnpm type:check:all

# Check for new/stale component exports
make check-exports
# OR
pnpm check:exports

# Clean build artifacts
make clean

# Full rebuild (clean + build)
make rebuild

# Run all checks (sync + build + type-check + check-exports)
make verify
```

### Submodule Management

The `recce-source` submodule points to the main Recce OSS repository. Keep it updated to get latest components:

```bash
# Sync to latest main branch
# This will: update submodule, sync dependencies, install packages
make sync

# Sync to a specific branch (for testing unreleased features)
make sync-branch BRANCH=feature/new-component

# Manual submodule update
git submodule update --remote --merge
# OR
pnpm run submodule:update

# Sync dependencies from OSS package.json
pnpm run sync:deps

# Full verification after sync
make verify
```

**What `make sync` does:**
1. Updates `recce-source/` to latest commit from main branch
2. Runs `scripts/sync-deps.js` to copy dependencies from OSS package.json
3. Runs `pnpm install` to update lockfile and node_modules
4. Shows the new commit hash for tracking

### Type Checking

recce-ui has two type checking modes to handle the OSS submodule:

```bash
# Normal type check (filters OSS errors) - use during development
pnpm type:check
# Shows only errors in src/ directory
# Output: "Type check passed (OSS errors filtered)"

# Strict type check (shows all errors including OSS) - use for debugging
pnpm type:check:all
# Shows all TypeScript errors including recce-source/
# May show errors in OSS code that we don't control

# Check both
make type-check        # Filtered
make type-check-all    # All errors
```

**Why two modes?**
- OSS code may have TypeScript errors we can't fix directly
- Filtered mode lets us focus on wrapper code quality
- All-errors mode helps debug import issues and type mismatches

### Testing

```bash
# Run tests with Vitest
pnpm test

# Watch mode (re-runs tests on file changes)
pnpm test:watch
```

### Linking for Local Development

Test the library in another project before publishing:

```bash
# In recce-ui directory: build and create global link
make link
# This runs: pnpm build && pnpm link --global

# In your consumer project: link to global package
cd /path/to/your/project
pnpm link --global @datarecce/ui

# After testing, unlink from consumer
pnpm unlink @datarecce/ui

# In recce-ui directory: remove global link
make unlink
# OR
pnpm unlink --global
```

### Publishing Workflow

```bash
# 1. Sync to latest OSS
make sync

# 2. Build and verify
make verify

# 3. Update version in package.json and VERSION file
# (both must match)

# 4. Commit changes
git add .
git commit -s -m "chore: release vX.Y.Z"

# 5. Create git tag
git tag vX.Y.Z

# 6. Push with tags
git push origin main --tags

# 7. Publish to npm (prepublishOnly hook runs build automatically)
npm publish
```

## Build System Architecture

### tsdown Configuration

tsdown (`tsdown.config.ts`) handles the entire build pipeline with these key settings:

**Entry Points:**
```typescript
entry: {
  index: 'src/index.ts',           // Main bundle (everything)
  components: 'src/components/index.ts',  // Components only
  api: 'src/api/index.ts',         // API utilities
  hooks: 'src/hooks/index.ts',     // Custom hooks
  types: 'src/types/index.ts',     // Type definitions
  theme: 'src/theme.ts',           // MUI theme
  'global-styles': 'src/global-styles.css',  // CSS
}
```

**External Dependencies (not bundled):**
- React, React-DOM (peer dependencies)
- All MUI packages (`@mui/*`)
- Emotion (`@emotion/*`)
- Next.js (`next`, `next/*`)
- TanStack Query, Axios, XYFlow
- next-themes, Amplitude

**Bundled Dependencies (included in output):**
- `html-to-image` - Ensures consistent version for screenshots
- `html2canvas-pro` - Canvas rendering library

**Path Aliases:**
```typescript
'@/': './recce-source/js/src/',  // OSS source
'src': './recce-source/js/src/',
// Custom override:
'@/lib/hooks/useAppRouter': './src/lib/hooks/useAppRouter.ts'
```

**Output:**
- Format: CommonJS (`.js`) + ESM (`.mjs`)
- Types: `.d.ts` and `.d.mts` files
- Source maps: `.map` files
- "use client" banner added for Next.js compatibility

### CSS Bundling Strategy

CSS is handled in two stages:

**Stage 1: tsdown extracts CSS**
- Each entry point's CSS extracted to `dist/{entry}-{hash}.css`
- Example: `components-D2DRqJsz.css`, `global-styles.css`

**Stage 2: Aggregation script (`scripts/create-styles.js`)**
```javascript
// Finds all CSS files in dist/
// Separates global-styles (must be first)
// Creates dist/styles.css with @import statements
```

**Result (`dist/styles.css`):**
```css
@import './global-styles.css';           // CSS variables first!
@import './components-BeAjVBV3.css';
@import './components-iUxcqtUB.css';
@import './state-DOUPNifc.css';
```

**Why this order matters:**
- Global styles define CSS custom properties (--recce-*)
- Component styles reference these properties
- Import order ensures variables exist before use

**Consumer usage:**
```tsx
// In consumer app
import '@datarecce/ui/styles';  // Single import gets everything
```

### Type Generation

TypeScript declarations generated via tsdown:

```
src/index.ts
  ↓ tsdown (with dts: true)
dist/
  ├── index.d.ts        # CommonJS types
  ├── index.d.mts       # ESM types
  ├── index-{hash}.d.ts # Shared type definitions
  └── *.d.ts.map        # Source maps for types
```

**Type exports:**
- Re-exports from recce-source maintain type information
- Custom augmentations in `src/mui-augmentation.d.ts`
- Global declarations in `src/global.d.ts`

**MUI Theme Augmentation:**
```typescript
// Extends MUI with custom colors and sizes
declare module '@mui/material/styles' {
  interface Palette {
    brand: PaletteColor;
    iochmara: PaletteColor;
    // + 7 more custom colors
  }
}
```

## Code Patterns

### Re-exporting from OSS

**Pattern for adding new component exports:**

```typescript
// src/components/index.ts
export {
  LineageView,
  QueryForm,
  SchemaView,
  // Add new component here:
  NewComponent,
} from '@/components';  // @ alias points to recce-source/js/src/

// Types are automatically included
export type {
  LineageViewProps,
  NewComponentProps,  // Add corresponding type
} from '@/components';
```

**Finding new components to export:**
```bash
# Run the export checker
pnpm check:exports

# Output shows:
# ✓ Components exported: 150
# ✗ Missing exports: NewComponent (found in recce-source)
# ✗ Stale exports: OldComponent (not found in recce-source)
```

### Path Aliases

Two path alias systems work together:

**TypeScript (tsconfig.json):**
```json
{
  "paths": {
    "@/*": ["./recce-source/js/src/*"],
    "src/*": ["./recce-source/js/src/*"],
    "public/*": ["./recce-source/js/public/*"]
  }
}
```

**tsdown (tsdown.config.ts):**
```typescript
alias: {
  '@': './recce-source/js/src/',
  'src': './recce-source/js/src/',
  'public': './recce-source/js/public/',
}
```

**Usage:**
```typescript
// All of these work:
import { LineageView } from '@/components/lineage/LineageView';
import { QueryForm } from 'src/components/query/QueryForm';
import icon from 'public/icons/check.svg';
```

### Custom Overrides

Sometimes the wrapper needs different behavior than OSS. Use the override pattern:

**Example: useAppRouter hook**

OSS version uses Next.js router directly. Wrapper needs custom `RouteConfigContext`.

**Step 1: Create custom version in src/lib/**
```typescript
// src/lib/hooks/useAppRouter.ts
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConfigContext } from './RouteConfigContext';

export function useAppRouter() {
  const router = useRouter();
  const routeConfig = useContext(RouteConfigContext);

  // Custom logic using routeConfig
  return { router, routeConfig };
}
```

**Step 2: Configure alias in tsdown.config.ts**
```typescript
alias: {
  // Override the OSS version
  '@/lib/hooks/useAppRouter': './src/lib/hooks/useAppRouter.ts',
  // General aliases
  '@': './recce-source/js/src/',
}
```

**Result:**
- All imports of `@/lib/hooks/useAppRouter` resolve to wrapper version
- Other OSS code continues to work
- No modifications to recce-source/ needed

## Configuration

### Key Files

**package.json**
- Dependencies synced from `recce-source/js/package.json`
- Scripts for build, test, type-check, submodule management
- Exports field defines entry points
- PeerDependencies required by consumers

**tsconfig.json**
- TypeScript compiler options
- Path aliases mapping to recce-source
- `verbatimModuleSyntax: false` for OSS compatibility
- Excludes: node_modules, dist, tests, recce-source

**tsdown.config.ts**
- Build tool configuration
- Entry points, format (CJS + ESM), externals
- Path aliases, custom overrides
- CSS loading, source maps

**.gitmodules**
- Submodule reference: `url = https://github.com/DataRecce/recce.git`
- Submodule path: `path = recce-source`

**VERSION**
- Single source of truth for version number
- Must match `package.json` version field
- Used by deployment and CI/CD

**Makefile**
- Convenient commands for common tasks
- Wraps pnpm scripts with simpler names
- Automates sync workflow

**.npmrc**
- Forces pnpm usage (`package-manager-strict=true`)
- Registry configuration

**.nvmrc**
- Node version for development (24.12.0)
- Used by nvm and CI/CD

## Common Errors & Fixes

### Submodule Not Initialized

**Error:**
```
Error: Cannot find module '../recce-source/js/src/components'
fatal: not a git repository (or any of the parent directories): .git
```

**Fix:**
```bash
# Initialize and update submodules
git submodule init
git submodule update

# OR re-clone with --recursive
git clone --recursive https://github.com/DataRecce/recce-ui.git
```

### Dependency Mismatch

**Error:**
```
pnpm install
WARN Issues with peer dependencies found
```

**Fix:**
```bash
# Sync dependencies from OSS package.json
pnpm run sync:deps

# Reinstall
pnpm install
```

### Type Checking Fails

**Error:**
```
pnpm type:check:all
error TS2307: Cannot find module '@/components/lineage'
```

**Fix:**
```bash
# Check submodule is updated
git submodule status

# If behind, sync
make sync

# Clear type cache if needed
rm -rf node_modules/.cache
pnpm install
```

### Build Output Missing CSS

**Error:**
```
dist/styles.css is empty or missing imports
```

**Fix:**
```bash
# Rebuild to regenerate styles.css
make clean
make build

# Verify CSS aggregation
cat dist/styles.css
# Should show @import statements
```

### Global Link Not Working

**Error:**
```
# In consumer project
pnpm link --global @datarecce/ui
ERROR Cannot link @datarecce/ui: package not found
```

**Fix:**
```bash
# In recce-ui directory
# Ensure package is built first
make build

# Create global link
pnpm link --global

# Verify link created
pnpm list --global --depth=0
# Should show @datarecce/ui
```

### Import Errors in Consumer App

**Error:**
```typescript
// Consumer app
import { LineageView } from '@datarecce/ui';
// Error: Module '"@datarecce/ui"' has no exported member 'LineageView'
```

**Fix:**
```bash
# Check export exists
grep -r "LineageView" dist/index.d.ts

# If missing, add to src/components/index.ts
export { LineageView } from '@/components';

# Rebuild
pnpm build
```

### Stale Types in Consumer

**Error:**
```
Consumer app shows type errors after updating @datarecce/ui
```

**Fix:**
```bash
# In consumer project
# Clear type cache
rm -rf node_modules/.cache
rm -rf .next  # If using Next.js

# Reinstall
pnpm install

# Restart dev server
pnpm dev
```

### Submodule Detached HEAD

**Error:**
```
git submodule status
-a1b2c3d recce-source (detached HEAD)
```

**Fix:**
```bash
# This is normal! Submodules track specific commits.
# To update to latest:
make sync

# To switch submodule to specific branch:
cd recce-source
git checkout main
git pull
cd ..
git add recce-source
git commit -m "chore: update recce-source to latest main"
```

### Cannot Publish to npm

**Error:**
```
npm publish
npm ERR! 403 Forbidden
```

**Fix:**
```bash
# Login to npm
npm login

# Verify you're authenticated
npm whoami

# Check package name isn't taken (if first publish)
npm view @datarecce/ui

# Try publishing again
npm publish
```

## Key Principles

**Submodule discipline**: Always keep recce-source synced with OSS. Never edit submodule files directly—use the wrapper pattern or patches.

**Use pnpm exclusively**: Package manager is locked to pnpm for consistency. npm/yarn will fail due to .npmrc settings.

**Build before distribution**: Always run `pnpm build` before testing locally or publishing. The dist/ directory is the source of truth for consumers.

**Type safety with pragmatism**: Type check the wrapper code strictly (`pnpm type:check`), but filter OSS errors we can't control.

**Dependency synchronization**: Keep package.json dependencies in sync with recce-source using `pnpm run sync:deps`. This ensures version compatibility.

**Version consistency**: VERSION file and package.json version must always match. Update both together.

**CSS variable dependencies**: Global styles must be imported before component styles to ensure CSS custom properties are defined.

**Test with link**: Use `make link` to test in consuming applications before publishing to npm.

**Semantic versioning**: Follow semver strictly. Breaking changes = major version, new features = minor version, bug fixes = patch version.

---

## Distribution

- **Package Name:** `@datarecce/ui` (scoped package under @datarecce org)
- **Registry:** Public npm registry (https://registry.npmjs.org)
- **Versioning:** Semantic versioning (major.minor.patch) synced between package.json and VERSION file
- **Build Output:** Dual format (CommonJS + ES Modules) with TypeScript declarations for maximum compatibility
- **Entry Points:** Multiple exports (`/components`, `/api`, `/hooks`, `/types`, `/theme`, `/styles`) for tree-shaking
- **Bundle Size:** External dependencies (React, MUI) not bundled; consumers provide peer dependencies
- **Type Safety:** Full TypeScript support with `.d.ts` files for all exports
- **Compatibility:** React 18/19, Next.js 14+, Node.js >=20

## Version Management

Version number stored in two places (must be kept in sync):

1. **package.json** - `"version": "0.1.31"`
2. **VERSION file** - Plain text file with version number

**Updating version:**

```bash
# Manual update (both files)
# 1. Edit package.json version field
# 2. Edit VERSION file content
# 3. Commit both changes together

git add package.json VERSION
git commit -s -m "chore: bump version to 0.2.0"
git tag v0.2.0
git push origin main --tags
```

**Version displayed in:**
- npm package listing
- Consumer package-lock.json
- Build artifacts (embedded in bundles)

**Version strategy:**
- Major (X.0.0): Breaking changes (API changes, removed exports)
- Minor (0.X.0): New features (new components, new props)
- Patch (0.0.X): Bug fixes (no API changes)
