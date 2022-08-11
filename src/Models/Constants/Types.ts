import {
    DTModel,
    DTwin,
    DTwinRelationship,
    IADTAdapter,
    IKeyValuePairAdapter,
    IAzureResourceGroup,
    ITsiClientChartDataAdapter,
    AzureAccessPermissionRoles
} from '.';
import AdapterResult from '../Classes/AdapterResult';
import {
    IADTModel,
    IADTTwin,
    IAdapterData,
    IHierarchyNode,
    IErrorInfo,
    ICancellablePromise,
    IADTRelationship
} from './Interfaces';

export type AdapterReturnType<T extends IAdapterData> =
    | Promise<AdapterResult<T>>
    | ICancellablePromise<AdapterResult<T>>;

export type AdapterResultParams<T extends IAdapterData> = {
    result: T;
    errorInfo: IErrorInfo;
};

export type AxiosParams = {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    headers?: AxiosObjParam;
    params?: AxiosObjParam;
    data?: AxiosObjParam | string;
};

export type AxiosObjParam = {
    [key: string]: any;
};

export type AdapterState<T extends IAdapterData> = {
    adapterResult: AdapterResult<T>;
    isLoading: boolean;
    isLongPolling: boolean;
    isInitialCall: boolean;
};

export type KeyValuePairData = {
    key: string;
    value: any;
    timestamp?: Date;
};

export type BIMData = {
    bimURL: string;
    bimMetadataURL: string;
};

export type ADTRelationship = {
    relationshipName: string;
    relationshipId: string;
    targetId?: string;
    relationshipLink?: string;
    sourceId?: string;
    targetModel?: string;
    sourceModel?: string;
};

export type TsiClientData = any[];

export type HierarchyData = Record<string, IHierarchyNode>;

export type ADTModelsApiData = {
    value: IADTModel[];
    nextLink: string;
};

export type ADTTwinsApiData = {
    value: IADTTwin[];
    continuationToken?: string;
};

export type CancellablePromise<T> = {
    /** Wrapped promise - throws CancelledPromiseError if cancelled */
    promise: Promise<T>;
    /** Function to cancel promise */
    cancel: () => void;
};

export type UseLongPollParams = {
    /** Function to long poll at set interval */
    callback: () => Promise<any>;
    /** Time between each callback execution */
    pollingIntervalMillis?: number;
    /** Length of time UI pulse state remains true after callback completion - use to indicate updated data */
    pulseTimeoutMillis?: number;
};

export type ImgPropertyPositions = {
    /** Position relative to the left edge, where "100%" is the right edge and "0%" is the left edge*/
    left: string;
    /** Position relative to the top edge, where "100%" is the bottom edge and "0%" is the top edge*/
    top: string;
};

export type AdapterMethodParams = {
    [paramName: string]: any;
};

export type AdapterMethodParamsForGetADTModels = {
    continuationToken?: string;
    shouldIncludeDefinitions?: boolean;
};

export type AdapterMethodParamsForGetADTTwinsByModelId = {
    modelId: string;
    continuationToken?: string;
};

export type AdapterMethodParamsForSearchADTTwins = {
    searchTerm: string;
    shouldSearchByModel: boolean;
    continuationToken?: string;
};

export type AdapterMethodParamsForGetScenes = {
    Id: string;
    continuationToken?: string;
};

export type ADTRelationshipsApiData = {
    value: IADTRelationship[];
    nextLink: string;
};

export type AssetsFromBIMState = {
    models: Array<DTModel>;
    twins: Array<DTwin>;
    relationships: Array<DTwinRelationship>;
    modelCounts: Record<string, number>;
};

export type AdapterTypes =
    | IKeyValuePairAdapter
    | ITsiClientChartDataAdapter
    | IADTAdapter;

export type IIconNames = CardboardIconNames | string;
export type CardboardIconNames =
    | 'Add'
    | 'Chart'
    | 'Color'
    | 'CubeShape'
    | 'Database'
    | 'Delete'
    | 'Design'
    | 'Edit'
    | 'Home'
    | 'Info'
    | 'Link'
    | 'LinkedDatabase'
    | 'MapLayers'
    | 'MoreVertical'
    | 'MultiSelect'
    | 'Org'
    | 'ProductVariant'
    | 'Ringer'
    | 'Shapes'
    | 'SpeedHigh'
    | 'View';

export enum DurationUnits {
    milliseconds = 0,
    seconds = 1,
    minutes = 2,
    hours = 3,
    days = 4,
    years = 5
}

export type IConsoleLogFunction = (
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    ...args: unknown[]
) => void;

export type AzureResourceGroupsApiData = {
    value: IAzureResourceGroup[];
    nextLink: string;
};

export type MissingAzureRoleDefinitionAssignments = {
    enforced?: Array<AzureAccessPermissionRoles>;
    alternated?: Array<AzureAccessPermissionRoles>;
};
