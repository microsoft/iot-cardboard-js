import React, { CSSProperties, useContext, useMemo } from 'react';
import { Theme as LibThemes } from '../Models/Constants/Enums';
import { getFluentTheme } from './FluentThemes';
import {
    initializeIcons,
    ThemeProvider as FluentThemeProvider,
} from '@fluentui/react';

export const Theme = React.createContext(null);
export const useLibTheme = () => useContext(Theme);

// Required to load fluent UI icons
initializeIcons();

export const ThemeProvider = ({ children, theme = LibThemes.Light }) => {
    const fluentTheme = useMemo(() => getFluentTheme(theme), [theme]);
    const unsetStyles: CSSProperties = { all: 'unset', minHeight: 'inherit' };

    return (
        <Theme.Provider value={theme}>
            <FluentThemeProvider
                theme={fluentTheme}
                applyTo={'none'}
                style={unsetStyles}
            >
                <div style={unsetStyles} cardboard-data-theme={theme}>
                    {children}
                </div>
            </FluentThemeProvider>
        </Theme.Provider>
    );
};
