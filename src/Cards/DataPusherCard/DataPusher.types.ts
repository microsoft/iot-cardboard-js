import {
    ICardBaseProps,
    IAdtPusherSimulation,
    ISimulationAdapter
} from '../../Models/Constants';

export interface IDataPusherProps extends ICardBaseProps {
    adapter: ISimulationAdapter;
    Simulation: new (
        startTimeMillis: number,
        frequency: number
    ) => IAdtPusherSimulation;
    initialInstanceUrl?: string;
    disablePastEvents?: boolean;
    isOtherOptionsVisible?: boolean;
}

export interface IQuickFillDataFormProps {
    defaultDaysToSimulate?: number;
}

export interface IDataPusherState {
    instanceUrl: string;
    daysToSimulate: number;
    dataSpacing: number;
    quickStreamFrequency: number;
    isLiveDataSimulated: boolean;
    isDataBackFilled: boolean;
    liveStreamFrequency: number;
    includeImagesForModel: boolean;
    isSimulationRunning: boolean;
    isEnvironmentReady: boolean;
    disablePastEvents: boolean;
    isOtherOptionsVisible: boolean;
    simulationStatus: {
        areModelsReady: boolean;
        areTwinsReady: boolean;
        areRelationshipsReady: boolean;
        liveStatus: {
            packetNumber: number;
            totalTwinsPatched: number;
            totalSuccessfulPatches: number;
        } | null;
    };
}

export interface IDataPusherContext {
    state: IDataPusherState;
    dispatch: React.Dispatch<{ type: dataPusherActionType; payload?: any }>;
}

export enum dataPusherActionType {
    SET_INSTANCE_URL,
    SET_DAYS_TO_SIMULATE,
    SET_DATA_SPACING,
    SET_QUICK_STREAM_FREQUENCY,
    SET_IS_LIVE_DATA_SIMULATED,
    SET_LIVE_STREAM_FREQUENCY,
    SET_INCLUDE_IMAGES_FOR_MODEL,
    SET_IS_SIMULATION_RUNNING,
    SET_IS_DATA_BACK_FILLED,
    SET_IS_ENVIRONMENT_READY,
    SET_ARE_MODELS_READY,
    SET_ARE_TWINS_READY,
    SET_ARE_RELATIONSHIPS_READY,
    SET_LIVE_STATUS
}
