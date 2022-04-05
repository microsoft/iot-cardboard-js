import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles,
    ISeparatorStyles,
    IStackStyles
} from '@fluentui/react';
import { behaviorsModalPreviewContainerLeftOffset } from '../../../../Models/Constants/StyleConstants';

const classPrefix = 'left-panel';
const classNames = {
    noDataText: `${classPrefix}-no-data-text`,
    content: `${classPrefix}-content`,
    formTabContents: `${classPrefix}-form-tab-contents`,
    previewContainer: `${classPrefix}-preview-container`
};
export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataText: [
            classNames.noDataText,
            {
                fontSize: FontSizes.size12,
                color: theme.palette.neutralSecondary
            } as IStyle
        ],
        content: [
            classNames.content,
            {
                flexGrow: 1,
                height: '100%',
                overflowX: 'hidden',
                overflowY: 'auto'
            } as IStyle
        ],
        formTabContents: [
            classNames.formTabContents,
            {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'auto'
            } as IStyle
        ],
        previewContainer: [
            classNames.previewContainer,
            {
                position: 'fixed',
                top: 16,
                left: behaviorsModalPreviewContainerLeftOffset,
                bottom: 16,
                right: 16,
                zIndex: 1000,
                pointerEvents: 'none'
            } as IStyle
        ]
    });
});
export const getSeparatorStyles = memoizeFunction(
    (theme: Theme): Partial<ISeparatorStyles> => ({
        root: {
            '&:before': {
                backgroundColor: theme.palette.neutralLight
            }
        }
    })
);
export const leftPanelPivotStyles: Partial<IPivotStyles> = {
    root: {
        marginLeft: -8,
        marginBottom: 8
    }
};
