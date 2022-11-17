import { FontSizes, IMessageBarStyles, IStyle } from '@fluentui/react';
import {
    IResourcePickerStyleProps,
    IResourcePickerStyles
} from './ResourcePicker.types';

export const classPrefix = 'cb-resourcepicker';
const classNames = {
    root: `${classPrefix}-root`,
    dropdownMenu: `${classPrefix}-dropdown-menu`,
    optionWrapper: `${classPrefix}-option-wrapper`,
    optionText: `${classPrefix}-option-text`,
    noMatchingOptionText: `${classPrefix}-no-matching-option-text`,
    optionHeaderText: `${classPrefix}-option-header-text`,
    labelContainer: `${classPrefix}-label-container`,
    label: `${classPrefix}-label`,
    errorText: `${classPrefix}-error-text`
};
export const getStyles = (
    props: IResourcePickerStyleProps
): IResourcePickerStyles => {
    const baseTextOptionStyles: IStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexGrow: 1
    };
    return {
        root: [classNames.root],
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
                color: `${props.theme.palette.themePrimary} !important`,
                fontSize: FontSizes.size14,
                cursor: 'default'
            }
        ],
        noMatchingOptionText: [
            classNames.noMatchingOptionText,
            {
                ...baseTextOptionStyles,
                color: props.theme.palette.neutralPrimaryAlt,
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
                    color: props.theme.semanticColors.errorText,
                    content: ' *',
                    paddingRight: 12
                }
            }
        ],
        errorText: [
            classNames.errorText,
            {
                color: props.theme.semanticColors.errorText
            }
        ],
        subComponentStyles: {
            errorMessageBar: {
                root: {
                    maxWidth: '50%',
                    minHeight: 'unset'
                },
                content: {
                    alignItems: 'center'
                },
                dismissal: {
                    padding: 0,
                    width: 10,
                    height: 10
                },
                iconContainer: { margin: '0px 12px', padding: '1px 4px 0' },
                text: { margin: 0, paddingLeft: '8px' }
            } as IMessageBarStyles
        }
    };
};
