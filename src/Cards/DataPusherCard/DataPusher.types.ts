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
    liveStreamFrequency: number;
    includeImagesForModel: boolean;
    isSimulationRunning: boolean;
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
    SET_IS_SIMULATION_RUNNING
}
