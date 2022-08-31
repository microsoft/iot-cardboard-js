import { IDropdownOption } from '@fluentui/react';
import { PropertyValueType } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { OperatorData, QueryRowType } from './QueryBuilder.types';

// Used to substitute reserved words for valid query inputs in case property name matches a reserved word
export enum RESERVED_WORDS {
    ALL,
    AND,
    AS,
    ASC,
    AVG,
    BY,
    COUNT,
    DESC,
    DEVICES_JOBS,
    DEVICES_MODULES,
    DEVICES,
    ENDS_WITH,
    FALSE,
    FROM,
    GROUP,
    IN,
    IS_BOOL,
    IS_DEFINED,
    IS_NULL,
    IS_NUMBER,
    IS_OBJECT,
    IS_PRIMITIVE,
    IS_STRING,
    MAX,
    MIN,
    NOT,
    NOT_IN,
    NULL,
    OR,
    ORDER,
    SELECT,
    STARTS_WITH,
    SUM,
    TOP,
    TRUE,
    WHERE,
    IS_OF_MODEL
}

export const getDefaultPropertyValues = (type: PropertyValueType) => {
    if (type === 'boolean') {
        return 'True';
    } else {
        return '0';
    }
};

export const DEFAULT_OPERATOR: OperatorData = {
    operatorType: 'Simple',
    operatorSymbol: '='
};

export const DEFAULT_COMBINATOR = 'And';

export const getOperators = (
    propertyType?: PropertyValueType
): IDropdownOption<OperatorData>[] => {
    if (!propertyType) {
        return [];
    }

    const operators: IDropdownOption[] = [
        {
            key: '1',
            text: 'Equals',
            data: {
                operatorType: 'Simple',
                operatorSymbol: '='
            }
        },
        {
            key: '2',
            text: 'Not equals',
            data: {
                operatorType: 'Simple',
                operatorSymbol: '!='
            }
        }
    ];
    switch (propertyType) {
        case 'string':
            operators.push({
                key: '3',
                text: 'Contains',
                data: {
                    operatorType: 'Function',
                    operatorFunction: (property: string, value: string) => {
                        return `CONTAINS(T.${property}, ${value})`;
                    }
                }
            });
            operators.push({
                key: '4',
                text: 'Not contains',
                data: {
                    operatorType: 'Function',
                    operatorFunction: (property: string, value: string) => {
                        return `NOT CONTAINS(T.${property}, ${value})`;
                    }
                }
            });
            break;
        case 'float':
        case 'integer':
        case 'double':
        case 'long':
            operators.push({
                key: '3',
                text: 'Greater than',
                data: {
                    operatorType: 'Simple',
                    operatorSymbol: '>'
                }
            });
            operators.push({
                key: '4',
                text: 'Less than',
                data: {
                    operatorType: 'Simple',
                    operatorSymbol: '<'
                }
            });
            operators.push({
                key: '5',
                text: 'Greater or equal',
                data: {
                    operatorType: 'Simple',
                    operatorSymbol: '>='
                }
            });
            operators.push({
                key: '6',
                text: 'Less or equal',
                data: {
                    operatorType: 'Simple',
                    operatorSymbol: '<='
                }
            });
            break;
        default:
    }
    return operators;
};

export const buildQuery = (querySnippets: QueryRowType[]) => {
    let fullQuery = `SELECT *\nFROM DIGITALTWINS T\n`;
    querySnippets.forEach((snippet, index) => {
        if (snippet.operatorData.operatorType === 'Function') {
            if (index !== 0) {
                fullQuery = fullQuery.concat(snippet.combinator);
            }
            fullQuery = fullQuery.concat(
                `WHERE ${snippet.operatorData.operatorFunction(
                    snippet.property,
                    snippet.value
                )}\n`
            );
        } else {
            if (index !== 0) {
                fullQuery = fullQuery.concat(`${snippet.combinator} `);
            }
            fullQuery = fullQuery.concat(
                `WHERE ${snippet.property} ${snippet.operatorData.operatorSymbol} ${snippet.value}\n`
            );
        }
    });
    return fullQuery;
};
