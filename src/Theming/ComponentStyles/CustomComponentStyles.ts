import { ITheme } from '@fluentui/react';
import { Theme } from '../../Constants/Enums';
import { getPrimaryButtonStyles } from './PrimaryButton.styles';

export const getCustomComponentStyles = (
    themeSetting: Theme,
    theme: ITheme
) => ({
    PrimaryButton: {
        styles: getPrimaryButtonStyles(themeSetting, theme)
    }
});
