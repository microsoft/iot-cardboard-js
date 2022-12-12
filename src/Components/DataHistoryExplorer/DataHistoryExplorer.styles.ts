import {
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
} from './DataHistoryExplorer.types';

export const classPrefix = 'cb-data-history-explorer';
const classNames = {
    root: `${classPrefix}-root`,
    contentStack: `${classPrefix}-content-stack`
};
export const getStyles = (
    _props: IDataHistoryExplorerStyleProps
): IDataHistoryExplorerStyles => {
    return {
        root: [classNames.root],
        contentStack: [classNames.contentStack, { height: '100%' }],
        subComponentStyles: {
            builder: { root: { width: 240 } },
            viewer: { root: { flexGrow: 1 } }
        }
    };
};
