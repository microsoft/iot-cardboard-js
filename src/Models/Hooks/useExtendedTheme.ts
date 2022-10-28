import { useTheme } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

/**
 * Gives back the current theme object for the app
 * @returns the current theme object with the right colors for the selected theme
 */
export const useExtendedTheme = () => {
    return useTheme() as IExtendedTheme;
};
