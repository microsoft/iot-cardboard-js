import produce from 'immer';
import { SourceType } from '../../../DataPusher/DataPusher.types';
import {
    DataSourceStepAction,
    DataSourceStepActionType,
    IDataSourceStepState
} from './DataSourceStep.types';

export const defaultDataSourceStepState: IDataSourceStepState = {
    selectedSourceType: SourceType.Timeseries,
    selectedSource: {
        cluster: null,
        database: null,
        table: null,
        twinIdColumn: null,
        tableType: null
    },
    adapterResult: false,
    cookAssets: undefined
};

export const dateSourceStepReducer = produce(
    (draft: IDataSourceStepState, action: DataSourceStepAction) => {
        switch (action.type) {
            case DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE:
                draft.selectedSourceType = action.sourceType;
                break;
            case DataSourceStepActionType.SET_SELECTED_SOURCE:
                draft.selectedSource = action.source;
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
