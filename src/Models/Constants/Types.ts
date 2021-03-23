import AdapterResult from '../Classes/AdapterResult';
import { IAdapterData } from './Interfaces';

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

export type KeyValuePairData = {
    key: string;
    value: any;
    timestamp?: Date;
};

export type TsiClientData = any[];

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
