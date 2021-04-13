import IBaseAdapter from '../../Adapters/IBaseAdapter';
import ADTAdapterData from '../Classes/AdapterDataClasses/ADTAdapterData';
import AdapterResult from '../Classes/AdapterResult';
import { AdapterErrorType, Locale, Theme } from './Enums';
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

export interface IMockAdapter {
    /** If unset, random data is generated, if explicitly set, MockAdapter will use value for mocked data.
     *  To mock empty data, explicitly set { mockData: null }
     */
    mockData?: any;

    /** Mocked network timeout period, defaults to 0ms */
    networkTimeoutMillis?: number;

    /** If set, MockAdapter will mock error of set type */
    mockError?: AdapterErrorType;

    /** Toggles seeding of random data (data remains constants between builds), defaults to true */
    isDataStatic?: boolean;
}

export interface IErrorInfo {
    errors: IAdapterError[];
    catastrophicError: IAdapterError;
}

export interface IADTAdapter extends IBaseAdapter {
    getAdtModels(): AdapterReturnType<ADTAdapterData>;
    getAdtTwins(modelId: string): AdapterReturnType<ADTAdapterData>;
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
    nodeData: any; // actual object from adapter result data
    children?: Record<string, IHierarchyNode>;
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

export interface IResolvedRelationshipClickErrors {
    twinErrors?: any;
    modelErrors?: any;
}
