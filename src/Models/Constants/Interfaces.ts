import { AbstractMesh, Scene } from '@babylonjs/core';
import {
    ADTModelData,
    ADTRelationshipsData,
    ADTRelationshipData,
    ADTTwinData,
    KeyValuePairAdapterData,
    SearchSpan,
    TsiClientAdapterData
} from '../Classes';
import {
    ADTAdapterModelsData,
    ADTAdapterPatchData,
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
    ComponentErrorType,
    Locale,
    Theme,
    HierarchyNodeType,
    modelActionType,
    FileUploadStatus,
    ADT3DAddInEventTypes,
    GlobeTheme,
    ViewerObjectStyle,
    AzureResourceTypes,
    AzureAccessPermissionRoles
} from './Enums';
import {
    AdapterReturnType,
    AdapterMethodParams,
    AdapterMethodParamsForGetADTModels,
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins,
    AdapterMethodParamsForGetAzureResources,
    AzureAccessPermissionRoleGroups,
    AdapterMethodParamsForSearchTwinsByQuery
} from './Types';
import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName
} from './Constants';
import ExpandedADTModelData from '../Classes/AdapterDataClasses/ExpandedADTModelData';
import {
    AzureResourcesData,
    AzureSubscriptionData
} from '../Classes/AdapterDataClasses/AzureManagementData';
import ADTScenesConfigData from '../Classes/AdapterDataClasses/ADTScenesConfigData';
import ADT3DViewerData from '../Classes/AdapterDataClasses/ADT3DViewerData';
import { AssetProperty } from '../Classes/Simulations/Asset';
import {
    CustomMeshItem,
    ICameraPosition,
    ISceneViewProps,
    Marker,
    SceneVisual
} from '../Classes/SceneView.types';
import { ErrorObject } from 'ajv';
import { StorageBlobsData } from '../Classes/AdapterDataClasses/StorageData';
import {
    I3DScenesConfig,
    IScene
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import { WrapperMode } from '../../Components/3DV/SceneView.types';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlProperty,
    DtdlRelationship
} from './dtdlInterfaces';
import { IStyleFunctionOrObject } from '@fluentui/react';
import { ISceneViewWrapperStyles } from '../../Components/3DV/SceneViewWrapper.types';
import {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Classes/AdapterDataClasses/ADTModelData';
import {
    IADT3DViewerStyleProps,
    IADT3DViewerStyles
} from '../../Components/ADT3DViewer/ADT3DViewer.types';
import { BaseComponentProps } from '../../Components/BaseComponent/BaseComponent.types';
import ADTAdapter from '../../Adapters/ADTAdapter';

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
    errorContent?: string;
    errorTitle?: string;
    errorType?: ComponentErrorType;
}

export interface IErrorButtonAction {
    buttonText: string;
    buttonAction: () => void;
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
    getToken: (
        tokenFor?: 'azureManagement' | 'adx' | 'storage'
    ) => Promise<string>;
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
    callAdapter: (params?: AdapterMethodParams) => Promise<void>;

    /** Cancel adapter method and set the adapter result to null if not explicityly prevented using shouldPreserveResult parameter */
    cancelAdapter: (shouldPreserveResult?: boolean) => void;

    /** Toggles on/off long poll */
    setIsLongPolling: (isLongPolling: boolean) => void;

    /** Indicates long polling state */
    isLongPolling: boolean;

    /** Long polling pulse state for UI */
    pulse: boolean;
}

export interface IComponentError {
    /** Name of the error to be used as title */
    name?: string;

    /** Text description of the error */
    message?: string;

    /** Classification of error type */
    type?: ComponentErrorType;

    /** Catastrophic errors stop adapter execution */
    isCatastrophic?: boolean;

    /** Raw error object from catch block */
    rawError?: Error;

    /** Values that can be used in string interpolation when constructing the error message */
    messageParams?: { [key: string]: string };

    /** Error data from JSON schema validation*/
    jsonSchemaErrors?: ErrorObject[];
}

export interface IMockAdapter {
    /** If unset, random data is generated, if explicitly set, MockAdapter will use value for mocked data.
     *  To mock empty data, explicitly set { mockData: null }
     */
    mockData?: any;

    /** Mocked network timeout period, defaults to 0ms */
    networkTimeoutMillis?: number;

    /** If set, MockAdapter will mock error of set type */
    mockError?: ComponentErrorType;

    /** Toggles seeding of random data (data remains constants between builds), defaults to true */
    isDataStatic?: boolean;
}

export interface IErrorInfo {
    errors: IComponentError[];
    catastrophicError: IComponentError;
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
    isNewlyAdded?: boolean;
}

// START of Azure Management plane interfaces
export interface IAzureResources {
    value: IAzureResource[];
    nextLink?: string;
}

export interface IAzureResource {
    id: string;
    name: string;
    type: AzureResourceTypes;
    [additionalProperty: string]: any;
    properties: Record<string, any>;
    subscriptionName?: string; // additional property we add to keep track of the subscription name in resource information to show in the ResourcePicker dropdown
}
export interface IAzureSubscription
    extends Omit<IAzureResource, 'type' | 'name' | 'properties'> {
    subscriptionId: string;
    tenantId: string;
    displayName: string;
}

export interface IAzureRoleAssignment extends IAzureResource {
    type: AzureResourceTypes.RoleAssignment;
    properties: IAzureRoleAssignmentPropertyData;
}

export interface IADTInstance extends IAzureResource {
    type: AzureResourceTypes.DigitalTwinInstance;
}

export interface IAzureStorageAccount extends IAzureResource {
    type: AzureResourceTypes.StorageAccount;
}

export interface IAzureStorageBlobContainer extends IAzureResource {
    type: AzureResourceTypes.StorageBlobContainer;
}

export interface IAzureRoleAssignmentPropertyData {
    roleDefinitionId: string;
    [additionalProperty: string]: any;
}
// END of Azure Management plane interfaces

export interface IADXConnection {
    kustoClusterUrl: string;
    kustoDatabaseName: string;
    kustoTableName: string;
}

export interface IADTModel {
    id: string;
    description: any;
    displayName: Record<string, string>;
    decommissioned: boolean;
    uploadTime: string;
    model?: IADTModelDefinition;
}

export interface IADTModelDefinition {
    '@type': string;
    '@context': string;
    '@id': string;
    displayName: string;
    description: string;
    comment: string;
    contents?: any[];
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

export interface IADTRelationship {
    $etag: string;
    $relationshipId: string;
    $relationshipName: string;
    $relationshipLink?: string;
    $sourceId?: string;
    $targetId?: string;
    targetModel?: string;
    [property: string]: any;
}

export interface IADTProperty {
    ['@type']: 'Property';
    name: string;
    schema: string | Record<string, any>;
    ['@id']?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    unit?: string;
    writable?: boolean;
}

export interface IADTTwinComponent {
    $metadata: {
        [propertyName: string]: {
            lastUpdateTime: string;
        };
    };
    [propertyName: string]: any; // this can be another component
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

export type IPropertyInspectorAdapter = Pick<
    IADTAdapter,
    | 'getADTTwin'
    | 'getADTRelationship'
    | 'getExpandedAdtModel'
    | 'updateTwin'
    | 'updateRelationship'
>;

export interface IModelledPropertyBuilderAdapter {
    getADTTwin(twinId: string): Promise<AdapterResult<ADTTwinData>>;
    getAllAdtModels(): Promise<AdapterResult<ADTAllModelsData>>;
    getModelIdFromTwinId(
        twinId: string
    ): Promise<AdapterResult<ADTTwinToModelMappingData>>;
}

export type IQueryBuilderAdapter = ADTAdapter | MockAdapter;

export interface IADT3DViewerAdapter {
    getSceneData(
        sceneId: string,
        config: I3DScenesConfig,
        visibleLayerIds?: string[],
        bustCache?: boolean
    ): AdapterReturnType<ADT3DViewerData>;
}

export interface IADTAdapter
    extends IKeyValuePairAdapter,
        IADT3DViewerAdapter,
        IModelledPropertyBuilderAdapter {
    getADTModels(
        params?: AdapterMethodParamsForGetADTModels
    ): AdapterReturnType<ADTAdapterModelsData>;
    getADTTwinsByModelId(
        params: AdapterMethodParamsForGetADTTwinsByModelId
    ): AdapterReturnType<ADTAdapterTwinsData>;
    searchADTTwins(
        params: AdapterMethodParamsForSearchADTTwins
    ): AdapterReturnType<ADTAdapterTwinsData>;
    searchTwinsByQuery(
        params: AdapterMethodParamsForSearchTwinsByQuery
    ): AdapterReturnType<ADTAdapterTwinsData>;
    getRelationships(id: string): Promise<AdapterResult<ADTRelationshipsData>>;
    getADTTwin(twinId: string): Promise<AdapterResult<ADTTwinData>>;
    getADTModel(modelId: string): Promise<AdapterResult<ADTModelData>>;
    lookupADTTwin?(twinId: string): Promise<ADTTwinLookupData>;
    getADTRelationship(
        twinId: string,
        relationshipId: string
    ): AdapterReturnType<ADTRelationshipData>;
    createADTModels(models: DTModel[]): AdapterReturnType<ADTAdapterModelsData>;
    deleteADTModel(id: string): AdapterReturnType<ADTModelData>;
    deleteADTTwin(id: string): AdapterReturnType<ADTTwinData>;
    createModels(models: DTModel[]): any;
    createTwins(twins: DTwin[], onUploadProgress?): any;
    createRelationships(
        relationships: DTwinRelationship[],
        onUploadProgress?
    ): any;
    getExpandedAdtModel(
        modelId: string,
        baseModelIds?: string[]
    ): AdapterReturnType<ExpandedADTModelData>;
    updateTwin(
        twinId: string,
        patches: Array<ADTPatch>
    ): AdapterReturnType<ADTAdapterPatchData>;
    updateRelationship(
        twinId: string,
        relationshipId: string,
        patches: Array<ADTPatch>
    ): AdapterReturnType<ADTAdapterPatchData>;
    getIncomingRelationships(
        twinId: string
    ): Promise<AdapterResult<ADTRelationshipsData>>;
}

export interface IAzureManagementAdapter {
    getSubscriptions: () => AdapterReturnType<AzureSubscriptionData>;
    getRoleAssignments: (
        resourceId: string,
        uniqueObjectId: string
    ) => AdapterReturnType<AzureResourcesData>;
    hasRoleDefinitions: (
        resourceId: string,
        uniqueObjectId: string,
        accessRolesToCheck: AzureAccessPermissionRoleGroups
    ) => Promise<boolean>;
    getResources: (
        params: AdapterMethodParamsForGetAzureResources
    ) => AdapterReturnType<AzureResourcesData>;
    getResourcesByPermissions: (params: {
        getResourcesParams: AdapterMethodParamsForGetAzureResources;
        requiredAccessRoles: AzureAccessPermissionRoleGroups;
    }) => AdapterReturnType<AzureResourcesData>;
    assignRole: (
        roleId: AzureAccessPermissionRoles,
        resourceId: string, // scope
        uniqueObjectId: string
    ) => AdapterReturnType<AzureResourcesData>;
}

export interface IBlobAdapter {
    getBlobContainerURL: () => string;
    setBlobContainerPath: (configBlobPath: string) => void;
    getScenesConfig: () => AdapterReturnType<ADTScenesConfigData>;
    putScenesConfig: (
        config: I3DScenesConfig
    ) => AdapterReturnType<ADTScenesConfigData>;
    getContainerBlobs: (
        fileTypes?: Array<string>
    ) => AdapterReturnType<StorageBlobsData>;
    putBlob: (file: File) => AdapterReturnType<StorageBlobsData>;
    resetSceneConfig(): AdapterReturnType<ADTScenesConfigData>;
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

export interface DTwinUpdateEvent {
    dtId: string;
    patchJSON: ADTPatch[];
}

export interface ADTPatch {
    op: 'add' | 'replace' | 'remove';
    path: string; // property path e.g. /property1
    value?: any;
}

export interface SimulationParams {
    daysToSimulate: number;
    dataSpacing: number;
    liveStreamFrequency: number;
    quickStreamFrequency: number;
    isLiveDataSimulated: boolean;
}

export type IADTModelImages = {
    [modelId: string]: IADTModelImageContent;
};

export interface IADTModelImageContent {
    [ADTModel_ImgSrc_PropertyName]: string;
    [ADTModel_ImgPropertyPositions_PropertyName]: Record<string, any>;
}

export interface AssetRelationship {
    name: string;
    target?: string;
    targetModel?: string;
}

export interface AssetTwin {
    name: string;
    assetRelationships?: Array<AssetRelationship>;
    properties: Array<AssetProperty<any>>;
}

export interface IAssetProperty<T> {
    id: string;
    propertyName: string;
    currentValue: T;
    getNextValue: (currentValue: T) => T;
    schema?: string; // ADT schema for the property
}

export interface DTModelContent {
    '@type':
        | 'Property'
        | 'Relationship'
        | 'Telemetry'
        | 'Command'
        | 'Component'
        | readonly [string, string];
    name: string;
    schema: string | Record<string, any>;
    [propertyName: string]: any;
}

export interface DTModel {
    '@id': string;
    '@type': string | readonly [string, string];
    '@context': string | readonly [string];
    displayName?: string;
    contents?: readonly DTModelContent[];
    description?: string;
    comment?: string;
}

export interface DTwin {
    $dtId: string;
    $metadata: {
        $model: string;
        [propertyName: string]: any;
    };
    [propertyName: string]: any;
}

export interface DTwinRelationship {
    $relId: string;
    $dtId: string;
    $targetId: string;
    $name: string;
    targetModel?: string;
}

export interface IAdtPusherSimulation {
    seedTimeMillis: number;
    tick(): Array<any>;
    generateDTModels(
        isImagesIncluded?: boolean,
        download?: boolean
    ): Array<DTModel>;
    generateDTwins(
        isImagesIncluded?: boolean,
        download?: boolean
    ): Array<DTwin>;
    generateTwinRelationships(): Array<DTwinRelationship>;
}

export enum AdtPusherSimulationType {
    DairyProduction = 'dairyProduction',
    RobotArms = 'robotArms'
}

export interface IGenerateADTAssetsProps {
    adapter: IADTAdapter;
    models: readonly DTModel[];
    twins: readonly DTwin[];
    relationships: readonly DTwinRelationship[];
    triggerUpload: boolean;
    onComplete(models, twins, relationships): void;
}

export interface IJSONUploaderProps {
    onFileListChanged?: (files: Array<File>) => void;
    existingFiles?: Array<File>;
}

export interface IJSONUploaderFileItem {
    name: string;
    size: string;
    content?: JSON | Error;
    status: FileUploadStatus;
}

export interface IADTInstancesProps {
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    adapter: ADT3DSceneAdapter;
    hasLabel?: boolean;
    selectedInstance?: string;
    onInstanceChange?: (instanceHostName: string) => void;
}
export interface IADT3DGlobeProps {
    adapter: IBlobAdapter | MockAdapter;
    title?: string;
    onSceneClick?: (scene: IScene) => void;
    globeTheme?: GlobeTheme;
}

export class ADT3DAddInEventData {
    eventType: ADT3DAddInEventTypes;
    config: I3DScenesConfig;
    sceneId: string;
    adapter: IADT3DViewerAdapter;
    sceneVisuals?: SceneVisual[];
    marker: Marker;
    mesh: AbstractMesh;
    scene: Scene;
    pointerEvent: PointerEvent;
}

export interface IADT3DAddInProps {
    onSceneLoaded?: (data: ADT3DAddInEventData) => boolean;
    onMeshClick?: (data: ADT3DAddInEventData) => boolean;
    onMeshHover?: (data: ADT3DAddInEventData) => boolean;
    onCameraMove?: (position: ICameraPosition) => void;
}

export interface ISceneViewWrapperProps {
    config?: I3DScenesConfig;
    sceneId?: string;
    adapter?: IADT3DViewerAdapter;
    sceneViewProps: ISceneViewProps;
    sceneVisuals?: SceneVisual[];
    addInProps?: IADT3DAddInProps;
    selectedVisual?: Partial<SceneVisual>;
    objectColorUpdated?: (objectColor: IADTObjectColor) => void;
    wrapperMode: WrapperMode;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, ISceneViewWrapperStyles>;
}

export interface IADT3DViewerProps extends BaseComponentProps {
    adapter:
        | IADT3DViewerAdapter
        | (IADT3DViewerAdapter & IPropertyInspectorAdapter);
    sceneId: string;
    scenesConfig: I3DScenesConfig;
    title?: string;
    connectionLineColor?: string;
    enableMeshSelection?: boolean;
    addInProps?: IADT3DAddInProps;
    refetchConfig?: () => any;
    showMeshesOnHover?: boolean;
    showHoverOnSelected?: boolean;
    coloredMeshItems?: CustomMeshItem[];
    /**
     * Ids of the elements to zoom the camera to focus on
     */
    zoomToElementId?: string;
    unzoomedMeshOpacity?: number;
    hideViewModePickerUI?: boolean;
    hideElementsPanel?: boolean;
    outlinedMeshItems?: CustomMeshItem[];
    /** show the toggle to switch between builder & viewer modes */
    showModeToggle?: boolean;
    sceneViewProps?: ISceneViewProps;
    selectedLayerIds?: string[];
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IADT3DViewerStyleProps, IADT3DViewerStyles>;
}

export interface ISceneViewerThemeCache {
    backgroundKey: string;
    objectColorKey: string;
    objectStyle: ViewerObjectStyle;
}

export interface IADTObjectColor {
    color: string;
    baseColor: string;
    lightingStyle: number;
    reflectionTexture?: string;
    coloredMeshColor: string;
    meshHoverColor: string;
    coloredMeshHoverColor: string;
    outlinedMeshHoverColor: string;
    outlinedMeshSelectedColor: string;
    outlinedMeshHoverSelectedColor: string;
}

export interface IADTBackgroundColor {
    color: string;
    badgeColor: string;
    defaultBadgeColor: string;
    defaultBadgeTextColor: string;
    aggregateBadgeColor: string;
    aggregateBadgeTextColor: string;
    objectLuminanceRatio?: number;
}

export interface IStorageBlob {
    Name: string;
    Path: string;
    Properties: Record<string, any>;
}

export interface IOATGraphCustomNodeProps extends IOATNodeElement {
    isConnectable: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOATGraphCustomEdgeProps extends IOATRelationshipElement {}

export interface IAliasedTwinProperty {
    alias: 'PrimaryTwin' | string;
    property: string;
}

export interface ILanguageOption {
    key: string;
}

export interface DTDLPropertySchema {
    '@type': string;
    fields?: Record<string, any>[];
    enumValues?: DTDLPropertyEnumValue[];
    mapKey?: Record<string, any>;
    mapValue?: Record<string, any>;
    valueSchema?: string;
}
export interface DTDLPropertyEnumValue {
    displayName?: string | Record<string, unknown>;
    '@id'?: string;
    name: string;
    enumValue: string;
    description?: string;
    comment?: string;
}

export interface IOATNodeElement {
    id: string;
    data?: DtdlInterface;
    position?: IOATNodePosition;
    type?: string;
}

export interface IOATNodePosition {
    x: number;
    y: number;
}

export interface IOATRelationshipElement {
    id: string;
    label?: string;
    markerEnd?: string;
    source: string;
    sourceHandle?: string;
    target: string;
    targetHandle?: string;
    type?: string;
    data?: DtdlRelationship | DtdlInterfaceContent;
}

export interface IOATLastPropertyFocused {
    item: DtdlProperty;
    index: number;
}

export interface IOATProperty {
    id: string;
    displayName: string;
    index: number;
}
export interface IBlobServiceCorsRule {
    AllowedOrigins: Array<string>;
    AllowedMethods: Array<string>;
    AllowedHeaders?: Array<string>;
    ExposedHeaders?: Array<string>;
    MaxAgeInSeconds: number;
}
