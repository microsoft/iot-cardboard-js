import AdapterResult from '../Classes/AdapterResult';

export type AdapterReturnType<T> = Promise<AdapterResult<T>>;

export type AdapterResultParams<T> = {
    data: T | null;
    error: Error | null;
};

export type KeyValuePairData = Record<string, any>;
