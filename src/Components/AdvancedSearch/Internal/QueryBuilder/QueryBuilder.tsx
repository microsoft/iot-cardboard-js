import React, { useContext, useRef, useState } from 'react';
import {
    IQueryBuilderProps,
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
} from './QueryBuilder.types';
import { getStyles } from './QueryBuilder.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    ActionButton,
    PrimaryButton,
    IButtonStyles
} from '@fluentui/react';
import QueryBuilderRow from './QueryBuilderRow';
import { buildQuery } from './QueryBuilderUtils';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder/ADT3DSceneBuilder';
import { useElementFormContext } from '../../../../Models/Context/ElementsFormContext/ElementFormContext';
import { PropertyExpression } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

const getClassNames = classNamesFunction<
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
>();

const QueryBuilder: React.FC<IQueryBuilderProps> = (props) => {
    const {
        adapter,
        allowedPropertyValueTypes,
        executeQuery,
        styles,
        twinIdParams,
        updateColumns
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    // This could be a single map???
    const querySnippets = useRef(new Map<string, string>());
    const propertyExpressions = useRef(new Map<string, PropertyExpression>());
    const validityMap = useRef(new Map<string, boolean>());
    //
    const [isSearchDisabled, setIsSearchDisabled] = useState(true);
    const [rows, updateRows] = useState<any[]>([
        {
            rowId: String(Math.random())
        }
    ]);

    // const { adapter } = useContext(SceneBuilderContext);
    // const { elementFormState } = useElementFormContext();

    const checkIsValidQuery = () => {
        if (validityMap.current.size === 0) {
            return true;
        }
        let isValid = true;
        for (const validity in validityMap.current) {
            if (!validity) {
                isValid = false;
            }
        }
        return isValid;
    };

    const appendRow = () => {
        // Add row component
        const rowId = String(Math.random());
        const newRows = [
            ...rows,
            {
                rowId: rowId
            }
        ];
        updateRows(newRows);
        // Set validity to false since row is just initialized
        validityMap.current.set(rowId, false);
        // Update columns for external consumption
        // updateColumns(new Set(propertyNames.current.keys()));
    };

    const removeRow = (index: number, rowId: string) => {
        // Remove row component
        const newRows = [...rows];
        if (index === 0) {
            newRows.shift();
        } else {
            newRows.splice(index, 1);
        }
        updateRows(newRows);
        // Remove row values in query and property
        querySnippets.current.delete(rowId);
        // propertyNames.current.delete(rowId);
        validityMap.current.delete(rowId);
        // Update columns for external consumption
        // updateColumns(new Set(propertyNames.current.keys()));
    };

    // Split this into more onChange methods?
    // const onChange = (
    //     querySnippet: string,
    //     propertyName: string,
    //     rowId: string,
    //     isValid: boolean
    // ) => {
    //     querySnippets.current.set(rowId, querySnippet);
    //     propertyNames.current.set(rowId, propertyName);
    //     validityMap.current.set(rowId, isValid);
    //     setIsSearchDisabled(!checkIsValidQuery());
    // };
    const onChangeValue = () => {
        return;
    };

    const onChangeProperty = () => {
        updateColumns(new Set<string>()); // Change this to actually read property names
        return;
    };

    // const onChangeOperator = () => {
    //     return;
    // }

    const onSearch = () => {
        const query = buildQuery(querySnippets.current);
        executeQuery(query);
    };

    return (
        <div className={classNames.root}>
            <Stack horizontal={true}>
                <h4 className={classNames.columnHeader}>And/Or</h4>
                <h4 className={classNames.firstColumnHeader}>Property</h4>
                <h4 className={classNames.columnHeader}>Operator</h4>
                <h4 className={classNames.columnHeader}>Value</h4>
            </Stack>
            <Stack style={{ maxHeight: 150, overflow: 'auto' }}>
                {rows.map((row, index) => (
                    <QueryBuilderRow
                        // adapter={adapter}
                        // allowedPropertyValueTypes={[
                        //     'boolean',
                        //     'double',
                        //     'float',
                        //     'integer',
                        //     'string'
                        // ]}
                        // twinIdParams={{
                        //     primaryTwinIds: [
                        //         elementFormState.elementToEdit.primaryTwinID
                        //     ]
                        // }}
                        adapter={adapter}
                        allowedPropertyValueTypes={allowedPropertyValueTypes}
                        twinIdParams={twinIdParams}
                        key={row.rowId}
                        position={index}
                        removeRow={removeRow}
                        onChangeValue={onChangeValue}
                        onChangeProperty={onChangeProperty}
                        isRemoveDisabled={rows.length === 1}
                        styles={classNames.subComponentStyles.row}
                    />
                ))}
            </Stack>
            <ActionButton
                onClick={appendRow}
                text={'Add new row'}
                styles={classNames.subComponentStyles.addButton()}
                disabled={rows.length === 10}
            />
            <PrimaryButton
                text={'Search'}
                onClick={onSearch}
                disabled={isSearchDisabled}
                styles={classNames.subComponentStyles.searchButton()}
            />
            {/* TODO: Translation */}
        </div>
    );
};

export default styled<
    IQueryBuilderProps,
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
>(QueryBuilder, getStyles);
