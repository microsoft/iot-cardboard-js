import { IExtendedTheme } from '../../Theming/Theme.types';

export const OAT_HEADER_HEIGHT = 76;
export const PROPERTY_EDITOR_WIDTH = 340;

export const CONTROLS_SIDE_OFFSET = 16;
export const CONTROLS_BOTTOM_OFFSET = 30;
export const CONTROLS_MINIMAP_WIDTH = 200; // controlled internally by the library
export const CONTROLS_CALLOUT_OFFSET = 16;

export const CONTROLS_Z_INDEX = 6;
export const LOADING_Z_INDEX = CONTROLS_Z_INDEX + 1;

export const getControlBackgroundColor = (theme: IExtendedTheme): string =>
    theme.semanticColors.bodyBackgroundChecked;
