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
  "@chakra-ui/react": "^3.0.0",
  "@emotion/react": "^11.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@xyflow/react": "^12.0.0",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

## Usage

### Basic Setup

Wrap your application with the Recce UI Provider:

```tsx
import { Provider } from "@datarecce/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>{/* Your app components */}</Provider>
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
- `SqlEditor` - Monaco-based SQL editor
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

### Building from Source

This package uses a git submodule to reference the main Recce repository:

```bash
# Clone with submodules
git clone --recursive https://github.com/DataRecce/recce-ui.git

# Or if already cloned, initialize submodules
git submodule init
git submodule update

# Install dependencies
pnpm install

# The postinstall script will automatically apply TypeScript patches
# If you need to reapply patches manually:
npm run patch:apply

# Build the library
pnpm build

# Run in development mode
pnpm dev

# Type checking
pnpm type:check        # Run with known issues handled
pnpm type:check:strict # Run strict type checking
```

#### TypeScript Patches

This package includes automatic patches to fix TypeScript strict mode issues in the source code. These patches are applied automatically during `npm install` and fix:

1. Type assertion issues in CheckDetail.tsx
2. Boolean type issues in CheckList.tsx
3. Type conversion issues in LineageViewContextMenu.tsx
4. Type inference issues in toaster.tsx

The patches are temporary fixes until the main Recce repository is updated.

### Updating the Submodule

To update the Recce source code:

```bash
pnpm run submodule:update
```

### Running Storybook

View component documentation and examples:

```bash
pnpm storybook
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All exports include proper TypeScript types for enhanced development experience.

## License

Apache-2.0

## Contributing

Contributions are welcome! Please check the main [Recce repository](https://github.com/DataRecce/recce) for contribution guidelines.

## Links

- [Recce Documentation](https://datarecce.io/docs)
- [GitHub Repository](https://github.com/DataRecce/recce-ui)
- [Main Recce Project](https://github.com/DataRecce/recce)
- [Issue Tracker](https://github.com/DataRecce/recce/issues)
