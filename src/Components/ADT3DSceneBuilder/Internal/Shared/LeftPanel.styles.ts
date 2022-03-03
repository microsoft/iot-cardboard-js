import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles
} from '@fluentui/react';

export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataText: {
            fontSize: FontSizes.size12,
            color: theme.palette.neutralSecondary
        } as IStyle,
        rootListContainer: {
            flexGrow: 1,
            marginBottom: '16px',
            overflowX: 'hidden',
            overflowY: 'auto'
        } as IStyle,
        formTabContents: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'auto'
            // padding: '8px'
        } as IStyle
    });
});
export const leftPanelPivotStyles: Partial<IPivotStyles> = {
    root: {
        marginLeft: -8,
        marginBottom: 8
    }
};
