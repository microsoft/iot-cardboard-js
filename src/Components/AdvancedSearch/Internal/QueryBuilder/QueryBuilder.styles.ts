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
    root: `${classPrefix}-root`,
    headerGrid: `${classPrefix}-headerGrid`,
    headerText: `${classPrefix}-headerText`,
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
                fontSize: '16px',
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
    root: `${classPrefix}-root`,
    firstColumn: `${classPrefix}-firstColumn`,
    inputColumn: `${classPrefix}-inputColumn`,
    buttonColumn: `${classPrefix}-buttonColumn`
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
                columnGap: '20px',
                marginTop: 10
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

export const reactSelectStyles = (isOnlyFirstRow: boolean): StylesConfig => {
    return {
        container: (provided) => ({
            ...provided,
            fontSize: '14px',
            padding: '1px'
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--cb-color-bg-canvas)',
            border: 0,
            borderRadius: '2px',
            fontSize: '14px',
            fontWeight: 400,
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
            fontSize: '14px'
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: 'var(--cb-color-bg-canvas)',
            maxHeight: '300px',
            maxWidth: isOnlyFirstRow ? 258 : 218,
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
            fontWeight: 600,
            height: '32px',
            overflow: 'hidden',
            padding: '6px 12px',
            textOverflow: 'ellipsis'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'var(--cb-color-input-border)',
            fontSize: '14px'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'var(--cb-color-text-primary)'
        })
    };
};
