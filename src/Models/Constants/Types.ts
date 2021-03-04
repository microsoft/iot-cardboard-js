import AdapterResult from '../Classes/AdapterResult';
import { IAdapterData } from './Interfaces';

export type AdapterReturnType<T extends IAdapterData> = Promise<
    AdapterResult<T>
>;

export type AdapterResultParams<T extends IAdapterData> = {
    result: T;
    error: Error | null;
};

export type CardState<T extends IAdapterData> = {
    adapterResult: AdapterResult<T>;
    isLoading: boolean;
};
