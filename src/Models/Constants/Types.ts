import {
    DTModel,
    DTwin,
    DTwinRelationship,
    IADTAdapter,
    IKeyValuePairAdapter,
    AzureAccessPermissionRoles,
    AzureResourceTypes,
    ADXTableColumns
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

export type ADXTimeSeriesTableRow = {
    timestamp: string;
    id: string;
    key: string;
    value: number;
};

export type TimeSeriesData = { timestamp: string | number; value: number };

export type ADXTimeSeries = {
    seriesId: string;
    id: string;
    key: string; // ADX "Key" column for property name, can be nested
    data: Array<TimeSeriesData>;
};

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
    searchProperty: string;
    searchTerm: string;
    shouldSearchByModel: boolean;
    continuationToken?: string;
};

export type AdapterMethodParamsForSearchTwinsByQuery = {
    query: string;
};

export type AdapterMethodParamsForGetTwinsByQuery = {
    query: string;
    continuationToken?: string;
};

export type AdapterMethodParamsForGetScenes = {
    Id: string;
    continuationToken?: string;
};

export type AdapterMethodParamsForJobs = {
    jobId: string;
};

export type AdapterCreateJobArgs = {
    outputBlobUri: string;
    inputBlobUri: string;
    jobId: string;
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

export type AdapterTypes = IKeyValuePairAdapter | IADTAdapter;

export type IIconNames = CardboardIconNames | string;
export type CardboardIconNames =
    | 'Add'
    | 'Chart'
    | 'Color'
    | 'CubeShape'
    | 'Database'
    | 'Delete'
    | 'DeveloperTools'
    | 'Design'
    | 'Edit'
    | 'EntryView'
    | 'Home'
    | 'Info'
    | 'Link'
    | 'LinkedDatabase'
    | 'MapLayers'
    | 'MoreVertical'
    | 'MultiSelect'
    | 'NumberField'
    | 'Org'
    | 'ProductVariant'
    | 'Ringer'
    | 'Search'
    | 'Shapes'
    | 'SpeedHigh'
    | 'View';

export type OatIconNames =
    | 'BufferTimeBefore'
    | 'BulletedList2'
    | 'Calendar'
    | 'Clock'
    | 'Code'
    | 'CubeShape'
    | 'DateTime'
    | 'DocumentManagement'
    | 'Down'
    | 'GroupList'
    | 'Permission'
    | 'TextField'
    | 'ToggleRight'
    | 'Up'
    | 'UpgradeAnalysis';

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

export type AzureAccessPermissionRoleGroups = {
    enforced: Array<AzureAccessPermissionRoles>; // roles must exist/required (and)
    interchangeables: Array<Array<AzureAccessPermissionRoles>>; // within each group one or the other role has to exist (either/or)
};

/** AdapterMethodParamsForGetAzureResources is used for setting the paramter for the getResources method in AzureManagementAdapter
 * @param resourceType set the type to get the resources of that type
 * @param searchParams parameters used for get resources requests agains the management API
 * @param resourceProviderEndpoint if provided, the Azure Management API is going to only make call against this provider endpoint, otherwise will use predefined mapping based on passed resource type
 * @param userData used for making requests against management API for getting subscriptions or checking role assignments for the logged in user
 */
export type AdapterMethodParamsForGetAzureResources = {
    resourceType: AzureResourceTypes;
    searchParams?: AzureResourceSearchParams;
    resourceProviderEndpoint?: string;
    userData?: {
        uniqueObjectId: string;
    };
};

/** AzureResourceSearchParams is used for handling get resources requests in resource picker component.
 * @param take the number of resources to return to limit the number of following requests to check the permission against, but drawback of this approach is that the taken bucket of resources may not be the ones that user has required permissions
 * @param filter used to filter resources based on AzureResourceDisplayFields
 * @param additionalParams is for resource specific params (e.g storageAccountId or storageAccountBlobUrl for fetching StorageBlobContainer resource type via storage accounts) to limit the number of requests for performance
 * @param isAdditionalParamsRequired is used as a secondary gate to enforce the presence of additionaParams to make getResources call which might take long time
 */
export type AzureResourceSearchParams = { take?: number; filter?: string } & (
    | AzureResourceSearchParamsWithAdditionalParams
    | AzureResourceSearchParamsWithoutAdditionalParams
);

export type AzureResourceSearchParamsWithAdditionalParams = {
    isAdditionalParamsRequired: true;
    additionalParams: {
        storageAccountId?: string;
        storageAccountBlobUrl?: string;
        [key: string]: any;
    };
};

export type AzureResourceSearchParamsWithoutAdditionalParams = {
    isAdditionalParamsRequired?: false;
    additionalParams?: never;
};

/** AzureResourceFetchParamsForResourceGraph consists of parameters used during fetching Azure resources via resource graphs REST API (e.g. for ADT Instances and Storage Accounts type resources).
 * @param type used to set where clause in resource graphy query payload
 * @param skipToken continuation token for pagination in resource graph calls
 * @param limit used in the query payload to set the number of data return in resource graph call
 * @param query partial where clauses to add to the query payload for Resources table
 *  */
export type AzureResourceFetchParamsForResourceGraph = {
    type: AzureResourceTypes;
    skipToken?: string;
    limit?: number;
    query?: string;
};

/** AzureResourceFetchParamsForResourceProvider consists of parameters used during fetching Azure resources via resource provider service.
 * @param url resource provider endpoint
 * @param apiVersion api version to be used in request
 * @param filter string is used in request parameter
 * @param nextLink a full url which includes all the parameters necessary for the next page call if there is pagination in response
 */
export type AzureResourceFetchParamsForResourceProvider = {
    url: string;
    apiVersion: string;
    filter?: string;
    nextLink?: string;
};

/** AzureResourceFetchParams consists of parameters used during fetching Azure resources via resource graphs api or resource provider services. */
export type AzureResourceFetchParams =
    | AzureResourceFetchParamsForResourceGraph
    | AzureResourceFetchParamsForResourceProvider;

export type ADXTable = {
    Rows: Array<Array<string | number>>;
    Columns: Array<{
        ColumnName: ADXTableColumns;
        ColumnType: 'string' | 'datetime' | 'dynamic';
    }>;
    FrameType: 'DataTable';
    TableKind: 'PrimaryResult';
    [additionalProperty: string]: any;
};
