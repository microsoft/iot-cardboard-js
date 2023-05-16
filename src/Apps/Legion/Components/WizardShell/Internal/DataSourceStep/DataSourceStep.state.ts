import produce from 'immer';
import {
    DataSourceStepAction,
    DataSourceStepActionType,
    IDataSourceStepState
} from './DataSourceStep.types';
import { SourceType } from '../../../../Models/Constants';

export const defaultDataSourceStepState: IDataSourceStepState = {
    selectedSourceType: SourceType.Timeseries,
    selectedSource: {
        cluster: null,
        database: null,
        table: null,
        twinIdColumn: null,
        tableType: null
    },
    adapterResult: false
};

export const DataSourceStepReducer = produce(
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
            default:
                return;
        }
    }
);
