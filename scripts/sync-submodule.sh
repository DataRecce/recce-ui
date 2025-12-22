#!/bin/bash
#
# Sync recce-source submodule to latest main branch and update dependencies
#
# Usage:
#   ./scripts/sync-submodule.sh [--branch <branch>]
#
# Options:
#   --branch <branch>  Branch to sync to (default: main)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SUBMODULE_DIR="$ROOT_DIR/recce-source"
BRANCH="main"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --branch)
            BRANCH="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "========================================"
echo "Syncing recce-source submodule"
echo "========================================"

cd "$ROOT_DIR"

# Check if submodule exists
if [ ! -d "$SUBMODULE_DIR/.git" ] && [ ! -f "$SUBMODULE_DIR/.git" ]; then
    echo "Initializing submodule..."
    git submodule update --init --recursive
fi

# Get current commit before update
CURRENT_COMMIT=$(cd "$SUBMODULE_DIR" && git rev-parse --short HEAD)
echo "Current commit: $CURRENT_COMMIT"

# Fetch and checkout latest from specified branch
echo "Fetching latest from origin/$BRANCH..."
cd "$SUBMODULE_DIR"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Get new commit after update
NEW_COMMIT=$(git rev-parse --short HEAD)
echo "New commit: $NEW_COMMIT"

if [ "$CURRENT_COMMIT" == "$NEW_COMMIT" ]; then
    echo "Submodule is already up to date."
else
    echo "Updated from $CURRENT_COMMIT to $NEW_COMMIT"
fi

cd "$ROOT_DIR"

echo ""
echo "========================================"
echo "Syncing dependencies"
echo "========================================"

# Run the sync-deps script
node scripts/sync-deps.js

echo ""
echo "========================================"
echo "Installing dependencies"
echo "========================================"

pnpm install

echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo "Submodule: $CURRENT_COMMIT -> $NEW_COMMIT"
echo "Dependencies synced and installed"
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm build' to verify build works"
echo "  2. Run 'pnpm type:check' to verify types"
echo "  3. Commit changes and create PR"
