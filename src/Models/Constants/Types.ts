import AdapterResult from '../Classes/AdapterResult';
import { IADTModel, IADTwin, IAdapterData } from './Interfaces';

export type AdapterReturnType<T extends IAdapterData> = Promise<
    AdapterResult<T>
>;

export type AdapterResultParams<T extends IAdapterData> = {
    result: T;
    error: Error | null;
};

export type AdapterState<T extends IAdapterData> = {
    adapterResult: AdapterResult<T>;
    isLoading: boolean;
    isLongPolling: boolean;
};

export type KeyValuePairData = Record<string, any>;

export type TsiClientData = any[];

export type ADTModelsData = {
    value: IADTModel[];
    nextLink: string;
};

export type ADTwinsData = {
    value: IADTwin[];
    continuationToken: string;
};

export type CancellablePromise<T> = {
    /** Wrapped promise - throws CancelledPromiseError if cancelled */
    promise: Promise<T>;
    /** Function to cancel promise */
    cancel: () => void;
};

export type UseLongPollParams = {
    /** Function to long poll at set interval */
    callback: () => Promise<any>;
    /** Time between each callback execution */
    pollingIntervalMillis?: number;
    /** Length of time UI pulse state remains true after callback completion - use to indicate updated data */
    pulseTimeoutMillis?: number;
};
