/**
 * MUI Theme Augmentation for Recce Custom Colors
 *
 * This file extends MUI component props to accept custom palette colors
 * defined in the Recce theme (mui-theme.ts).
 *
 * The `export {}` makes this a module, which is required for proper
 * module augmentation (extending rather than overriding).
 */

import '@mui/material/Button';
import '@mui/material/ButtonGroup';
import '@mui/material/Chip';
import '@mui/material/CircularProgress';
import '@mui/material/LinearProgress';
import '@mui/material/IconButton';
import '@mui/material/SvgIcon';
import '@mui/material/TextField';
import '@mui/material/InputBase';
import '@mui/material/FormControl';
import '@mui/material/Radio';
import '@mui/material/Checkbox';
import '@mui/material/Switch';
import '@mui/material/Badge';
import '@mui/material/Alert';
import '@mui/material/Tabs';
import '@mui/material/Tab';
import '@mui/material/ToggleButton';

// Custom color types used in Recce theme
type RecceCustomColors = {
  brand: true;
  iochmara: true;
  cyan: true;
  amber: true;
  green: true;
  red: true;
  rose: true;
  fuchsia: true;
  neutral: true;
};

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/FormControl' {
  interface FormControlPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Radio' {
  interface RadioPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Switch' {
  interface SwitchPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Tabs' {
  interface TabsPropsIndicatorColorOverrides extends RecceCustomColors {}
}

declare module '@mui/material/Tab' {
  interface TabPropsColorOverrides {
    brand: true;
    iochmara: true;
  }
}

declare module '@mui/material/ToggleButton' {
  interface ToggleButtonPropsColorOverrides extends RecceCustomColors {}
}

// Custom size augmentations
declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    xsmall: true;
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsSizeOverrides {
    xsmall: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsSizeOverrides {
    xsmall: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsSizeOverrides {
    xsmall: true;
  }
}

export {};
