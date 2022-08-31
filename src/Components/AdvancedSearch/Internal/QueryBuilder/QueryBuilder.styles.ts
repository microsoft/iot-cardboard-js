import { FontSizes } from '@fluentui/react';
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
                    display: 'block'
                }
            },
            addButton: {
                root: {
                    display: 'block',
                    color: props.theme.palette.themePrimary
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
export const reactSelectStyles = (isOnlyFirstRow: boolean): StylesConfig => {
    return {
        container: (provided) => ({
            ...provided,
            fontSize: FontSizes.size14,
            padding: '1px'
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--cb-color-bg-canvas)',
            border: 0,
            borderRadius: '2px',
            fontSize: FontSizes.size14,
            fontWeight: 400, // Font weight enum gives a type error here
            minHeight: '32px',
            outline: '1px solid',
            outlineColor: state.isFocused
                ? 'var(--cb-color-theme-primary)'
                : 'var(--cb-color-input-border)'
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
            color: 'var(--cb-color-text-secondary)',
            fontSize: FontSizes.size14
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: 'var(--cb-color-bg-canvas)',
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
                ? 'var(--cb-color-natural-light)'
                : state.isSelected
                ? 'var(--cb-color-natural-light)'
                : 'inherit',
            borderBottom: '1px solid var(--cb-color-natural-light)',
            color: 'var(--cb-color-text-primary)',
            cursor: 'default',
            fontWeight: 400, // Font weight enum gives a type error here
            height: '32px',
            overflow: 'hidden',
            padding: '6px 12px',
            textOverflow: 'ellipsis'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'var(--cb-color-input-border)',
            fontSize: FontSizes.size14
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'var(--cb-color-text-primary)'
        })
    };
};
