import produce from 'immer';
import { TableTypes } from '../../../DataPusher/DataPusher.types';
import {
    DataSourceStepAction,
    DataSourceStepActionType,
    IDataSourceStepState
} from './DataSourceStep.types';

export const defaultDataSourceStepState: IDataSourceStepState = {
    sourceDatabaseOptions: [],
    targetDatabaseOptions: [],
    sourceTableOptions: [],
    sourceTableColumnOptions: [],
    selectedSourceDatabase: '',
    selectedTargetDatabase: undefined,
    selectedSourceTable: '',
    selectedSourceTwinIDColumn: '',
    selectedSourceTableType: TableTypes.Wide,
    sourceTableData: undefined,
    adapterResult: false,
    cookAssets: undefined
};

export const dateSourceStepReducer = produce(
    (draft: IDataSourceStepState, action: DataSourceStepAction) => {
        switch (action.type) {
            case DataSourceStepActionType.SET_SOURCE_DATABASE_OPTIONS:
                draft.sourceDatabaseOptions = action.options;
                break;
            case DataSourceStepActionType.SET_TARGET_DATABASE_OPTIONS:
                draft.targetDatabaseOptions = action.options;
                break;
            case DataSourceStepActionType.SET_SOURCE_TABLE_OPTIONS:
                draft.sourceTableOptions = action.options;
                break;
            case DataSourceStepActionType.SET_SOURCE_TABLE_DATA:
                draft.sourceTableData = action.tableData;
                draft.sourceTableColumnOptions = action.tableData.Columns.map(
                    (d) => ({
                        key: d.columnName,
                        text: d.columnName
                    })
                );
                break;
            case DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE:
                draft.selectedSourceDatabase = action.database;
                draft.selectedSourceTable = '';
                draft.selectedSourceTwinIDColumn = '';
                draft.sourceTableData = undefined;
                draft.cookAssets = undefined;
                break;
            case DataSourceStepActionType.SET_SELECTED_TARGET_DATABASE:
                draft.selectedTargetDatabase = action.database;
                break;
            case DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE:
                draft.selectedSourceTable = action.table;
                draft.selectedSourceTwinIDColumn = '';
                draft.sourceTableData = undefined;
                draft.cookAssets = undefined;
                break;
            case DataSourceStepActionType.SET_SELECTED_SOURCE_TWIN_ID_COLUMN:
                draft.selectedSourceTwinIDColumn = action.columnName;
                break;
            case DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE_TYPE:
                draft.selectedSourceTableType = action.tableType;
                break;
            case DataSourceStepActionType.SET_ADAPTER_RESULT:
                draft.adapterResult = action.adapterResult;
                break;
            case DataSourceStepActionType.SET_COOK_ASSETS:
                draft.cookAssets = action.cookAssets;
                break;
            default:
                return;
        }
    }
);
