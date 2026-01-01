# AGENTS.md

Instructions for AI coding agents working with this repository.

## Project Overview

Recce UI (`@datarecce/ui`) is a React component library wrapper that packages the open-source Recce project for npm distribution.

**Key Architecture:** Git submodule pattern
- `src/` - Wrapper layer (re-exports, minimal overrides)
- `recce-source/` - Git submodule pointing to DataRecce/recce OSS repo
- `dist/` - Built output (generated, never edit)

**Tech Stack:** React 18/19, MUI 7, TypeScript 5.9, pnpm, tsdown

---

## Critical Constraints

### Do NOT:
- Edit files in `recce-source/` directly (OSS code; use patches if needed)
- Use npm or yarn (must use pnpm; locked via .npmrc)
- Skip submodule initialization (clone with `--recursive`)
- Bypass pre-commit hooks (never use `--no-verify`)
- Edit generated files in `dist/` (regenerate via `pnpm build`)
- Add dependencies not in recce-source (keep synced with OSS)
- Use interactive git commands (`git rebase -i`, `git add -i`)
- Commit node_modules/ or dist/

### Always:
- Initialize submodules: `git submodule init && git submodule update`
- Use pnpm for all package operations
- Run `pnpm type:check` before committing
- Run `make sync` when updating from OSS
- Build before local testing: `make build && make link`
- Keep VERSION file and package.json version in sync

---

## Essential Commands

### Setup
```bash
git clone --recursive https://github.com/DataRecce/recce-ui.git
cd recce-ui
pnpm install
make build
```

### Daily Development
```bash
pnpm dev              # Watch mode (rebuilds on changes)
pnpm build            # Full build (tsdown + CSS aggregation)
pnpm type:check       # Type check (filters OSS errors)
pnpm type:check:all   # Type check including OSS errors
pnpm test             # Run tests with Vitest
pnpm check:exports    # Find new/stale component exports
```

### Submodule Management
```bash
make sync             # Update submodule, sync deps, install
make verify           # Full verification (sync + build + type-check + check-exports)
```

### Before Committing
```bash
pnpm type:check       # Must pass
pnpm build            # Ensure build succeeds
```

### Local Testing (in consumer project)
```bash
# In recce-ui:
make link

# In consumer project:
pnpm link --global @datarecce/ui
```

---

## Repository Layout

```
recce-ui/
├── src/                    # Wrapper layer (edit here)
│   ├── index.ts            # Main entry (re-exports)
│   ├── components/         # Component re-exports
│   ├── api/                # API utilities
│   ├── hooks/              # Custom hooks
│   ├── types/              # Type definitions
│   ├── lib/                # Custom overrides
│   └── global-styles.css   # Theme CSS variables
├── recce-source/           # Git submodule (DO NOT EDIT)
│   └── js/src/             # Actual component source
├── scripts/                # Build scripts
├── dist/                   # Generated output (DO NOT EDIT)
└── Makefile                # Command shortcuts
```

## Where to Add Code

| Change Type | Location | Notes |
|-------------|----------|-------|
| New component export | `src/components/index.ts` | Re-export from recce-source |
| New hook export | `src/hooks/index.ts` | Re-export from recce-source |
| New type export | `src/types/index.ts` | Re-export from recce-source |
| Custom override | `src/lib/` | When OSS needs wrapper-specific logic |
| Build script | `scripts/` | Build-time processing |
| Global styles | `src/global-styles.css` | Theme config, CSS variables |

---

## Commit Conventions

### Sign-off Required (DCO)
Every commit must include a sign-off line:
```bash
git commit -s -m "feat(components): add LineageView export"
```

### Conventional Commit Format
```
<type>(<scope>): <description>

Signed-off-by: Name <email>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```bash
git commit -s -m "feat(components): add LineageView export"
git commit -s -m "fix(build): ensure global-styles loaded first"
git commit -s -m "chore(deps): sync dependencies from recce-source"
```

### Branch Naming
All branches from `main` with prefix:
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Critical production fixes

### PR Requirements
- All type checks must pass
- Build must succeed
- Main branch requires PRs (no direct commits)

---

## Common Pitfalls

### Submodule Not Initialized
```
Error: Cannot find module '../recce-source/js/src/components'
```
**Fix:** `git submodule init && git submodule update`

### Type Errors in OSS Code
```
pnpm type:check:all shows errors in recce-source/
```
**Expected:** Use `pnpm type:check` (filters OSS errors we don't control)

### Missing Component Export
```
Module has no exported member 'ComponentName'
```
**Fix:** Add re-export to `src/components/index.ts`, then `pnpm build`

### Dependency Mismatch
```
WARN Issues with peer dependencies found
```
**Fix:** `pnpm run sync:deps && pnpm install`

---

## Additional Resources

- **[CLAUDE.md](./CLAUDE.md)** - Extended documentation for Claude Code (architecture deep-dives, patterns, troubleshooting)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Human contributor guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design documentation
