import {
    FontSizes,
    FontWeights,
    IMessageBarStyles,
    IStyle
} from '@fluentui/react';
import {
    IResourcePickerStyleProps,
    IResourcePickerStyles
} from './ResourcePicker.types';

export const classPrefix = 'cb-resourcepicker';
const classNames = {
    root: `${classPrefix}-root`,
    menuList: `${classPrefix}-menu-list`,
    optionWrapper: `${classPrefix}-option-wrapper`,
    optionText: `${classPrefix}-option-text`,
    noMatchingOptionText: `${classPrefix}-no-matching-option-text`,
    optionHeaderText: `${classPrefix}-option-header-text`,
    labelContainer: `${classPrefix}-label-container`,
    label: `${classPrefix}-label`,
    errorText: `${classPrefix}-error-text`,
    warningText: `${classPrefix}-warning-text`
};
export const getStyles = ({
    theme
}: IResourcePickerStyleProps): IResourcePickerStyles => {
    const baseTextOptionStyles: IStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexGrow: 1
    };
    return {
        root: [classNames.root],
        menuList: [
            classNames.menuList,
            {
                backgroundColor: theme.semanticColors.inputBackground,
                height: 'auto !important',
                minHeight: 32,
                maxHeight: 300,
                overflowY: 'auto',
                overflowX: 'hidden'
            }
        ],
        optionWrapper: [
            classNames.optionWrapper,
            {
                width: '100%',
                alignItems: 'center',
                display: 'flex'
            }
        ],
        optionText: [classNames.optionText, baseTextOptionStyles],
        optionHeaderText: [
            classNames.optionHeaderText,
            {
                ...baseTextOptionStyles,
                color: `${theme.palette.themePrimary} !important`,
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.size14,
                cursor: 'default'
            }
        ],
        noMatchingOptionText: [
            classNames.noMatchingOptionText,
            {
                ...baseTextOptionStyles,
                color: theme.palette.neutralPrimaryAlt,
                fontStyle: 'italic'
            }
        ],
        labelContainer: [
            classNames.labelContainer,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                overflow: 'hidden',
                paddingTop: 8,
                width: '100%'
            }
        ],
        label: [
            classNames.label,
            {
                padding: 0,
                fontSize: 14,
                fontWeight: 600,
                '::after': {
                    color: theme.semanticColors.errorText,
                    content: ' *',
                    paddingRight: 12
                }
            }
        ],
        errorText: [
            classNames.errorText,
            {
                color: theme.semanticColors.errorText
            }
        ],
        warningText: [
            classNames.warningText,
            {
                color: theme.palette.orangeLighter
            }
        ],
        subComponentStyles: {
            errorMessageBar: {
                root: {
                    maxWidth: '50%',
                    minHeight: 'unset'
                },
                content: {
                    alignItems: 'center',
                    margin: '0 4px'
                },
                dismissal: {
                    padding: 0,
                    width: 10,
                    height: 10
                },
                iconContainer: { margin: 0, padding: '1px 4px 0' },
                text: { margin: 0, paddingLeft: '8px' }
            } as IMessageBarStyles
        }
    };
};
