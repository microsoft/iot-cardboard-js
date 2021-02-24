import React, { useContext, useEffect, useMemo } from 'react';
import { Theme as LibThemes } from '../Models/Constants/Enums';
import { ThemeProvider as FluentThemeProvider } from '@fluentui/react-theme-provider';
import { getFluentTheme } from './FluentThemes';
import { initializeIcons } from '@fluentui/react';

export const Theme = React.createContext(LibThemes.Light);
export const useLibTheme = () => useContext(Theme);

// Required to load fluent UI icons
initializeIcons();

export const ThemeProvider = ({ children, theme }) => {
    if (!theme) theme = LibThemes.Light;

    useEffect(() => {
        document.documentElement.setAttribute('cardboard-data-theme', theme);
    }, [theme]);

    const fluentTheme = useMemo(() => getFluentTheme(theme), [theme]);

    return (
        <Theme.Provider value={theme}>
            <FluentThemeProvider
                theme={fluentTheme}
                applyTo={'none'}
                style={{ all: 'unset' }}
            >
                {children}
            </FluentThemeProvider>
        </Theme.Provider>
    );
};
