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
