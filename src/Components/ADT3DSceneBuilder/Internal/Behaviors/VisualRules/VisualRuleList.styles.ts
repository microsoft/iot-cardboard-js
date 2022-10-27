import { ITheme, mergeStyles } from '@fluentui/react';

export const getVisualRuleListStyles = (theme: ITheme) =>
    mergeStyles({
        height: 16,
        width: 16,
        marginRight: 8,
        path: {
            fill: theme.palette.neutralPrimary,
            stroke: theme.palette.neutralPrimary
        }
    });
