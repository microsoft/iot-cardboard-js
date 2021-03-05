import { IBaseAdapter } from '../../Adapters/IBaseAdapter';
import AdapterResult from '../Classes/AdapterResult';
import { Theme } from './Enums';

export interface Action {
    type: string;
    payload?: any;
}

export interface ConsumeCardProps {
    adapter: IBaseAdapter;
    id: string;
    properties: string[];
    theme?: Theme;
    additionalProperties?: Record<string, any>;
    title?: string;
}

export interface IAuthService {
    login: () => void;
    getToken: () => Promise<string>;
}

export interface EnvironmentToConstantMapping {
    authority: string;
    clientId: string;
    scope: string;
    redirectUri: string;
}

export interface IAdapterData {
    data: any;
    hasNoData?: () => boolean;
}

export interface IUseAdapterReturn<T extends IAdapterData> {
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
