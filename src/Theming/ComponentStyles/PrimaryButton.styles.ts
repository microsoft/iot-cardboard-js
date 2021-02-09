import { IButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Constants/Enums';

// Overrides PrimaryButton styles
export const getPrimaryButtonStyles = (
    themeSetting: Theme,
    theme: ITheme
): Partial<IButtonStyles> => {
    return {
        root: {
            boxShadow: `2px 2px 5px ${theme.semanticColors.buttonBorder}`
        }
    };
};
