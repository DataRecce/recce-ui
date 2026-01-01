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
