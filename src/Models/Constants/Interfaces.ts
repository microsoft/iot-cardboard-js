import {
    ADTModelData,
    ADTRelationshipData,
    ADTTwinData,
    KeyValuePairAdapterData,
    SearchSpan,
    TsiClientAdapterData
} from '../Classes';
import {
    ADTAdapterModelsData,
    ADTAdapterTwinsData
} from '../Classes/AdapterDataClasses/ADTAdapterData';
import {
    StandardModelData,
    StandardModelIndexData,
    StandardModelSearchData
} from '../Classes/AdapterDataClasses/StandardModelData';
import ADTTwinLookupData from '../Classes/AdapterDataClasses/ADTTwinLookupData';
import AdapterResult from '../Classes/AdapterResult';
import {
    CardErrorType,
    Locale,
    Theme,
    HierarchyNodeType,
    modelActionType
} from './Enums';
import {
    AdapterReturnType,
    AdapterMethodParams,
    AdapterMethodParamsForGetADTModels,
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins
} from './Types';

export interface IAction {
    type: string;
    payload?: any;
}

export interface IBIMViewerProps {
    bimFilePath: string;
    metadataFilePath: string;
    centeredObject?: string;
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
    adapter: any;
}

export interface IConsumeCardProps extends ICardBaseProps {
    adapter: any;
    id: string;
    properties: readonly string[];
}

export interface IErrorComponentProps {
    errorTitle: string;
    errorContent?: string;
}

export interface IOverlayProps {
    children: React.ReactNode;
    onClose?: () => void;
}

export interface IConsumeCompositeCardProps extends ICardBaseProps {
    adapter?: any;
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
    callAdapter: (params?: AdapterMethodParams) => void;

    /** Cancel adapter method and set the adapter result to null if not explicityly prevented using shouldPreserveResult parameter */
    cancelAdapter: (shouldPreserveResult?: boolean) => void;

    /** Toggles on/off long poll */
    setIsLongPolling: (isLongPolling: boolean) => void;

    /** Indicates long polling state */
    isLongPolling: boolean;

    /** Long polling pulse state for UI */
    pulse: boolean;
}

export interface ICardError {
    /** Text description of the adapter error */
    message?: string;

    /** Classification of error type */
    type?: CardErrorType;

    /** Catastrophic errors stop adapter execution */
    isCatastrophic?: boolean;

    /** Raw error object from catch block */
    rawError?: Error;

    /** Values that can be used in string interpolation when constructing the error message */
    messageParams?: { [key: string]: string };
}

export interface IMockAdapter {
    /** If unset, random data is generated, if explicitly set, MockAdapter will use value for mocked data.
     *  To mock empty data, explicitly set { mockData: null }
     */
    mockData?: any;

    /** Mocked network timeout period, defaults to 0ms */
    networkTimeoutMillis?: number;

    /** If set, MockAdapter will mock error of set type */
    mockError?: CardErrorType;

    /** Toggles seeding of random data (data remains constants between builds), defaults to true */
    isDataStatic?: boolean;
}

export interface IErrorInfo {
    errors: ICardError[];
    catastrophicError: ICardError;
}

export interface IHierarchyProps {
    data: Record<string, IHierarchyNode>;
    searchTermToMark?: string;
    isLoading?: boolean;
    onParentNodeClick?: (node: IHierarchyNode) => void;
    onChildNodeClick?: (
        parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => void;
    noDataText?: string;
    shouldScrollToSelectedNode?: boolean;
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
    isLoading?: boolean;
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
    cb_viewdata?: {
        boardInfo: string;
    };
    [propertyName: string]: any;
}

export interface IADTRelationship {
    $etag: string;
    $relationshipId: string;
    $relationshipName: string;
    $sourceId: string;
    $targetId: string;
    targetModel: string;
}

export interface IGetKeyValuePairsAdditionalParameters
    extends Record<string, any> {
    isTimestampIncluded?: boolean;
}

export interface IResolvedRelationshipClickErrors {
    twinErrors?: any;
    modelErrors?: any;
}

export interface IViewData {
    viewDefinition: string;
    imageSrc: string;
    imagePropertyPositions: string;
}

export interface IEntityInfo {
    id: string;
    properties: any;
    chartDataOptions?: any;
    [key: string]: any;
}

export interface ISearchboxProps {
    className?: string;
    placeholder: string;
    onChange?: (
        event?: React.ChangeEvent<HTMLInputElement>,
        newValue?: string
    ) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
}

export interface ICancellablePromise<T> extends Promise<T> {
    cancel: () => void;
}

export interface IKeyValuePairAdapter {
    getKeyValuePairs(
        id: string,
        properties: readonly string[],
        additionalParameters?: IGetKeyValuePairsAdditionalParameters
    ): AdapterReturnType<KeyValuePairAdapterData>;
}

export interface ITsiClientChartDataAdapter {
    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: readonly string[],
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<TsiClientAdapterData>;
}

export interface IADTAdapter extends IKeyValuePairAdapter {
    getADTModels(
        params: AdapterMethodParamsForGetADTModels
    ): AdapterReturnType<ADTAdapterModelsData>;
    getADTTwinsByModelId(
        params: AdapterMethodParamsForGetADTTwinsByModelId
    ): AdapterReturnType<ADTAdapterTwinsData>;
    searchADTTwins(
        params: AdapterMethodParamsForSearchADTTwins
    ): AdapterReturnType<ADTAdapterTwinsData>;
    getRelationships(id: string): Promise<AdapterResult<ADTRelationshipData>>;
    getADTTwin(twinId: string): Promise<AdapterResult<ADTTwinData>>;
    getADTModel(modelId: string): Promise<AdapterResult<ADTModelData>>;
    lookupADTTwin?(twinId: string): Promise<ADTTwinLookupData>;
}

export interface IBaseStandardModelSearchAdapter {
    CdnUrl: string;
    getModelSearchIndex(): AdapterReturnType<StandardModelIndexData>;
    fetchModelJsonFromCDN(
        dtmi: string,
        actionType: modelActionType
    ): AdapterReturnType<StandardModelData>;
}

export interface IModelSearchStringParams {
    queryString: string;
    pageIdx?: number;
    modelIndex: Record<string, any>;
}
export interface IStandardModelSearchAdapter
    extends IBaseStandardModelSearchAdapter {
    githubRepo?: string;
    searchString(
        params: IModelSearchStringParams
    ): AdapterReturnType<StandardModelSearchData>;
}

export interface IStandardModelSearchItem {
    dtmi: string;
    displayName?: string;
    description?: string;
}

export interface IStandardModelSearchResult {
    data: IStandardModelSearchItem[];
    metadata?: { [key: string]: any };
}

export interface IStandardModelIndexData {
    modelSearchStringIndex: string[];
    modelSearchIndexObj: Record<string, any>;
}
