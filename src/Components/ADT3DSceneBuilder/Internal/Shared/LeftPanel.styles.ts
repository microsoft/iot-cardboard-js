import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles,
    ISeparatorStyles,
    IButtonStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';

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
                overflowY: 'auto',
                overflowX: 'hidden'
            } as IStyle
        ],
        previewContainer: [
            classNames.previewContainer,
            {
                position: 'absolute',
                top: 0,
                left: 20,
                bottom: 0,
                right: 0,
                zIndex: 1000,
                pointerEvents: 'none'
            } as IStyle
        ],
        text: [
            classNames.text,
            {
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
export const getActionButtonStyles = memoizeFunction(
    (theme: Theme): Partial<IButtonStyles> => ({
        root: {
            color: theme.palette.themePrimary,
            height: 32,
            paddingLeft: 0
        },
        flexContainer: { height: 32 },
        label: {
            margin: 0
        }
    })
);
