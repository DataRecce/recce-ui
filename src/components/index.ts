/**
 * Components Module
 *
 * This module re-exports React components from the Recce submodule.
 * Components are organized by feature area.
 */

// UI Foundation Components
export { default as Provider } from '@/components/ui/provider';
export { ColorModeProvider, useColorMode } from '@/components/ui/color-mode';
export { Toaster } from '@/components/ui/toaster';
export { Tooltip } from '@/components/ui/tooltip';

// Lineage Components
export { default as LineagePage } from '@/components/lineage/LineagePage';
export { default as LineageView } from '@/components/lineage/LineageView';
export { LineageViewContext, useLineageViewContext } from '@/components/lineage/LineageViewContext';
export { default as LineageViewTopBar } from '@/components/lineage/LineageViewTopBar';
export { default as GraphNode } from '@/components/lineage/GraphNode';
export { default as GraphEdge } from '@/components/lineage/GraphEdge';
export { default as GraphColumnNode } from '@/components/lineage/GraphColumnNode';
export { default as NodeView } from '@/components/lineage/NodeView';
export { default as NodeSqlView } from '@/components/lineage/NodeSqlView';
export { default as NodeTag } from '@/components/lineage/NodeTag';

// Query Components
export { default as QueryForm } from '@/components/query/QueryForm';
export { default as QueryPage } from '@/components/query/QueryPage';
export { default as SqlEditor } from '@/components/query/SqlEditor';
export { default as DiffText } from '@/components/query/DiffText';
export { default as QueryResultView } from '@/components/query/QueryResultView';
export { default as QueryDiffResultView } from '@/components/query/QueryDiffResultView';

// Profile Components
export { default as ProfileDiffForm } from '@/components/profile/ProfileDiffForm';
export { default as ProfileDiffResultView } from '@/components/profile/ProfileDiffResultView';

// Charts Components
export { default as HistogramChart } from '@/components/charts/HistogramChart';
export { default as TopKSummaryList } from '@/components/charts/TopKSummaryList';
export { default as SquareIcon } from '@/components/charts/SquareIcon';

// Value Diff Components
export { default as ValueDiffForm } from '@/components/valuediff/ValueDiffForm';

// Histogram Components
export { default as HistogramDiffForm } from '@/components/histogram/HistogramDiffForm';
export { default as HistogramDiffResultView } from '@/components/histogram/HistogramDiffResultView';

// Top-K Components
export { default as TopKDiffForm } from '@/components/top-k/TopKDiffForm';
export { default as TopKDiffResultView } from '@/components/top-k/TopKDiffResultView';

// Row Count Components
export { default as RowCountDiffResultView } from '@/components/rowcount/RowCountDiffResultView';

// Schema Components
export { default as SchemaView } from '@/components/schema/SchemaView';
export { default as ColumnNameCell } from '@/components/schema/ColumnNameCell';

// Check Components
export { default as CheckList } from '@/components/check/CheckList';
export { default as CheckDetail } from '@/components/check/CheckDetail';
export { default as CheckBreadcrumb } from '@/components/check/CheckBreadcrumb';
export { default as CheckDescription } from '@/components/check/CheckDescription';
export { default as LineageDiffView } from '@/components/check/LineageDiffView';
export { default as SchemaDiffView } from '@/components/check/SchemaDiffView';

// Run Components
export { default as RunPage } from '@/components/run/RunPage';
export { default as RunList } from '@/components/run/RunList';
export { default as RunView } from '@/components/run/RunView';
export { default as RunModal } from '@/components/run/RunModal';
export { default as RunToolbar } from '@/components/run/RunToolbar';
export { default as RunStatusAndDate } from '@/components/run/RunStatusAndDate';

// Summary Components
export { default as SummaryView } from '@/components/summary/SummaryView';
export { default as ChangeSummary } from '@/components/summary/ChangeSummary';
export { default as SchemaSummary } from '@/components/summary/SchemaSummary';

// Data Grid Components
export { default as ScreenshotDataGrid } from '@/components/data-grid/ScreenshotDataGrid';

// Shared Components
export { default as HistoryToggle } from '@/components/shared/HistoryToggle';
export { default as Split } from '@/components/split/Split';
export { default as ScreenshotBox } from '@/components/screenshot/ScreenshotBox';

// Icons
export * from '@/components/icons';