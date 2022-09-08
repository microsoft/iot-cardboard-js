import { FontSizes, ITheme } from '@fluentui/react';
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
    optionContainer: `${classPrefix}-optionContainer`,
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
        optionContainer: [
            rowClassNames.optionContainer,
            {
                flex: '1 1 auto',
                minWidth: 0,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }
        ],
        subComponentStyles: {
            deleteButton: {
                rootDisabled: {
                    background: 'transparent'
                }
            },
            propertyIcon: {
                root: {
                    paddingRight: 4,
                    flex: '0 0 auto'
                }
            }
        }
    };
};

// 260 or 220 minus 2px due to borders
export const MENU_LIST_LARGE_MAX_WIDTH = 258;
export const MENU_LIST_COMPACT_MAX_WIDTH = 218;
