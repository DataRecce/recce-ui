/**
 * Hooks Module
 *
 * This module exports custom React hooks from the Recce library.
 */

// Custom Hooks
export { useRecceInstanceInfo } from '@/lib/hooks/useRecceInstanceInfo';
export { useCheckToast } from '@/lib/hooks/useCheckToast';
export { useClipBoardToast } from '@/lib/hooks/useClipBoardToast';

// Re-export component-specific hooks
export { useLineageViewContext } from '@/components/lineage/LineageViewContext';
export { default as useValueDiffAlertDialog } from '@/components/lineage/useValueDiffAlertDialog';

// Context Providers
export { default as RecceContextProvider } from '@/lib/hooks/RecceContextProvider';
export { RecceInstanceInfoProvider, useRecceInstanceContext } from '@/lib/hooks/RecceInstanceContext';
export { LineageGraphContextProvider, useLineageGraphContext, useRunsAggregated } from '@/lib/hooks/LineageGraphContext';
export { RecceShareStateContextProvider, useRecceShareStateContext } from '@/lib/hooks/RecceShareStateContext';
export { RecceQueryContextProvider, RowCountStateContextProvider, useRecceQueryContext, useRowCountStateContext } from '@/lib/hooks/RecceQueryContext';
export {
  RecceActionContext,
  RecceActionContextProvider,
  useRecceActionContext,
  type RecceActionContextType,
} from '@/lib/hooks/RecceActionContext';
export { RecceCheckContextProvider, useRecceCheckContext } from '@/lib/hooks/RecceCheckContext';
export { IdleTimeoutProvider, useIdleTimeout } from '@/lib/hooks/IdleTimeoutContext';

// API Configuration
export {
  ApiConfigProvider,
  useApiConfig,
  useApiClient,
  useApiConfigSafe,
  type ApiConfig
} from '@/lib/hooks/ApiConfigContext';

// Route Configuration (for recce-cloud path prefixing)
export {
  RouteConfigProvider,
  useRouteConfig,
  useRouteConfigSafe,
  type RouteConfig,
  type RouteConfigContextType,
} from '../lib/hooks/RouteConfigContext';

// App Router hooks (custom version with RouteConfigContext support)
export {
  useAppLocation,
  useAppLocationWithSearch,
  useAppRoute,
  useAppNavigation,
  navigateTo,
} from '../lib/hooks/useAppRouter';
