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
export type { ThemeOptions } from "@mui/material/styles";
