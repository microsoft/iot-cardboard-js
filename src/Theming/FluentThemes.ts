import { createTheme, ITheme, Theme as FluentTheme } from '@fluentui/react';
import {
    fluentDarkThemePalette,
    fluentExplorerThemePalette,
    fluentKrakenThemePalette,
    fluentLightThemePalette
} from './Palettes';
import { Theme } from '../Models/Constants/Enums';
import { getCustomComponentStyles } from './FluentComponentStyles';
import {
    fluentDarkThemeSemanticColors,
    fluentExplorerThemeSemanticColors,
    fluentKrakenThemeSemanticColors,
    fluentLightThemeSemanticColors
} from './SemanticColors';
import { IPartialExtendedTheme } from './Theme.types';

export const getFluentTheme = (theme: Theme): ITheme => {
    switch (theme) {
        case Theme.Dark:
            return fluentDarkTheme;
        case Theme.Light:
            return fluentLightTheme;
        case Theme.Explorer:
            return fluentExplorerTheme;
        case Theme.Kraken:
            return fluentKrakenTheme;
        default:
            return fluentLightTheme;
    }
};

/* 
    Creates fluent theme using palette and semantic colors, 
    then applies custom component style overrides.
*/
const createThemeWithCustomStyles = (
    themeInfo: IPartialExtendedTheme,
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
const fluentLightThemeInfo: IPartialExtendedTheme = {
    palette: fluentLightThemePalette,
    semanticColors: fluentLightThemeSemanticColors
};

const fluentDarkThemeInfo: IPartialExtendedTheme = {
    palette: fluentDarkThemePalette,
    semanticColors: fluentDarkThemeSemanticColors
};

const fluentExplorerThemeInfo: IPartialExtendedTheme = {
    palette: fluentExplorerThemePalette,
    semanticColors: fluentExplorerThemeSemanticColors
};

const fluentKrakenThemeInfo: IPartialExtendedTheme = {
    palette: fluentKrakenThemePalette,
    semanticColors: fluentKrakenThemeSemanticColors
};

const fluentLightTheme = createThemeWithCustomStyles(
    fluentLightThemeInfo,
    Theme.Light
);

const fluentDarkTheme = createThemeWithCustomStyles(
    fluentDarkThemeInfo,
    Theme.Dark
);

const fluentExplorerTheme = createThemeWithCustomStyles(
    fluentExplorerThemeInfo,
    Theme.Explorer
);

const fluentKrakenTheme = createThemeWithCustomStyles(
    fluentKrakenThemeInfo,
    Theme.Kraken
);
