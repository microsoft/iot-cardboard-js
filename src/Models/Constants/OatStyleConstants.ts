import { IStyle } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export const OAT_HEADER_HEIGHT = 76;
export const PROPERTY_EDITOR_WIDTH = 400;

export const CONTROLS_SIDE_OFFSET = 16;
export const CONTROLS_BOTTOM_OFFSET = 30;
export const CONTROLS_MINIMAP_WIDTH = 200; // controlled internally by the library
export const CONTROLS_CALLOUT_OFFSET = 16;

export const CONTROLS_Z_INDEX = 6;
export const LOADING_Z_INDEX = CONTROLS_Z_INDEX + 1;

export const PANEL_VERTICAL_SPACING =
    CONTROLS_BOTTOM_OFFSET +
    CONTROLS_CALLOUT_OFFSET +
    44 +
    OAT_HEADER_HEIGHT +
    48; // 44=control button height+pad, 48=flights shell header

export const getControlBackgroundColor = (theme: IExtendedTheme): string =>
    theme.semanticColors.bodyBackgroundChecked;

export const ELLIPSE_START: IStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    direction: 'RTL',
    textAlign: 'left'
};
