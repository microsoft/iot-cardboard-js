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
    firstColumnHeader: `${classPrefix}-firstColumnHeader`,
    columnHeader: `${classPrefix}-columnHeader`
};

export const getStyles = (
    _props: IQueryBuilderStyleProps
): IQueryBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                marginBottom: 12
            }
        ],
        firstColumnHeader: [
            classNames.firstColumnHeader,
            {
                width: 200
            }
        ],
        columnHeader: [
            classNames.columnHeader,
            {
                width: 200,
                marginLeft: 20
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
                    display: 'block'
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
    lastColumn: `${classPrefix}-lastColumn`,
    propertyContainer: `${classPrefix}-propertyContainer`
};

export const getRowStyles = (
    _props: IQueryBuilderRowStyleProps
): IQueryBuilderRowStyles => {
    return {
        root: [
            rowClassNames.root,
            {
                paddingBottom: 16
            }
        ],
        lastColumn: [
            rowClassNames.lastColumn,
            {
                width: 200
            }
        ],
        propertyContainer: [
            rowClassNames.propertyContainer,
            {
                width: 180,
                marginRight: 20
            }
        ],
        subComponentStyles: {
            iconButton: {},
            andDropdown: {
                root: {
                    width: 160
                }
            },
            operatorDropdown: {
                root: {
                    marginRight: 20,
                    width: 180
                }
            },
            textfield: {
                root: {
                    marginRight: 20,
                    width: 180
                }
            }
        }
    };
};
