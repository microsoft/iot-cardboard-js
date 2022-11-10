import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IPivotStyles,
    ISeparatorStyles,
    IButtonStyles,
    ICalloutContentStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import { leftPanelBuilderBlock } from '../../../../Resources/Styles/BaseStyles';

const classPrefix = CardboardClassNamePrefix + '-left-panel';
const classNames = {
    noDataText: `${classPrefix}-no-data-text`,
    content: `${classPrefix}-content`,
    formTabContents: `${classPrefix}-form-tab-contents`,
    actionButton: `${classPrefix}-action-button`,
    text: `${classPrefix}-text`,
    section: `${classPrefix}-section`,
    previewContainer: `${classPrefix}-preview-container`,
    paddedLeftPanelBlock: `${classPrefix}-padded-pivot-tab-contents`
};
export const getLeftPanelStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        paddedLeftPanelBlock: [
            classNames.paddedLeftPanelBlock,
            leftPanelBuilderBlock
        ],
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
                minHeight: 60,
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
        marginBottom: 8,
        paddingLeft: 16,
        paddingRight: 8
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

export const getCalloutStyles = memoizeFunction(
    (theme: Theme) =>
        ({
            root: {
                padding: '16px 20px 20px',
                width: 300,
                backgroundColor: theme.semanticColors.bodyBackground
            },
            calloutMain: {
                backgroundColor: 'unset'
            }
        } as ICalloutContentStyles)
);
