import IBaseAdapter from '../../Adapters/IBaseAdapter';
import AdapterResult from '../Classes/AdapterResult';
import { AdapterErrorType, Locale, Theme } from './Enums';

export interface IAction {
    type: string;
    payload?: any;
}

export interface ITSIComponentProps {
    data: any[];
    chartOptions?: any;
    chartDataOptions?: any[];
}

export interface IConsumeCardProps {
    adapter: IBaseAdapter;
    id: string;
    properties: readonly string[];
    theme?: Theme;
    adapterAdditionalParameters?: Record<string, any>;
    title?: string;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
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

    /** Indicates long polling state */
    isLongPolling: boolean;

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

export interface IGetKeyValuePairsAdditionalParameters
    extends Record<string, any> {
    isTimestampIncluded?: boolean;
}
