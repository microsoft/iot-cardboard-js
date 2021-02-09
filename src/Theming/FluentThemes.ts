import { createTheme, IPartialTheme, ITheme } from '@fluentui/react';
import { Theme as FluentTheme } from '@fluentui/react-theme-provider';
import { fluentDarkThemePalette, fluentLightThemePalette } from './Palettes';
import { Theme } from '../Constants/Enums';
import { getCustomComponentStyles } from './ComponentStyles/CustomComponentStyles';
import {
    fluentDarkThemeSemanticColors,
    fluentLightThemeSemanticColors
} from './SemanticColors';

export const getFluentTheme = (theme: Theme): ITheme => {
    switch (theme) {
        case Theme.Dark:
            return fluentDarkTheme;
        case Theme.Light:
            return fluentLightTheme;
        default:
            return fluentLightTheme;
    }
};

/* 
    Creates fluent theme using palette and semantic colors, 
    then applies custom component style overrides.
*/
const createThemeWithCustomStyles = (
    themeInfo: IPartialTheme,
    themeSetting: Theme
): FluentTheme => {
    const theme = createTheme(themeInfo);
    theme.components = getCustomComponentStyles(themeSetting, theme);
    return theme;
};

/* 
    Each theme is made up of 
    palette: Fluent UI color palette
    semanticColors: Specific UI color slots.  These are created using 
    the palette colors, but can be overriden for more stylistic control.
*/
const fluentLightThemeInfo: IPartialTheme = {
    palette: fluentLightThemePalette,
    semanticColors: fluentLightThemeSemanticColors
};

const fluentDarkThemeInfo: IPartialTheme = {
    palette: fluentDarkThemePalette,
    semanticColors: fluentDarkThemeSemanticColors
};

const fluentLightTheme = createThemeWithCustomStyles(
    fluentLightThemeInfo,
    Theme.Light
);
const fluentDarkTheme = createThemeWithCustomStyles(
    fluentDarkThemeInfo,
    Theme.Dark
);
