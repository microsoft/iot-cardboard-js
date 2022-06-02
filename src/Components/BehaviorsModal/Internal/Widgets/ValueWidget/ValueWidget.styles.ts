import {
    FontSizes,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { behaviorsModalClassPrefix } from '../../../BehaviorsModal.styles';

const classNames = {
    container: `${behaviorsModalClassPrefix}-property-widget-container`,
    displayName: `${behaviorsModalClassPrefix}-property-widget-display-name`,
    expressionValueContainer: `${behaviorsModalClassPrefix}-property-widget-expression-value-container`,
    expressionValueOverflowed: `${behaviorsModalClassPrefix}-property-widget-expression-value-overflowed`,
    expressionValuePrimary: `${behaviorsModalClassPrefix}-property-widget-expression-value-primary`,
    expressionValueSecondary: `${behaviorsModalClassPrefix}-property-widget-expression-value-secondary`,
    expressionValueListItem: `${behaviorsModalClassPrefix}-property-widget-expression-value-list-item`,
    expressionValueInvalidPlaceholder: `${behaviorsModalClassPrefix}-property-widget-expression-value-invalid-placeholder`,
    invalidExpressionValue: `${behaviorsModalClassPrefix}-property-widget-expression-value-invalid`
};

const ellipseStyles = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
};

const overflowStyles = {
    overflowX: 'hidden',
    overflowY: 'auto'
};

export const getStyles = memoizeFunction((theme: Theme) =>
    mergeStyleSets({
        container: [
            classNames.container,
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 16
            } as IStyle
        ],
        displayName: [
            classNames.displayName,
            {
                width: '100%',
                ...ellipseStyles,
                textAlign: 'center',
                fontSize: FontSizes.size12,
                maxHeight: 20,
                lineHeight: 20,
                flexShrink: 0,
                marginTop: 8
            } as IStyle
        ],
        expressionValueContainer: [
            classNames.expressionValueContainer,
            {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                ...overflowStyles
            } as IStyle
        ],
        expressionValueInvalidPlaceholder: [
            classNames.expressionValueInvalidPlaceholder,
            {
                width: '100%',
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size32,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                ...overflowStyles
            } as IStyle
        ],
        expressionValuePrimary: [
            classNames.expressionValuePrimary,
            {
                width: '100%',
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size20,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                ...overflowStyles
            } as IStyle
        ],
        expressionValueSecondary: [
            classNames.expressionValueSecondary,
            {
                width: '100%',
                ...ellipseStyles,
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: 11,
                paddingTop: 8
            } as IStyle
        ],
        expressionValueListItem: [
            classNames.expressionValueListItem,
            {
                width: '100%',
                ...ellipseStyles,
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size10,
                lineHeight: 10,
                paddingBottom: 4
            } as IStyle
        ],
        expressionValueOverflowed: [
            classNames.expressionValueOverflowed,
            {
                width: '100%',
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size16,
                display: '-webkit-box',
                '-webkit-line-clamp': '3 !important',
                '-webkit-box-orient': 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                '&:hover': {
                    '-webkit-line-clamp': 'unset !important',
                    ...overflowStyles
                }
            } as IStyle
        ],
        invalidExpressionValue: [
            classNames.invalidExpressionValue,
            {
                width: '100%',
                ...overflowStyles,
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                fontFamily: 'monospace !important',
                fontSize: FontSizes.size12
            } as IStyle
        ]
    })
);
