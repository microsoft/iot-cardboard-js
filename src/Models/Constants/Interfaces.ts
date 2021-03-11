import IBaseAdapter from '../../Adapters/IBaseAdapter';
import AdapterResult from '../Classes/AdapterResult';
import { Theme } from './Enums';

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
    additionalProperties?: Record<string, any>;
    title?: string;
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
