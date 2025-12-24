/**
 * Components Module
 *
 * This module re-exports React components from the Recce submodule.
 * Components are organized by feature area for easy discovery.
 */

// =============================================================================
// Core / Foundation
// =============================================================================
export { MuiProvider, default as MuiProviderDefault } from '@/components/ui/mui-provider';
export { Toaster, ToasterProvider, useToaster } from '@/components/ui/toaster';
export { ErrorBoundary } from '@/components/errorboundary/ErrorBoundary';

// =============================================================================
// Layout
// =============================================================================
export { HSplit, VSplit } from '@/components/split/Split';
export { ScreenshotBox } from '@/components/screenshot/ScreenshotBox';

// =============================================================================
// Lineage
// =============================================================================
export { LineagePage } from '@/components/lineage/LineagePage';
export { LineageView } from '@/components/lineage/LineageView';
export { LineageViewContext, useLineageViewContext } from '@/components/lineage/LineageViewContext';
export { LineageViewTopBar } from '@/components/lineage/LineageViewTopBar';
export { GraphNode } from '@/components/lineage/GraphNode';
export { default as GraphEdge } from '@/components/lineage/GraphEdge';
export { GraphColumnNode } from '@/components/lineage/GraphColumnNode';
export { NodeView } from '@/components/lineage/NodeView';
export { NodeSqlView } from '@/components/lineage/NodeSqlView';
export {
  ResourceTypeTag,
  ModelRowCount,
  RowCountDiffTag,
  type RowCountDiffTagProps,
  type RowCountTagProps
} from '@/components/lineage/NodeTag';
export { default as SetupConnectionBanner } from '@/components/lineage/SetupConnectionBanner';

// =============================================================================
// Query
// =============================================================================
export { QueryPage } from '@/components/query/QueryPage';
export { QueryForm } from '@/components/query/QueryForm';
export { default as SqlEditor } from '@/components/query/SqlEditor';
export { QueryResultView } from '@/components/query/QueryResultView';
export { QueryDiffResultView } from '@/components/query/QueryDiffResultView';
export { DiffText } from '@/components/query/DiffText';
export { default as SetupConnectionGuide } from '@/components/query/SetupConnectionGuide';

// =============================================================================
// Editor
// =============================================================================
export { default as CodeEditor } from '@/components/editor/CodeEditor';
export { default as DiffEditor } from '@/components/editor/DiffEditor';

// =============================================================================
// Schema
// =============================================================================
export { SchemaView } from '@/components/schema/SchemaView';
export { ColumnNameCell } from '@/components/schema/ColumnNameCell';

// =============================================================================
// Check / Checklist
// =============================================================================
export { CheckList } from '@/components/check/CheckList';
export { CheckDetail } from '@/components/check/CheckDetail';
export { CheckBreadcrumb } from '@/components/check/CheckBreadcrumb';
export { CheckDescription } from '@/components/check/CheckDescription';
export { CheckEmptyState } from '@/components/check/CheckEmptyState';
export { LineageDiffView } from '@/components/check/LineageDiffView';
export { SchemaDiffView } from '@/components/check/SchemaDiffView';

// =============================================================================
// Run
// =============================================================================
export { RunPage } from '@/components/run/RunPage';
export { RunList } from '@/components/run/RunList';
export { RunView } from '@/components/run/RunView';
export { RunModal } from '@/components/run/RunModal';
export { RunToolbar } from '@/components/run/RunToolbar';
export { RunResultPane } from '@/components/run/RunResultPane';
export { RunStatusAndDate } from '@/components/run/RunStatusAndDate';

// =============================================================================
// Data Diff Components
// =============================================================================

// Profile Diff
export { ProfileDiffForm } from '@/components/profile/ProfileDiffForm';
export { ProfileDiffResultView } from '@/components/profile/ProfileDiffResultView';

// Value Diff
export { ValueDiffForm } from '@/components/valuediff/ValueDiffForm';
export { ValueDiffResultView } from '@/components/valuediff/ValueDiffResultView';
export { ValueDiffDetailResultView } from '@/components/valuediff/ValueDiffDetailResultView';

// Histogram Diff
export { HistogramDiffForm } from '@/components/histogram/HistogramDiffForm';
export { HistogramDiffResultView } from '@/components/histogram/HistogramDiffResultView';

// Top-K Diff
export { TopKDiffForm } from '@/components/top-k/TopKDiffForm';
export { TopKDiffResultView } from '@/components/top-k/TopKDiffResultView';

// Row Count Diff
export { RowCountDiffResultView } from '@/components/rowcount/RowCountDiffResultView';

// =============================================================================
// Data Grid
// =============================================================================
export { ScreenshotDataGrid } from '@/components/data-grid/ScreenshotDataGrid';

// =============================================================================
// Charts
// =============================================================================
export { HistogramChart } from '@/components/charts/HistogramChart';
export { TopKSummaryList } from '@/components/charts/TopKSummaryList';
export { SquareIcon } from '@/components/charts/SquareIcon';

// =============================================================================
// Summary
// =============================================================================
export { default as SummaryView } from '@/components/summary/SummaryView';
export { ChangeSummary } from '@/components/summary/ChangeSummary';
export { SchemaSummary } from '@/components/summary/SchemaSummary';

// =============================================================================
// App Components
// =============================================================================
export { EnvInfo } from '@/components/app/EnvInfo';

// =============================================================================
// Shared / Utilities
// =============================================================================
export { default as HistoryToggle } from '@/components/shared/HistoryToggle';
export { IdleTimeoutBadge } from '@/components/timeout/IdleTimeoutBadge';

// =============================================================================
// Icons
// =============================================================================
export * from '@/components/icons';
