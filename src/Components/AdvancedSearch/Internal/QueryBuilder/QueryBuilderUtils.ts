import { IDropdownOption } from '@fluentui/react';
import { PropertyValueType } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

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

export const getOperators = (
    propertyType: PropertyValueType
): IDropdownOption[] => {
    const operators: IDropdownOption[] = [
        {
            key: '1',
            text: 'Equals',
            data: {
                operatorType: 'Operator',
                operatorSymbol: '='
            }
        },
        {
            key: '2',
            text: 'Not equals',
            data: {
                operatorType: 'Operator',
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
                    operatorSymbol: 'CONTAINS('
                }
            });
            operators.push({
                key: '4',
                text: 'Not contains',
                data: {
                    operatorType: 'Function',
                    operatorSymbol: 'NOT CONTAINS('
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
                    operatorType: 'Operator',
                    operatorSymbol: '>'
                }
            });
            operators.push({
                key: '4',
                text: 'Less than',
                data: {
                    operatorType: 'Operator',
                    operatorSymbol: '<'
                }
            });
            operators.push({
                key: '5',
                text: 'Greater or equal',
                data: {
                    operatorType: 'Operator',
                    operatorSymbol: '>='
                }
            });
            operators.push({
                key: '6',
                text: 'Less or equal',
                data: {
                    operatorType: 'Operator',
                    operatorSymbol: '<='
                }
            });
            break;
        default:
    }
    return operators;
};

export const buildQuery = (_querySnippets: Map<string, string>) => {
    // TODO: CREATE QUERY LOGIC HERE
    return 'Query';
};
