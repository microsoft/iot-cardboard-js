import { FontSizes, ITheme } from '@fluentui/react';
import { StylesConfig } from 'react-select';
import {
    IQueryBuilderStyleProps,
    IQueryBuilderStyles,
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles
} from './QueryBuilder.types';

/**
 * Query builder container styles
 */
export const classPrefix = 'cb-querybuilder';
const classNames = {
    headerGrid: `${classPrefix}-headerGrid`,
    headerText: `${classPrefix}-headerText`,
    root: `${classPrefix}-root`,
    rowContainer: `${classPrefix}-rowContainer`
};

export const getStyles = (
    props: IQueryBuilderStyleProps
): IQueryBuilderStyles => {
    return {
        root: [classNames.root],
        headerGrid: [
            classNames.headerGrid,
            {
                display: 'grid',
                width: '100%',
                columnGap: '20px'
            },
            props.rowCount === 1
                ? {
                      gridTemplateColumns: '4fr 4fr 4fr 1fr'
                  }
                : {
                      gridTemplateColumns: '2fr 4fr 4fr 4fr 1fr'
                  }
        ],
        headerText: [
            classNames.headerText,
            {
                fontSize: FontSizes.size14,
                margin: 0
            }
        ],
        rowContainer: [
            classNames.rowContainer,
            {
                maxHeight: 150,
                overflowY: 'auto'
            }
        ],
        subComponentStyles: {
            searchButton: {
                root: {
                    display: 'block',
                    width: 100
                }
            },
            addButton: {
                root: {
                    display: 'block',
                    color: props.theme.palette.themePrimary,
                    padding: 0,
                    marginLeft: 0
                },
                label: {
                    margin: 0
                }
            }
        }
    };
};

/**
 * Query builder row styles
 */
export const rowClassPrefix = 'cb-querybuilderrow';
const rowClassNames = {
    buttonColumn: `${classPrefix}-buttonColumn`,
    firstColumn: `${classPrefix}-firstColumn`,
    inputColumn: `${classPrefix}-inputColumn`,
    root: `${classPrefix}-root`
};

export const getRowStyles = (
    props: IQueryBuilderRowStyleProps
): IQueryBuilderRowStyles => {
    return {
        root: [
            rowClassNames.root,
            {
                display: 'grid',
                width: '100%',
                gridTemplateRows: 'auto',
                columnGap: '20px'
            },
            props.isOnlyFirstRow
                ? {
                      gridTemplateColumns: '4fr 4fr 4fr 1fr'
                  }
                : {
                      gridTemplateColumns: '2fr 4fr 4fr 4fr 1fr'
                  }
        ],
        firstColumn: [rowClassNames.firstColumn],
        inputColumn: [rowClassNames.inputColumn],
        buttonColumn: [rowClassNames.buttonColumn],
        subComponentStyles: {
            deleteButton: {
                rootDisabled: {
                    background: 'transparent'
                }
            }
        }
    };
};

// 260 or 220 minus 2px due to borders
const menuListLargeMaxWidth = 258;
const menuListCompactMaxWidth = 218;
export const reactSelectStyles = (
    theme: ITheme,
    isOnlyFirstRow: boolean
): StylesConfig => {
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
            fontSize: FontSizes.size14,
            fontWeight: 400, // Font weight enum gives a type error here
            minHeight: '32px',
            outline: '1px solid',
            outlineColor: state.isFocused
                ? theme.semanticColors.inputBackgroundCheckedHovered
                : theme.semanticColors.inputBorder
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
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
            maxWidth: isOnlyFirstRow
                ? menuListLargeMaxWidth
                : menuListCompactMaxWidth,
            overflowY: 'auto',
            padding: 0,
            position: 'relative'
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
