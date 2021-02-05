import React, { useContext, useEffect, useState } from 'react';
import { Themes } from '../Constants/Enums';
import { ThemeProvider as FluentThemeProvider } from '@fluentui/react-theme-provider';
import { fluentDarkTheme, fluentLightTheme } from '../Constants/FluentThemes';

export const Theme = React.createContext(Themes.Light);
export const useTheme = () => useContext(Theme);

export const ThemeProvider = ({ children, theme }) => {
    const activeTheme = theme ? theme : Themes.Light;
    const themeCtx = useProvideTheme(activeTheme);
    return (
        <Theme.Provider value={themeCtx}>
            <FluentThemeProvider
                theme={
                    activeTheme === Themes.Light
                        ? fluentLightTheme
                        : fluentDarkTheme
                }
                applyTo={'none'}
            >
                {children}
            </FluentThemeProvider>
        </Theme.Provider>
    );
};

const useProvideTheme = (activeTheme) => {
    const [theme, setTheme] = useState(activeTheme);

    useEffect(() => {
        setTheme(activeTheme);
        document.documentElement.setAttribute(
            'cardboard-data-theme',
            activeTheme
        );
    }, [activeTheme]);

    return theme;
};
