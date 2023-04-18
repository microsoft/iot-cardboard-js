import { FontSizes, ITheme } from '@fluentui/react';
import { StylesConfig } from 'react-select';

function getBaseReactSelectStyles<T>(theme: ITheme): StylesConfig<T> {
    return {
        container: (provided) => ({
            ...provided,
            fontSize: FontSizes.size14,
            padding: '1px',
            input: {
                opacity: `1 !important`
            }
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
}

export function getReactSelectStyles<T>(
    theme: ITheme,
    params?: {
        menu?: {
            marginTop?: number;
            marginBottom?: number;
            position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
            top?: string;
            height?: string;
        };
        menuList?: {
            isOnlyFirstRow: boolean;
            listMaxWidthLarge: number;
            listMaxWidthCompact: number;
        };
    }
): StylesConfig<T> {
    const menu = params?.menu;
    const menuList = params?.menuList;
    return {
        ...getBaseReactSelectStyles<T>(theme),
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
        dropdownIndicator: (provided) => ({
            ...provided,
            color: `${theme.semanticColors.inputBorder} !important`,
            padding: '0px 4px'
        }),
        menu: (provided) => ({
            ...provided,
            marginTop: menu?.marginTop,
            marginBottom: menu?.marginBottom,
            position: menu?.position || provided.position,
            top: menu?.top || provided.top,
            height: menu?.height || provided.height
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: theme.semanticColors.inputBackground,
            color: theme.semanticColors.inputPlaceholderText,
            maxHeight: '300px',
            height: '100%',
            maxWidth:
                (menuList?.isOnlyFirstRow
                    ? menuList?.listMaxWidthLarge
                    : menuList?.listMaxWidthCompact) || provided.maxWidth,
            overflowY: 'auto',
            padding: 0,
            position: 'relative',
            div: {
                // fix loading message that uses dynamic class name and is not exposed on the types here
                color: theme.semanticColors.inputPlaceholderText
            }
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
                color: `${theme.semanticColors.inputText} !important`
            },
            ':active': {
                backgroundColor: theme.semanticColors.listItemBackgroundHovered // emulate fluent behavior and keep the hover state when clicked
            }
        })
    };
}

export const getMultiSelectStyles = (theme: ITheme): StylesConfig => {
    return {
        ...getBaseReactSelectStyles(theme),
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
            minHeight: 32,
            outline: 'none !important'
        }),
        multiValue: (provided) => ({
            ...provided,
            background: theme.semanticColors.accentButtonBackground,
            color: theme.semanticColors.accentButtonText
        })
    };
};
