/** Names of themes, mapped value needs to match the scss keys */
export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Explorer = 'explorer',
    Kraken = 'kraken'
}

export enum ViewerObjectStyle {
    Default = 'default',
    Transparent = 'transparent',
    Wireframe = 'wireframe'
}

export enum TSIComponentTypes {
    Linechart = 'linechart',
    Barchart = 'barchart'
}

export enum Locale {
    CS = 'cs',
    DE = 'de',
    EN = 'en',
    ES = 'es',
    FR = 'fr',
    HU = 'hu',
    IT = 'it',
    JA = 'ja',
    KO = 'ko',
    NL = 'nl',
    PL = 'pl',
    PT = 'pt',
    RU = 'ru',
    SV = 'sv',
    TR = 'tr',
    ZH = 'zh'
}

export enum CameraInteraction {
    Free = 'free',
    Pan = 'pan',
    Rotate = 'rotate'
}

export enum ComponentErrorType {
    TokenRetrievalFailed = 'TokenRetrievalFailed',
    DataFetchFailed = 'DataFetchFailed',
    DataUploadFailed = 'DataUploadFailed',
    InvalidCardType = 'InvalidCardType',
    ErrorBoundary = 'ErrorBoundary',
    UnknownError = 'UnknownError',
    BlobNotFound = 'BlobNotFound',
    UnauthorizedAccess = 'UnauthorizedAccess',
    JsonSchemaError = 'JsonSchemaError',
    ModelsRetrievalFailed = 'ModelsRetrievalFailed',
    TwinsRetrievalFailed = 'TwinsRetrievalFailed',
    InternalServerError = 'InternalServerError',
    CORSError = 'CORSError',
    NoContainerUrl = 'NoContainerUrl',
    NoADTInstanceUrl = 'NoADTInstanceUrl',
    ConnectionError = 'ConnectionError',
    BadRequestException = 'BadRequestException',
    TimeSeriesDatabaseConnectionFetchFailed = 'TimeSeriesDatabaseConnectionFetchFailed'
}

export enum ErrorImages {
    AccessRestricted = 'AccessRestrictedError',
    BlobError = 'BlobError'
}

export enum HierarchyNodeType {
    Parent,
    Child,
    ShowMore
}

export enum BIMFileTypes {
    Xkt = 'xkt'
}

export enum CardTypes {
    ADTHierarchyCard = 'ADTHierarchyCard',
    ADTHierarchyWithLKVProcessGraphics = 'ADTHierarchyWithLKVProcessGraphics',
    KeyValuePairCard = 'KeyValuePairCard',
    LineChart = 'LineChart',
    LKVProcessGraphicCard = 'LKVProcessGraphicCard',
    RelationshipsTable = 'RelationshipsTable',
    InfoTable = 'InfoTable'
}

export enum BIMUploadState {
    PreProcessing = 'preProcessing',
    PreUpload = 'preUpload',
    InUpload = 'inUpload',
    PostUpload = 'postUpload'
}

export enum UploadPhase {
    PreUpload = 'preupload',
    Uploading = 'uploading',
    Succeeded = 'succeeded',
    PartiallyFailed = 'partiallyfailed',
    Failed = 'failed'
}

export enum modelActionType {
    select = 'select',
    preview = 'preview'
}

export enum TwinLookupStatus {
    Idle,
    Ready,
    Started,
    ReadyToLocate,
    Finished
}

export enum FormMode {
    New,
    Edit,
    Readonly
}

export enum PropertyInspectorPatchMode {
    twin,
    relationship
}

export enum AssetTypes {
    Models = 'models',
    Twins = 'twins',
    Relationships = 'relationships'
}

export enum FileUploadStatus {
    Uploading = 'uploading',
    Uploaded = 'uploaded'
}

export enum ModelAuthoringModes {
    UploadFiles,
    FromTemplate,
    BuildForm
}

export enum ModelAuthoringSteps {
    SelectType,
    Review,
    Publish
}

export enum ADT3DScenePageSteps {
    Globe = 'Globe',
    SceneList = 'SceneList',
    Scene = 'Scene'
}

export enum ADT3DSceneBuilderMode {
    ElementsIdle,
    BehaviorIdle,
    CreateElement,
    EditElement,
    CreateBehavior,
    EditBehavior,
    TargetElements
}

export enum WidgetFormMode {
    CreateWidget = 'CreateWidget',
    EditWidget = 'EditWidget',
    Cancelled = 'Cancelled',
    Committed = 'Committed'
}

export enum VisualRuleFormMode {
    CreateVisualRule = 'CreateVisualRule',
    EditVisualRule = 'EditVisualRule',
    Inactive = 'Inactive'
}

export enum TwinAliasFormMode {
    CreateTwinAlias,
    EditTwinAlias
}

export enum ADT3DSceneTwinBindingsMode {
    Elements = 'elements',
    Behaviors = 'behaviors'
}

export enum ADT3DScenePageModes {
    BuildScene = 'Builder',
    ViewScene = 'Viewer'
}

export enum BehaviorListSegment {
    InThisScene,
    NotInThisScene
}

export enum ADT3DRenderMode {
    Default = 'Default',
    Light = 'Light',
    Blue = 'Blue',
    Gold = 'Gold'
}

export enum ADT3DAddInEventTypes {
    SceneLoaded = 'SceneLoaded',
    MarkerHover = 'MarkerHover',
    MarkerClick = 'MarkerClick'
}

export enum Supported3DFileTypes {
    GLTransmissionFormat = 'gltf',
    GLTransmissionFormatBinary = 'glb'
}

export enum SupportedBlobFileTypes {
    JavaScriptObjectNotation = 'json',
    GLTransmissionFormat = 'gltf',
    GLTransmissionFormatBinary = 'glb'
}

export enum BehaviorModalMode {
    viewer = 'viewer',
    preview = 'preview'
}

export enum GlobeTheme {
    Blue = 'Blue',
    Grey = 'Grey',
    Yellow = 'Yellow'
}

export enum MultiLanguageSelectionType {
    displayName = 'displayName',
    description = 'description'
}

/** expand as necessary, it is also used as provider endpoint based on the values:
 * https://learn.microsoft.com/en-us/azure/governance/resource-graph/reference/supported-tables-resources#resources
 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types and
 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-services-resource-providers
 * */
export enum AzureResourceTypes {
    DigitalTwinInstance = 'Microsoft.DigitalTwins/digitalTwinsInstances',
    StorageAccount = 'Microsoft.Storage/storageAccounts',
    StorageBlobContainer = 'Microsoft.Storage/storageAccounts/blobServices/containers',
    RoleAssignment = 'Microsoft.Authorization/roleAssignments',
    TimeSeriesConnection = 'Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections',
    ResourceGraphs = 'Microsoft.ResourceGraph/resources'
}

/** See details for the following roles here: https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles */
export enum AzureAccessPermissionRoles {
    'Azure Digital Twins Data Reader' = 'd57506d4-4c8d-48b1-8587-93c323f6a5a3',
    'Azure Digital Twins Data Owner' = 'bcd981a7-7f74-457b-83e1-cceb9e632ffe',
    'Storage Blob Data Contributor' = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe', // required to access blob data with credentials
    'Storage Blob Data Owner' = 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b', // required to access blob data with credentials
    'Storage Blob Data Reader' = '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1',
    'Contributor' = 'b24988ac-6180-42a0-ab88-20f7382dd24c',
    'Owner' = '8e3af657-a8ff-443c-a75c-2fe8c4bcb635',
    'Reader' = 'acdd72a7-3385-48ef-bd42-f606fba81ae7' // required to access blob data with credentials
}

/** keyed based on resource types, expand as necessary, based on the resource type docs here https://docs.microsoft.com/en-us/rest/api */
export enum AzureResourcesAPIVersions {
    'Microsoft.DigitalTwins/digitalTwinsInstances' = '2022-05-31',
    'Microsoft.Storage/storageAccounts' = '2021-09-01',
    'Microsoft.Storage/storageAccounts/blobServices/containers' = '2021-09-01',
    'Microsoft.Authorization/roleAssignments' = '2015-07-01',
    'Microsoft.Subscription' = '2020-01-01',
    'Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections' = '2022-05-31',
    'Microsoft.ResourceGraph/resources' = '2021-03-01'
}

/** list of Azure Resource properties to be used as display in combobox list UI */
export enum AzureResourceDisplayFields {
    'id',
    'name',
    'url'
}

export enum ADXTableColumns {
    Id = 'Id', // twin id
    TimeStamp = 'TimeStamp',
    Key = 'Key', // twin property
    Value = 'Value' // value of twin property at that time
}

export enum QuickTimeSpanKey {
    Last15Mins = 'Last 15 mins',
    Last30Mins = 'Last 30 mins',
    LastHour = 'Last hour',
    Last3Hours = 'Last 3 hours',
    Last6Hours = 'Last 6 hours',
    Last12Hours = 'Last 12 hours',
    Last24Hours = 'Last 24 hours',
    Last7Days = 'Last 7 days',
    Last30Days = 'Last 30 days',
    Last60Days = 'Last 60 days',
    Last90Days = 'Last 90 days',
    Last180Days = 'Last 180 days',
    LastYear = 'Last year'
}

export enum AuthTokenTypes {
    'management',
    'adx',
    'adt',
    'storage',
    'powerBI'
}
