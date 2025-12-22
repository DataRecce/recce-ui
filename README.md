# @datarecce/ui

React component library for building data validation and review interfaces. This library provides the UI components used in [Recce](https://github.com/DataRecce/recce), a data validation tool for dbt projects.

## Installation

```bash
npm install @datarecce/ui
# or
yarn add @datarecce/ui
# or
pnpm add @datarecce/ui
```

## Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "@emotion/react": "^11.0.0",
  "@mui/material": "^7.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@xyflow/react": "^12.0.0",
  "axios": "^1.0.0",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

> **Note**: This library uses Material-UI (MUI) for its UI components. The `@emotion/react` dependency is required by MUI for styling.

## Usage

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

Import and use individual components:

```tsx
import {
  LineageView,
  QueryForm,
  ProfileDiffForm,
  SchemaView,
} from "@datarecce/ui";

function MyComponent() {
  return (
    <div>
      <LineageView />
      <QueryForm />
    </div>
  );
}
```

### Available Exports

The library provides multiple entry points for different features:

```tsx
// Main components
import { LineageView, QueryForm } from "@datarecce/ui/components";

// API utilities
import { axiosClient, fetchChecks } from "@datarecce/ui/api";

// Custom hooks
import { useLineageViewContext, useCheckToast } from "@datarecce/ui/hooks";

// TypeScript types
import type { DataFrame, Check, Run } from "@datarecce/ui/types";
```

## Component Categories

### Lineage Components

- `LineageView` - Interactive lineage graph visualization
- `LineagePage` - Full lineage page with controls
- `GraphNode`, `GraphEdge` - Graph building blocks
- `NodeView` - Detailed node information display

### Query Components

- `QueryForm` - SQL query input form
- `QueryPage` - Complete query interface
- `SqlEditor` - CodeMirror-based SQL editor
- `QueryResultView` - Query results display

### Profile Components

- `ProfileDiffForm` - Data profiling comparison form
- `ProfileDiffResultView` - Profile diff results display

### Chart Components

- `HistogramChart` - Histogram visualization
- `TopKSummaryList` - Top-K value summary
- `HistogramDiffForm` - Histogram comparison interface

### Schema Components

- `SchemaView` - Schema structure display
- `SchemaDiffView` - Schema comparison view
- `ColumnNameCell` - Schema column renderer

### Check Components

- `CheckList` - List of validation checks
- `CheckDetail` - Detailed check view
- `LineageDiffView` - Lineage difference visualization

### Run Components

- `RunPage` - Run execution interface
- `RunList` - List of execution runs
- `RunView` - Individual run details

## API Client Configuration

The library includes API client utilities that need to be configured with your backend URL:

```tsx
import { axiosClient } from "@datarecce/ui/api";

// Configure the API client
axiosClient.defaults.baseURL = "http://localhost:8000";
axiosClient.defaults.headers.common["Authorization"] = "Bearer token";
```

## Development

### Prerequisites

- Node.js >= 20
- pnpm (package manager)

### Quick Start

```bash
# Clone with submodules
git clone --recursive https://github.com/DataRecce/recce-ui.git
cd recce-ui

# Install dependencies
pnpm install

# Build the library
make build

# Run type checking
make type-check
```

### Available Make Commands

```bash
make help          # Show all available commands
make sync          # Sync submodule to latest main and update dependencies
make sync-branch BRANCH=feature/xyz  # Sync to specific branch
make install       # Install dependencies
make build         # Build the package
make type-check    # Run TypeScript type checking
make clean         # Clean build artifacts
make verify        # Run sync + build + type-check
```

### Syncing with Recce OSS

This package uses a git submodule (`recce-source`) that references the main Recce repository. To update to the latest version:

```bash
# Sync to latest main branch
make sync

# Or sync to a specific branch
make sync-branch BRANCH=feature/new-feature
```

The sync command will:
1. Update the submodule to the latest commit
2. Sync dependencies from the Recce OSS package.json
3. Install updated dependencies

### Manual Commands

If you prefer not to use Make:

```bash
# Initialize submodules (if not cloned with --recursive)
git submodule init
git submodule update

# Update submodule to latest
pnpm run submodule:update

# Sync dependencies from OSS
pnpm run sync:deps

# Build
pnpm build

# Type checking
pnpm type:check        # Filters OSS-side errors
pnpm type:check:all    # Shows all errors including OSS
```

### Project Structure

```
recce-ui/
├── src/                    # Wrapper/re-export source files
│   ├── components/         # Component exports
│   ├── api/                # API client exports
│   ├── hooks/              # Hook exports
│   └── types/              # Type exports
├── recce-source/           # Git submodule (Recce OSS)
│   └── js/src/             # Actual component source code
├── scripts/
│   ├── sync-submodule.sh   # Submodule sync script
│   └── sync-deps.js        # Dependency sync script
├── dist/                   # Built output
├── Makefile                # Build automation
└── package.json
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All exports include proper TypeScript types for enhanced development experience.

### Custom Theme Colors

The library extends MUI with custom theme colors. If you're using TypeScript and need to use these colors, import the type augmentations:

```tsx
// This is automatically included when importing from @datarecce/ui
// Custom colors available: brand, iochmara, cyan, amber, green, red, rose, fuchsia, neutral
// Custom sizes available: xsmall
```

## License

Apache-2.0

## Contributing

Contributions are welcome! Please check the main [Recce repository](https://github.com/DataRecce/recce) for contribution guidelines.

## Links

- [Recce Documentation](https://datarecce.io/docs)
- [GitHub Repository](https://github.com/DataRecce/recce-ui)
- [Main Recce Project](https://github.com/DataRecce/recce)
- [Issue Tracker](https://github.com/DataRecce/recce/issues)
