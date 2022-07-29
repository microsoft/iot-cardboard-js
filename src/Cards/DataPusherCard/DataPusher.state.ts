import produce from 'immer';
import { AdtPusherSimulationType } from '../../Models/Constants';
import { dataPusherActionType, IDataPusherState } from './DataPusher.types';

export const defaultAdtDataPusherState: IDataPusherState = {
    instanceUrl: '<your_adt_instance_url>.digitaltwins.azure.net',
    daysToSimulate: 7,
    dataSpacing: 60000,
    quickStreamFrequency: 1000,
    isLiveDataSimulated: true,
    liveStreamFrequency: 10,
    isSimulationRunning: false,
    isDataBackFilled: false,
    isEnvironmentReady: false,
    disablePastEvents: false,
    models: [],
    twins: [],
    relationships: [],
    areAssetsSet: false,
    simulationStatus: {
        areAssetsUploaded: false,
        liveStatus: null
    },
    simulationType: AdtPusherSimulationType.RobotArms
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
            case dataPusherActionType.SET_IS_SIMULATION_RUNNING:
                draft.isSimulationRunning = payload;
                return;
            case dataPusherActionType.SET_IS_DATA_BACK_FILLED:
                draft.isDataBackFilled = payload;
                return;
            case dataPusherActionType.SET_IS_ENVIRONMENT_READY:
                draft.isEnvironmentReady = payload;
                return;
            case dataPusherActionType.SET_MODELS:
                draft.models = payload;
                return;
            case dataPusherActionType.SET_TWINS:
                draft.twins = payload;
                return;
            case dataPusherActionType.SET_RELATIONSHIPS:
                draft.relationships = payload;
                return;
            case dataPusherActionType.SET_ARE_ASSETS_SET:
                draft.areAssetsSet = payload;
                return;
            case dataPusherActionType.SET_ARE_ASSETS_UPLOADED:
                draft.simulationStatus.areAssetsUploaded = payload;
                return;
            case dataPusherActionType.SET_LIVE_STATUS:
                draft.simulationStatus.liveStatus = payload;
                return;
            case dataPusherActionType.SET_SIMULATION_TYPE:
                draft.simulationType = payload;
                return;
            default:
                return;
        }
    }
);
