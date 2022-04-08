import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles,
    ISeparatorStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import { behaviorsModalPreviewContainerLeftOffset } from '../../../../Models/Constants/StyleConstants';

const classPrefix = CardboardClassNamePrefix + '-left-panel';
const classNames = {
    noDataText: `${classPrefix}-no-data-text`,
    content: `${classPrefix}-content`,
    formTabContents: `${classPrefix}-form-tab-contents`,
    actionButton: `${classPrefix}-action-button`,
    text: `${classPrefix}-text`,
    section: `${classPrefix}-section`,
    previewContainer: `${classPrefix}-preview-container`
};
export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        noDataText: [
            classNames.noDataText,
            {
                fontSize: FontSizes.size12,
                color: theme.palette.neutralSecondary,
                marginTop: 8
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
        ],
        actionButton: [
            classNames.actionButton,
            {
                fontSize: FontSizes.size14,
                color: 'var(--cb-color-theme-primary)',
                paddingLeft: 0,
                span: { margin: 0 }
            } as IStyle
        ],
        text: [
            classNames.text,
            {
                color: theme.palette.neutralSecondary,
                padding: '4px 0',
                display: 'block'
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
