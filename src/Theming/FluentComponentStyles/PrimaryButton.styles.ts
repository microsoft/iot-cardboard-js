import { IButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

// Overrides PrimaryButton styles
export const getPrimaryButtonStyles = (
    themeSetting: Theme,
    _theme: ITheme
): Partial<IButtonStyles> => {
    // Adds box shadow on light theme
    const boxShadow =
        themeSetting === Theme.Light
            ? `0 1px 3px 0 rgba(0, 0, 0, .12)`
            : '0 1px 3px 0 rgba(255,255,255,.12)';

    return {
        root: {
            boxShadow
        }
    };
};
