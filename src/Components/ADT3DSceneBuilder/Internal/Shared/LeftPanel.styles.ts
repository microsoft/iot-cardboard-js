import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme
} from '@fluentui/react';

export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataLabel: {
            fontSize: FontSizes.size12,
            color: theme.palette.neutralSecondary
        } as IStyle
    });
});
