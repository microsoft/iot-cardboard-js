import IBaseAdapter from '../../Adapters/IBaseAdapter';
import { ADTAdapterData } from '../Classes';
import AdapterResult from '../Classes/AdapterResult';
import { Locale, Theme } from './Enums';
import { AdapterReturnType } from './Types';

export interface IAction {
    type: string;
    payload?: any;
}

export interface ITSIComponentProps {
    data: any[];
    chartOptions?: any;
    chartDataOptions?: any[];
}

export interface IStandaloneConsumeCardProps {
    adapter: IBaseAdapter;
    theme?: Theme;
    additionalProperties?: Record<string, any>;
    title?: string;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
}

export interface IConsumeCardProps {
    adapter: IBaseAdapter;
    id: string;
    properties: readonly string[];
    theme?: Theme;
    additionalProperties?: Record<string, any>;
    title?: string;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
}

export interface IConsumeCompositeCardProps {
    adapter: IBaseAdapter;
    theme?: Theme;
    title?: string;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
    additionalProperties?: Record<string, any>;
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

export interface IADTAdapter extends IBaseAdapter {
    getAdtModels?(): AdapterReturnType<ADTAdapterData>;
    getAdtTwins?(modelId: string): AdapterReturnType<ADTAdapterData>;
}

export interface IHierarchyProps {
    data: Record<string, IHierarchyNode>;
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (
        parentNodeId: string,
        childNode: IHierarchyNode
    ) => void;
}

export interface IHierarchyNode {
    name: string;
    id: string;
    parentId?: string;
    nodeData: any; // actual object from adapter result data
    children?: Record<string, IHierarchyNode>;
    isCollapsed?: boolean;
}

export interface IADTModel {
    id: string;
    description: any;
    displayName: Record<string, string>;
    decommissioned: boolean;
    uploadTime: string;
}

export interface IADTwin {
    $dtId: string;
    $etag: string;
    $metadata: {
        $model: string;
        [propertyName: string]: any;
    };
    [propertyName: string]: any;
}
