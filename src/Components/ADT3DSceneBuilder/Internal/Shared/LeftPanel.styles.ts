import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles,
    ISeparatorStyles,
} from '@fluentui/react';

const classPrefix = 'left-panel';
const classNames = {
    noDataText: `${classPrefix}-no-data-text`,
    content: `${classPrefix}-content`,
    formTabContents: `${classPrefix}-form-tab-contents`,
};
export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataText: [
            classNames.noDataText,
            {
                fontSize: FontSizes.size12,
                color: theme.palette.neutralSecondary,
            } as IStyle,
        ],
        content: [
            classNames.content,
            {
                flexGrow: 1,
                height: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
            } as IStyle,
        ],
        formTabContents: [
            classNames.formTabContents,
            {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'auto',
            } as IStyle,
        ],
    });
});
export const getSeparatorStyles = memoizeFunction(
    (theme: Theme): Partial<ISeparatorStyles> => ({
        root: {
            '&:before': {
                backgroundColor: theme.palette.neutralLight,
            },
        },
    }),
);
export const leftPanelPivotStyles: Partial<IPivotStyles> = {
    root: {
        marginLeft: -8,
        marginBottom: 8,
    },
};
