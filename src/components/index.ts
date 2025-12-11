/**
 * Components Module
 *
 * This module re-exports React components from the Recce submodule.
 * Components are organized by feature area.
 */

// UI Foundation Components
export { Provider } from '@/components/ui/provider';
export { ColorModeProvider, useColorMode } from '@/components/ui/color-mode';
export { Toaster } from '@/components/ui/toaster';
export { Tooltip } from '@/components/ui/tooltip';

// Lineage Components
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

// Query Components
export { QueryForm } from '@/components/query/QueryForm';
export { QueryPage } from '@/components/query/QueryPage';
export { default as SqlEditor } from '@/components/query/SqlEditor';
export { DiffText } from '@/components/query/DiffText';
export { QueryResultView } from '@/components/query/QueryResultView';
export { QueryDiffResultView } from '@/components/query/QueryDiffResultView';

// Profile Components
export { ProfileDiffForm } from '@/components/profile/ProfileDiffForm';
export { ProfileDiffResultView } from '@/components/profile/ProfileDiffResultView';

// Charts Components
export { HistogramChart } from '@/components/charts/HistogramChart';
export { TopKSummaryList } from '@/components/charts/TopKSummaryList';
export { SquareIcon } from '@/components/charts/SquareIcon';

// Value Diff Components
export { ValueDiffForm } from '@/components/valuediff/ValueDiffForm';

// Histogram Components
export { HistogramDiffForm } from '@/components/histogram/HistogramDiffForm';
export { HistogramDiffResultView } from '@/components/histogram/HistogramDiffResultView';

// Top-K Components
export { TopKDiffForm } from '@/components/top-k/TopKDiffForm';
export { TopKDiffResultView } from '@/components/top-k/TopKDiffResultView';

// Row Count Components
export { RowCountDiffResultView } from '@/components/rowcount/RowCountDiffResultView';

// Schema Components
export { SchemaView } from '@/components/schema/SchemaView';
export { ColumnNameCell } from '@/components/schema/ColumnNameCell';

// Check Components
export { CheckList } from '@/components/check/CheckList';
export { CheckDetail } from '@/components/check/CheckDetail';
export { CheckBreadcrumb } from '@/components/check/CheckBreadcrumb';
export { CheckDescription } from '@/components/check/CheckDescription';
export { LineageDiffView } from '@/components/check/LineageDiffView';
export { SchemaDiffView } from '@/components/check/SchemaDiffView';

// Run Components
export { RunPage } from '@/components/run/RunPage';
export { RunList } from '@/components/run/RunList';
export { RunView } from '@/components/run/RunView';
export { RunModal } from '@/components/run/RunModal';
export { RunToolbar } from '@/components/run/RunToolbar';
export { RunStatusAndDate } from '@/components/run/RunStatusAndDate';

// Summary Components
export { default as SummaryView } from '@/components/summary/SummaryView';
export { ChangeSummary } from '@/components/summary/ChangeSummary';
export { SchemaSummary } from '@/components/summary/SchemaSummary';

// Data Grid Components
export { ScreenshotDataGrid } from '@/components/data-grid/ScreenshotDataGrid';

// Shared Components
export { default as HistoryToggle } from '@/components/shared/HistoryToggle';
export { HSplit, VSplit } from '@/components/split/Split';
export { ScreenshotBox } from '@/components/screenshot/ScreenshotBox';

// Icons
export * from '@/components/icons';