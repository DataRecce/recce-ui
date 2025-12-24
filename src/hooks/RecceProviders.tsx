/**
 * RecceProviders - Combined provider for Recce UI components
 *
 * This component bundles all necessary providers (QueryClientProvider, MuiProvider,
 * RecceContextProvider) to ensure proper context sharing when used as a library.
 *
 * Use this provider when integrating @datarecce/ui in external applications
 * to avoid React Query context isolation issues.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import RecceContextProvider from "@/lib/hooks/RecceContextProvider";
import { MuiProvider } from "@/components/ui/mui-provider";

interface RecceProvidersProps {
  children: React.ReactNode;
  /**
   * Optional QueryClient instance. If not provided, a new one will be created.
   * Pass your existing QueryClient if you need to share it with other parts of your app.
   */
  queryClient?: QueryClient;
}

/**
 * Combined provider that bundles QueryClientProvider, MuiProvider, and RecceContextProvider.
 *
 * Usage:
 * ```tsx
 * import { RecceProviders } from "@datarecce/ui";
 *
 * function App() {
 *   return (
 *     <RecceProviders>
 *       <YourComponents />
 *     </RecceProviders>
 *   );
 * }
 * ```
 *
 * Or with an existing QueryClient:
 * ```tsx
 * const queryClient = new QueryClient();
 *
 * function App() {
 *   return (
 *     <RecceProviders queryClient={queryClient}>
 *       <YourComponents />
 *     </RecceProviders>
 *   );
 * }
 * ```
 */
export function RecceProviders({ children, queryClient }: RecceProvidersProps) {
  const [internalClient] = useState(() => queryClient || new QueryClient());

  return (
    <QueryClientProvider client={internalClient}>
      <MuiProvider>
        <RecceContextProvider>{children}</RecceContextProvider>
      </MuiProvider>
    </QueryClientProvider>
  );
}

export default RecceProviders;
