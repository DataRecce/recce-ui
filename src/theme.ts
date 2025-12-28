/**
 * @datarecce/ui - MUI Theme Exports
 *
 * Re-exports the MUI theme configuration from Recce OSS.
 * This allows host applications to use the same theme as Recce.
 */

export {
  muiTheme,
  lightTheme,
  darkTheme,
  colors,
  semanticColors,
  token,
} from "@/components/ui/mui-theme";

// Re-export types for consumers
export type { Theme, ThemeOptions } from "@mui/material/styles";

// Export inferred types for theme-related objects
export type Colors = typeof import("@/components/ui/mui-theme").colors;
export type SemanticColors = typeof import("@/components/ui/mui-theme").semanticColors;
export type TokenFn = typeof import("@/components/ui/mui-theme").token;
