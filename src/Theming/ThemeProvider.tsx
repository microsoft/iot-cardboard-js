import React, { useContext, useEffect, useMemo } from 'react';
import { Theme as LibThemes } from '../Constants/Enums';
import { ThemeProvider as FluentThemeProvider } from '@fluentui/react-theme-provider';
import { getFluentTheme } from './FluentThemes';

export const Theme = React.createContext(LibThemes.Light);
export const useLibTheme = () => useContext(Theme);

export const ThemeProvider = ({ children, theme }) => {
    useEffect(() => {
        document.documentElement.setAttribute('cardboard-data-theme', theme);
    }, [theme]);

    const fluentTheme = useMemo(() => getFluentTheme(theme), [theme]);

    return (
        <Theme.Provider value={theme}>
            <FluentThemeProvider theme={fluentTheme} applyTo={'none'}>
                {children}
            </FluentThemeProvider>
        </Theme.Provider>
    );
};
