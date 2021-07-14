import produce from 'immer';
import { dataPusherActionType, IDataPusherState } from './DataPusher.types';

export const defaultAdtDataPusherState: IDataPusherState = {
    instanceUrl: '<your_adt_instance_url>.digitaltwins.azure.net',
    daysToSimulate: 7,
    dataSpacing: 60000,
    quickStreamFrequency: 500,
    isLiveDataSimulated: true,
    liveStreamFrequency: 1000,
    includeImagesForModel: true,
    isSimulationRunning: false,
    isDataBackFilled: false,
    isEnvironmentReady: false,
    simulationStatus: {
        modelsReady: false,
        twinsReady: false,
        relationshipsReady: false,
        liveStatus: null
    }
};

// Using immer immutability helper: https://github.com/immerjs/immer
export const dataPusherReducer = produce(
    (
        draft: IDataPusherState,
        action: { type: dataPusherActionType; payload?: any }
    ) => {
        const payload = action.payload;

        switch (action.type) {
            case dataPusherActionType.SET_INSTANCE_URL:
                draft.instanceUrl = payload;
                return;
            case dataPusherActionType.SET_DAYS_TO_SIMULATE:
                draft.daysToSimulate = payload;
                return;
            case dataPusherActionType.SET_DATA_SPACING:
                draft.dataSpacing = payload;
                return;
            case dataPusherActionType.SET_QUICK_STREAM_FREQUENCY:
                draft.quickStreamFrequency = payload;
                return;
            case dataPusherActionType.SET_IS_LIVE_DATA_SIMULATED:
                draft.isLiveDataSimulated = payload;
                return;
            case dataPusherActionType.SET_LIVE_STREAM_FREQUENCY:
                draft.liveStreamFrequency = payload;
                return;
            case dataPusherActionType.SET_INCLUDE_IMAGES_FOR_MODEL:
                draft.includeImagesForModel = payload;
                return;
            case dataPusherActionType.SET_IS_SIMULATION_RUNNING:
                draft.isSimulationRunning = payload;
                return;
            case dataPusherActionType.SET_IS_DATA_BACK_FILLED:
                draft.isDataBackFilled = payload;
                return;
            case dataPusherActionType.SET_IS_ENVIRONMENT_READY:
                draft.isEnvironmentReady = payload;
                return;
            case dataPusherActionType.SET_MODELS_READY:
                draft.simulationStatus.modelsReady = payload;
                return;
            case dataPusherActionType.SET_TWINS_READY:
                draft.simulationStatus.twinsReady = payload;
                return;
            case dataPusherActionType.SET_RELATIONSHIPS_READY:
                draft.simulationStatus.relationshipsReady = payload;
                return;
            case dataPusherActionType.SET_LIVE_STATUS:
                draft.simulationStatus.liveStatus = payload;
                return;
            default:
                return;
        }
    }
);
