import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IBoundaryInputStyleProps,
    IBoundaryInputStyles
} from './BoundaryInput.types';

export const classPrefix = 'cb-boundaryinput';
const classNames = {
    root: `${classPrefix}-root`,
    container: `${classPrefix}-container`,
    label: `${classPrefix}-label`,
    inputContainer: `${classPrefix}-inputContainer`,
    input: `${classPrefix}-input`,
    negativeInfinityButton: `${classPrefix}-negativeInfinityButton`,
    infinityButton: `${classPrefix}-infinityButton`
};
export const getStyles = (
    props: IBoundaryInputStyleProps
): IBoundaryInputStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        container: [
            classNames.container,
            {
                display: 'flex',
                flexDirection: 'column'
            }
        ],
        label: [
            classNames.label,
            {
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold
            }
        ],
        inputContainer: [
            classNames.inputContainer,
            {
                position: 'relative'
            }
        ],
        input: [
            classNames.input,
            {
                backgroundColor: theme.semanticColors.inputBackground,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: 2,
                color: theme.semanticColors.inputText,
                fontSize: FontSizes.size14,
                height: 32,
                padding: '0 8px 0 8px',
                userSelect: 'text',
                width: 100
            }
        ],
        negativeInfinityButton: [
            classNames.negativeInfinityButton,
            {
                alignItems: 'center',
                backgroundColor: 'unset',
                border: 'unset',
                bottom: 0,
                cursor: 'pointer',
                display: 'flex',
                fontsize: 14,
                height: 32,
                justifyContent: 'center',
                padding: 'unset',
                position: 'absolute',
                right: 0,
                top: 0,
                width: 32,
                path: {
                    fill: theme.semanticColors.accentButtonBackground
                },
                marginRight: 4,
                '::before': {
                    color: theme.semanticColors.accentButtonBackground,
                    content: '-',
                    cursor: 'pointer',
                    marginBottom: 4,
                    marginRight: 4
                }
            }
        ],
        infinityButton: [
            classNames.infinityButton,
            {
                alignItems: 'center',
                backgroundColor: 'unset',
                border: 'unset',
                bottom: 0,
                cursor: 'pointer',
                display: 'flex',
                fontsize: 14,
                height: 32,
                justifyContent: 'center',
                padding: 'unset',
                position: 'absolute',
                right: 0,
                top: 0,
                width: 32,
                path: {
                    fill: theme.semanticColors.accentButtonBackground
                }
            }
        ],
        subComponentStyles: {}
    };
};
