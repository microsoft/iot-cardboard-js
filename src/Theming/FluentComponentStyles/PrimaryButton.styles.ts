import { IButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';
import { getPrimaryButtonCustomOverrides } from '../Palettes';

// Overrides PrimaryButton styles
export const getPrimaryButtonStyles = (
    themeSetting: Theme,
    theme: ITheme
): Partial<IButtonStyles> => {
    const customOverrides = getPrimaryButtonCustomOverrides(
        themeSetting,
        theme
    );

    return {
        root: {
            boxShadow: customOverrides.boxShadow,
            color: customOverrides.primaryButtonTextColor
        },
        rootHovered: {
            color: customOverrides.primaryButtonTextColor
        },
        rootPressed: {
            color: customOverrides.primaryButtonTextColor
        },
        rootDisabled: {
            color: customOverrides.primaryButtonTextColorDisabled
        }
    };
};
