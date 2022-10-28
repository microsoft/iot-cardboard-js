import { useTheme } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export const useExtendedTheme = () => {
    return useTheme() as IExtendedTheme;
};
