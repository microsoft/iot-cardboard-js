import { FontSizes, ITheme } from '@fluentui/react';
import { StylesConfig } from 'react-select';

export const getReactSelectStyles = (
    theme: ITheme,
    params?: {
        menuList?: {
            isOnlyFirstRow: boolean;
            listMaxWidthLarge: number;
            listMaxWidthCompact: number;
        };
    }
): StylesConfig => {
    const menuList = params?.menuList;
    return {
        container: (provided) => ({
            ...provided,
            fontSize: FontSizes.size14,
            padding: '1px'
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.semanticColors.inputBackground,
            border: 0,
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: FontSizes.size14,
            fontWeight: 400, // Font weight enum gives a type error here
            minHeight: '32px',
            outline: '1px solid',
            outlineColor: state.isFocused
                ? theme.semanticColors.inputBackgroundCheckedHovered
                : theme.semanticColors.inputBorder
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: `${theme.semanticColors.inputText} !important`
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: `${theme.semanticColors.inputText} !important`,
            padding: '0px 4px'
        }),
        input: (provided) => ({
            ...provided,
            color: theme.semanticColors.inputText,
            fontSize: FontSizes.size14
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: theme.semanticColors.inputBackground,
            maxHeight: '300px',
            overflowY: 'auto',
            padding: 0,
            position: 'relative',
            maxWidth: menuList
                ? menuList.isOnlyFirstRow
                    ? menuList.listMaxWidthLarge
                    : menuList.listMaxWidthCompact
                : provided.maxWidth
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? theme.semanticColors.listItemBackgroundHovered
                : state.isSelected
                ? theme.semanticColors.listItemBackgroundHovered
                : 'inherit',
            borderBottom: `1px solid ${theme.semanticColors.listItemBackgroundHovered}`,
            color: theme.semanticColors.inputText,
            cursor: 'default',
            fontWeight: 400, // Font weight enum gives a type error here
            height: '32px',
            overflow: 'hidden',
            padding: '6px 12px',
            textOverflow: 'ellipsis'
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
