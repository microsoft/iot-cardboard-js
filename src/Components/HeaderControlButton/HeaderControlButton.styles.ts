import { FontSizes } from '@fluentui/react';
import {
    IHeaderControlButtonStyleProps,
    IHeaderControlButtonStyles
} from './HeaderControlButton.types';

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
        button: [
            classNames.button,
            {
                border: '1px solid var(--cb-color-input-border)',
                borderRadius: '50%',
                cursor: 'pointer',
                height: 28,
                width: 28
            }
        ],
        subComponentStyles: {
            button: {
                root: {
                    color: `${theme.semanticColors.bodyText} !important`,
                    border: `1px solid ${theme.palette.neutralLight}`,
                    backgroundColor: isActive
                        ? theme.semanticColors.buttonBackgroundPressed
                        : theme.semanticColors.buttonBackground,
                    height: 42,
                    width: 42
                },
                icon: {
                    fontSize: FontSizes.size16
                }
            }
        }
    };
};
