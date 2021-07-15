import {
    ISimulation,
    ISimulationAdapter,
    Locale,
    Theme
} from '../../Models/Constants';

export interface IDataPusherProps {
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    adapter: ISimulationAdapter;
    Simulation: new (startTimeMillis: number, frequency: number) => ISimulation;
    initialInstanceUrl?: string;
    disablePastEvents?: boolean;
}

export interface IQuickFillDataFormProps {
    defaultDaysToSimulate?: number;
}

export interface IDataPusherState {
    simulationType?: string;
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
    simulationStatus: {
        modelsReady: boolean;
        twinsReady: boolean;
        relationshipsReady: boolean;
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
    SET_MODELS_READY,
    SET_TWINS_READY,
    SET_RELATIONSHIPS_READY,
    SET_LIVE_STATUS
}
