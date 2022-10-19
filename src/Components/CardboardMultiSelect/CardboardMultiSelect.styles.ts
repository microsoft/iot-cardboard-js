import { FontSizes, Theme } from '@fluentui/react';
import { StylesConfig } from 'react-select';
import {
    ICardboardMultiSelectStyleProps,
    ICardboardMultiSelectStyles
} from './CardboardMultiSelect.types';

export const classPrefix = 'cb-cardboardmultiselect';
const classNames = {
    root: `${classPrefix}-root`,
    input: `${classPrefix}-input`
};
export const getStyles = (
    _props: ICardboardMultiSelectStyleProps
): ICardboardMultiSelectStyles => {
    return {
        root: [classNames.root],
        input: [classNames.input],
        subComponentStyles: {}
    };
};

export const getMultiSelectStyles = (theme: Theme): StylesConfig => {
    return {
        container: (provided) => ({
            ...provided,
            fontSize: FontSizes.size14,
            padding: '1px',
            input: {
                opacity: `1 !important`
            }
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.semanticColors.inputBackground,
            border: `1px solid ${
                state.isFocused
                    ? theme.semanticColors.inputBackgroundCheckedHovered
                    : theme.semanticColors.inputBorder
            } !important`,
            borderRadius: '2px',
            boxShadow: 'none !important',
            cursor: 'pointer',
            fontSize: FontSizes.size14,
            fontWeight: 400, // Font weight enum gives a type error here
            height: 32,
            minHeight: 32,
            outline: 'none !important'
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: `${theme.semanticColors.inputText} !important`,
            padding: 0
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        input: (provided) => ({
            ...provided,
            color: theme.semanticColors.inputText,
            fontSize: FontSizes.size14
        }),
        option: (provided, state) => ({
            ...provided,
            alignItems: 'center',
            backgroundColor: state.isFocused
                ? theme.semanticColors.listItemBackgroundHovered
                : state.isSelected
                ? theme.semanticColors.listItemBackgroundHovered
                : 'inherit',
            borderBottom: `1px solid ${theme.semanticColors.listItemBackgroundHovered}`,
            color: `${theme.semanticColors.inputText} !important`,
            cursor: 'pointer',
            display: 'flex',
            height: '32px',
            overflow: 'hidden',
            padding: '6px 12px',
            textOverflow: 'ellipsis',
            div: {
                // counter the menulist selector added to fix the loading message
                color: theme.semanticColors.inputText
            },
            ':active': {
                backgroundColor: theme.semanticColors.listItemBackgroundHovered // emulate fluent behavior and keep the hover state when clicked
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: theme.semanticColors.inputPlaceholderText,
            fontSize: FontSizes.size14
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme.semanticColors.inputText
        })
    };
};
