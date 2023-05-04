import { createTheme, ITheme, Theme as FluentTheme } from '@fluentui/react';
import {
    PartialTheme as Fluent9Theme,
    webLightTheme
} from '@fluentui/react-components';
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
import { IExtendedPartialTheme } from './Theme.types';
import { Fluent9KrakenTheme } from './Fluent9KrakenTheme';
import { Fluent9ExplorerTheme } from './Fluent9ExplorerTheme';
import { Fluent9DarkTheme } from './Fluent9DarkTheme';

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

export const getVNextTheme = (theme: Theme): Fluent9Theme => {
    switch (theme) {
        case Theme.Dark:
            return Fluent9DarkTheme;
        case Theme.Light:
            return webLightTheme;
        case Theme.Explorer:
            return Fluent9ExplorerTheme;
        case Theme.Kraken:
            return Fluent9KrakenTheme;
        default:
            return webLightTheme;
    }
};

/* 
    Creates fluent theme using palette and semantic colors, 
    then applies custom component style overrides.
*/
const createThemeWithCustomStyles = (
    themeInfo: IExtendedPartialTheme,
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
const fluentLightThemeInfo: IExtendedPartialTheme = {
    palette: fluentLightThemePalette,
    semanticColors: fluentLightThemeSemanticColors
};

const fluentDarkThemeInfo: IExtendedPartialTheme = {
    palette: fluentDarkThemePalette,
    semanticColors: fluentDarkThemeSemanticColors
};

const fluentExplorerThemeInfo: IExtendedPartialTheme = {
    palette: fluentExplorerThemePalette,
    semanticColors: fluentExplorerThemeSemanticColors
};

const fluentKrakenThemeInfo: IExtendedPartialTheme = {
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
