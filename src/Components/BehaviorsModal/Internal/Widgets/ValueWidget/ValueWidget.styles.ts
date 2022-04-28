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
    expressionValue: `${behaviorsModalClassPrefix}-property-widget-expression-value`
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
                padding: 20
            } as IStyle
        ],
        displayName: [
            classNames.displayName,
            {
                width: '100%',
                ...ellipseStyles,
                textAlign: 'center',
                fontSize: FontSizes.size12
            } as IStyle
        ],
        expressionValue: [
            classNames.expressionValue,
            {
                width: '100%',
                ...ellipseStyles,
                color: theme.palette.themePrimary,
                textAlign: 'center',
                fontSize: FontSizes.size28,
                lineHeight: 28,
                paddingBottom: 12
            } as IStyle
        ]
    })
);
