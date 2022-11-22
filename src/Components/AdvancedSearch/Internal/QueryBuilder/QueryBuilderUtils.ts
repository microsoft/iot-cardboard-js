import { IDropdownOption } from '@fluentui/react';
import { PropertyValueType } from '../../../../Models/Constants';
import { QUERY_RESULT_LIMIT } from '../../AdvancedSearch.types';
import {
    CombinatorValue,
    OperatorData,
    OperatorText,
    OperatorType,
    QueryRowData
} from './QueryBuilder.types';

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
    operatorType: OperatorType.Simple,
    operatorSymbol: '='
};

export const DEFAULT_COMBINATOR = CombinatorValue.And;

export const getOperators = (
    propertyType?: PropertyValueType
): IDropdownOption<OperatorData>[] => {
    if (!propertyType) {
        return [];
    }

    const operators: IDropdownOption[] = [
        {
            key: '1',
            text: OperatorText.Equals,
            data: {
                operatorType: OperatorType.Simple,
                operatorSymbol: '='
            }
        },
        {
            key: '2',
            text: OperatorText.NotEquals,
            data: {
                operatorType: OperatorType.Simple,
                operatorSymbol: '!='
            }
        }
    ];
    switch (propertyType) {
        case 'string':
            operators.push({
                key: '3',
                text: OperatorText.Contains,
                data: {
                    operatorType: OperatorType.Function,
                    operatorFunction: (property: string, value: string) => {
                        return `CONTAINS(T.${property}, ${value})`;
                    }
                }
            });
            operators.push({
                key: '4',
                text: OperatorText.NotContains,
                data: {
                    operatorType: OperatorType.Function,
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
                text: OperatorText.GreaterThan,
                data: {
                    operatorType: OperatorType.Simple,
                    operatorSymbol: '>'
                }
            });
            operators.push({
                key: '4',
                text: OperatorText.LessThan,
                data: {
                    operatorType: OperatorType.Simple,
                    operatorSymbol: '<'
                }
            });
            operators.push({
                key: '5',
                text: OperatorText.GreaterOrEqual,
                data: {
                    operatorType: OperatorType.Simple,
                    operatorSymbol: '>='
                }
            });
            operators.push({
                key: '6',
                text: OperatorText.LessOrEqual,
                data: {
                    operatorType: OperatorType.Simple,
                    operatorSymbol: '<='
                }
            });
            break;
        default:
    }
    return operators;
};

export const buildQuery = (querySnippets: QueryRowData[]) => {
    let fullQuery = `SELECT TOP(${QUERY_RESULT_LIMIT})\nFROM DIGITALTWINS T\nWHERE `;
    querySnippets.forEach((snippet, index) => {
        if (snippet.operatorData.operatorType === OperatorType.Function) {
            if (index !== 0) {
                fullQuery = fullQuery.concat(`${snippet.combinator} `);
            }
            fullQuery = fullQuery.concat(
                `${snippet.operatorData.operatorFunction(
                    snippet.property,
                    snippet.value
                )}\n`
            );
        } else {
            if (index !== 0) {
                fullQuery = fullQuery.concat(`${snippet.combinator} `);
            }
            fullQuery = fullQuery.concat(
                `T.${snippet.property} ${snippet.operatorData.operatorSymbol} ${snippet.value}\n`
            );
        }
    });
    return fullQuery;
};
