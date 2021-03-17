import IBaseAdapter from '../../Adapters/IBaseAdapter';
import AdapterResult from '../Classes/AdapterResult';
import { AdapterErrorType, Locale, Theme } from './Enums';

export interface IAction {
    type: string;
    payload?: any;
}

export interface IConsumeCardProps {
    adapter: IBaseAdapter;
    id: string;
    properties: string[];
    theme?: Theme;
    additionalProperties?: Record<string, any>;
    title?: string;
    locale?: Locale;
}

export interface IAuthService {
    login: () => void;
    getToken: () => Promise<string>;
}

export interface IEnvironmentToConstantMapping {
    authority: string;
    clientId: string;
    scope: string;
    redirectUri: string;
}

export interface IAdapterData {
    data: any;
    hasNoData?: () => boolean;
}

export interface IUseAdapter<T extends IAdapterData> {
    /** Adapter loading state */
    isLoading: boolean;

    /** Result of adapter method call */
    adapterResult: AdapterResult<T>;

    /** Calls adapter method (safe on unmount) and updates adapter result */
    callAdapter: () => void;

    /** Toggles on/off long poll */
    setIsLongPolling: (isLongPolling: boolean) => void;

    /** Long polling pulse state for UI */
    pulse: boolean;
}

export interface IAdapterError {
    /** Text description of the adapter error */
    message?: string;

    /** Classification of error type */
    type?: AdapterErrorType;

    /** Catastrophic errors stop adapter execution */
    isCatastrophic?: boolean;

    /** Raw error object from catch block */
    rawError?: Error;
}

export interface IErrorInfo {
    errors: IAdapterError[];
    catastrophicError: IAdapterError;
}
