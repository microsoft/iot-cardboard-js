import React from 'react';
import { Theme as LibThemes } from '../Constants/Enums';
export declare const Theme: React.Context<LibThemes>;
export declare const useLibTheme: () => LibThemes;
export declare const ThemeProvider: ({ children, theme }: {
    children: any;
    theme: any;
}) => JSX.Element;
