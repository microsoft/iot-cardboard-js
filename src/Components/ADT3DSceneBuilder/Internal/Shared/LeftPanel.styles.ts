import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme
} from '@fluentui/react';

export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataText: {
            fontSize: FontSizes.size12,
            color: theme.palette.neutralSecondary
        } as IStyle,
        listContainer: {
            flexGrow: 1,
            marginBottom: '16px',
            overflowX: 'hidden',
            overflowY: 'auto'
        } as IStyle
    });
});
