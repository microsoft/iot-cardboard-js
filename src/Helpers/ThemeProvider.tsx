import React, { useContext, useEffect } from 'react';
import { Themes } from '../Constants/Enums';
import { ThemeProvider as FluentThemeProvider } from '@fluentui/react-theme-provider';
import { fluentDarkTheme, fluentLightTheme } from '../Constants/FluentThemes';

export const Theme = React.createContext(Themes.Light);
export const useTheme = () => useContext(Theme);

export const ThemeProvider = ({ children, theme }) => {
    useEffect(() => {
        document.documentElement.setAttribute('cardboard-data-theme', theme);
    }, [theme]);

    return (
        <Theme.Provider value={theme}>
            <FluentThemeProvider
                theme={
                    theme === Themes.Light ? fluentLightTheme : fluentDarkTheme
                }
                applyTo={'none'}
            >
                {children}
            </FluentThemeProvider>
        </Theme.Provider>
    );
};
