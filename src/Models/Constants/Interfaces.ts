import { IBaseAdapter } from '../../Adapters/IBaseAdapter';
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
