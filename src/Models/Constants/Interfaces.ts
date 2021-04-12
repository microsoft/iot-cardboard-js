import IBaseAdapter from '../../Adapters/IBaseAdapter';
import ADTAdapterData from '../Classes/AdapterDataClasses/ADTAdapterData';
import AdapterResult from '../Classes/AdapterResult';
import { HierarchyNodeType, Locale, Theme } from './Enums';
import { AdapterReturnType } from './Types';

export interface IAction {
    type: string;
    payload?: any;
}

export interface ITSIChartComponentProps {
    data: any[];
    chartOptions?: any;
    chartDataOptions?: any[];
}

export interface ICardBaseProps {
    title?: string;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    adapterAdditionalParameters?: Record<string, any>;
}
export interface IStandaloneConsumeCardProps extends ICardBaseProps {
    adapter: IBaseAdapter;
}

export interface IConsumeCardProps extends ICardBaseProps {
    adapter: IBaseAdapter;
    id: string;
    properties: readonly string[];
}

export interface IConsumeCompositeCardProps extends ICardBaseProps {
    adapter?: IBaseAdapter; // if all the inner cards are all going to use the same adapter
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
    callAdapter: (params?: any) => void;

    /** Toggles on/off long poll */
    setIsLongPolling: (isLongPolling: boolean) => void;

    /** Indicates long polling state */
    isLongPolling: boolean;

    /** Long polling pulse state for UI */
    pulse: boolean;
}

export interface IADTAdapter extends IBaseAdapter {
    getAdtModels(nextLink: string | null): AdapterReturnType<ADTAdapterData>;
    getAdtTwins(
        modelId: string,
        continuationToken: string | null
    ): AdapterReturnType<ADTAdapterData>;
}

export interface IHierarchyProps {
    data: Record<string, IHierarchyNode>;
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (
        parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => void;
}

export interface IHierarchyNode {
    name: string;
    id: string;
    parentNode?: IHierarchyNode;
    nodeData: any; // original object from adapter result data
    nodeType: HierarchyNodeType;
    children?: Record<string, IHierarchyNode>;
    childrenContinuationToken?: string | null;
    onNodeClick?: (node?: IHierarchyNode) => void;
    isCollapsed?: boolean;
    isSelected?: boolean;
}

export interface IADTModel {
    id: string;
    description: any;
    displayName: Record<string, string>;
    decommissioned: boolean;
    uploadTime: string;
}

export interface IADTTwin {
    $dtId: string;
    $etag: string;
    $metadata: {
        $model: string;
        [propertyName: string]: any;
    };
    [propertyName: string]: any;
}
export interface IGetKeyValuePairsAdditionalParameters
    extends Record<string, any> {
    isTimestampIncluded?: boolean;
}
