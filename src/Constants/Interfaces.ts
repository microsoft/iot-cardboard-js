import { IBaseAdapter } from '../Adapters/IBaseAdapter';
import { Theme } from './Enums';

export interface Action {
    type: string;
    payload?: any;
}

export interface ConsumeCardProps {
    adapter: IBaseAdapter;
    id: string;
    properties: string[];
    theme: Theme;
    additionalProperties?: Record<string, any>;
    title?: string;
}
