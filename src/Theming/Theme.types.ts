import { IPalette, IPartialTheme, Theme } from '@fluentui/react';

/** custom colors our app needs */
export interface CustomPalette {
    /** color code for the partially transparent color for modals and overlays */
    glassyBackground75: string;
    glassyBackground90: string;
    /** color for the border when using the glassy background */
    glassyBorder: string;
}
/** Partial version of the theme with only overrides populated */
export type IExtendedPartialPalette = Partial<IPalette> & CustomPalette;

/**
 * Processed theme with all the values populated
 */
export type IExtendedPalette = IPalette & CustomPalette;

export interface IPartialExtendedTheme extends IPartialTheme {
    palette: Partial<IExtendedPartialPalette>; // override with our own palette type
}
export interface IExtendedTheme extends Theme {
    palette: IExtendedPalette;
}
