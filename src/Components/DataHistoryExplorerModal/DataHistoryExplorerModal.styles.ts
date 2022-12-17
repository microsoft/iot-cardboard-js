import {
    IDataHistoryExplorerModalStyleProps,
    IDataHistoryExplorerModalStyles
} from './DataHistoryExplorerModal.types';

export const classPrefix = 'cb-datahistoryexplorermodal';
const classNames = {
    root: `${classPrefix}-root`,
    contentStack: `${classPrefix}-content-stack`
};
export const getStyles = (
    _props: IDataHistoryExplorerModalStyleProps
): IDataHistoryExplorerModalStyles => {
    return {
        root: [classNames.root],
        contentStack: [classNames.contentStack, { height: '100%' }],
        subComponentStyles: {
            modal: { titleContainer: { i: { paddingTop: 0 } } }
        }
    };
};
