import React, { CSSProperties, useContext, useMemo } from 'react';
import { Theme as LibThemes } from '../Models/Constants/Enums';
import { ThemeProvider as FluentThemeProvider } from '@fluentui/react-theme-provider';
import { getFluentTheme } from './FluentThemes';
import { initializeIcons } from '@fluentui/react';

export const Theme = React.createContext(LibThemes.Light);
export const useLibTheme = () => useContext(Theme);

// Required to load fluent UI icons
initializeIcons();

export const ThemeProvider = ({ children, theme = LibThemes.Light }) => {
    const fluentTheme = useMemo(() => getFluentTheme(theme), [theme]);
    const unsetStyles: CSSProperties = { all: 'unset' };

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
