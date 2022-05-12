import { FontSizes, IButtonStyles, ITheme } from '@fluentui/react';
import {
    IHeaderControlButtonStyleProps,
    IHeaderControlButtonStyles
} from './HeaderControlButton.types';

export function GET_HEADER_BUTTON_STYLES(
    theme: ITheme,
    isActive: boolean
): IButtonStyles {
    return {
        root: {
            color: `${theme.semanticColors.bodyText} !important`,
            backgroundColor: isActive
                ? theme.semanticColors.buttonBackgroundPressed
                : theme.semanticColors.buttonBackground,
            borderRadius: 2,
            height: 42,
            width: 42,
            ':hover': {
                border: `1px solid ${theme.palette.neutralSecondary}`
            }
        }
    };
}

const classPrefix = 'color-select-button';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`
};
export const getStyles = (
    props: IHeaderControlButtonStyleProps
): IHeaderControlButtonStyles => {
    const { isActive, theme } = props;
    return {
        root: [classNames.root],
        subComponentStyles: {
            button: {
                ...GET_HEADER_BUTTON_STYLES(theme, isActive),
                icon: {
                    fontSize: FontSizes.size16
                }
            }
        }
    };
};
