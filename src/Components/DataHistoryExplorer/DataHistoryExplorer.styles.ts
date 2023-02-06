import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
} from './DataHistoryExplorer.types';

export const classPrefix = 'cb-data-history-explorer';
const classNames = {
    root: `${classPrefix}-root`,
    titleWrapper: `${classPrefix}-title-wrapper`,
    title: `${classPrefix}-title`,
    titleIcon: `${classPrefix}-title-icon`,
    contentStack: `${classPrefix}-content-stack`
};
export const getStyles = (
    _props: IDataHistoryExplorerStyleProps
): IDataHistoryExplorerStyles => {
    return {
        root: [
            classNames.root,
            { height: '100%', display: 'flex', flexDirection: 'column' }
        ],
        titleWrapper: [
            classNames.titleWrapper,
            {
                fontWeight: FontWeights.semibold,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'baseline',
                width: `100%`,
                paddingBottom: 24
            }
        ],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size20,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                paddingLeft: 8
            }
        ],
        titleIcon: [classNames.titleIcon, { fontSize: FontSizes.size16 }],
        contentStack: [
            classNames.contentStack,
            { flexGrow: 1, overflow: 'hidden' }
        ],
        subComponentStyles: {
            builder: { root: { width: 240 } },
            viewer: { root: { flexGrow: 1, overflow: 'hidden' } },
            loadingSpinner: { root: { flexGrow: 1 } },
            errorWrapper: {
                subComponentStyles: {
                    illustrationMessage: {
                        descriptionContainer: { maxWidth: 400 }
                    }
                }
            }
        }
    };
};
