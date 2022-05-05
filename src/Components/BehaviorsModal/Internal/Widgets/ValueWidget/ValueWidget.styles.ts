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
    expressionValueListItem: `${behaviorsModalClassPrefix}-property-widget-expression-value-list-item`
};

const ellipseStyles = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
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
                flexShrink: 0
            } as IStyle
        ],
        expressionValueContainer: [
            classNames.expressionValueContainer,
            {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflowX: 'hidden',
                overflowY: 'auto'
            } as IStyle
        ],
        expressionValuePrimary: [
            classNames.expressionValuePrimary,
            {
                width: '100%',
                ...ellipseStyles,
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size24,
                lineHeight: 24,
                paddingBottom: 12
            } as IStyle
        ],
        expressionValueSecondary: [
            classNames.expressionValueSecondary,
            {
                width: '100%',
                ...ellipseStyles,
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size16,
                lineHeight: 16,
                paddingBottom: 12
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
                fontSize: FontSizes.size14,
                lineHeight: 'unset',
                overflowX: 'hidden',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                marginBottom: 8
            } as IStyle
        ]
    })
);
