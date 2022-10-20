import {
    FontSizes,
    FontWeights,
    IStyle,
    ITheme,
    mergeStyleSets
} from '@fluentui/react';
import {
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
} from './ConditionsCallout.types';

export const classPrefix = 'cb-conditionscallout';
const classNames = {
    root: `${classPrefix}-root`,
    footer: `${classPrefix}-footer`,
    title: `${classPrefix}-title`
};
export const getStyles = (
    _props: IConditionsCalloutStyleProps
): IConditionsCalloutStyles => {
    return {
        root: [classNames.root],
        footer: [
            classNames.footer,
            {
                paddingTop: 32
            }
        ],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size16,
                margin: 0
            }
        ],
        subComponentStyles: {
            callout: {
                root: {
                    width: 300,
                    padding: 20
                }
            }
        }
    };
};

export const getSummaryStyles = (theme: ITheme) =>
    mergeStyleSets({
        title: {
            margin: 0
        },
        invalidText: {
            color: theme.semanticColors.errorText,
            fontSize: FontSizes.size12
        }
    });

export const getBoundaryInputStyles = (theme: ITheme) => {
    return mergeStyleSets({
        container: {
            display: 'flex',
            flexDirection: 'column'
        } as IStyle,
        label: {
            fontSize: FontSizes.size14,
            fontWeight: FontWeights.semibold
        } as IStyle,
        inputContainer: {
            position: 'relative'
        } as IStyle,
        input: {
            backgroundColor: theme.semanticColors.inputBackground,
            border: `1px solid ${theme.semanticColors.inputBorder}`,
            borderRadius: 2,
            color: theme.semanticColors.inputText,
            fontSize: FontSizes.size14,
            height: 32,
            padding: '0 8px 0 8px',
            userSelect: 'text',
            width: 100
        } as IStyle,
        negativeInfinityButton: {
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
            } as IStyle
        } as IStyle,
        infinityButton: {
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
        } as IStyle
    });
};
