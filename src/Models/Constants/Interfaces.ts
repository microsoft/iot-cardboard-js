import IBaseAdapter from '../../Adapters/IBaseAdapter';
import { Theme } from './Enums';

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
