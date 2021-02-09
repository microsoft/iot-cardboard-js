import { IButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Constants/Enums';

// Overrides PrimaryButton styles
export const getPrimaryButtonStyles = (
    themeSetting: Theme,
    theme: ITheme
): Partial<IButtonStyles> => {
    // Adds box shadow on light theme
    const boxShadow =
        themeSetting === Theme.Light
            ? `2px 2px 5px ${theme.semanticColors.buttonBorder}`
            : 'unset';

    return {
        root: {
            boxShadow
        }
    };
};
