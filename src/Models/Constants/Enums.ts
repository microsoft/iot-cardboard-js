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
    InternalServerError = 'InternalServerError',
    CORSError = 'CORSError',
    NoContainerUrl = 'NoContainerUrl',
    NoADTInstanceUrl = 'NoADTInstanceUrl'
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

/** we can extend this list as needed */
export enum AzureResourceProviderEndpoints {
    ADT = 'Microsoft.DigitalTwins/digitalTwinsInstances',
    Storage = 'Microsoft.Storage/storageAccounts'
}

/** we can extend this list as needed */
export enum AzureResourceTypes {
    ADT = 'Microsoft.DigitalTwins/digitalTwinsInstances',
    Container = 'Microsoft.Storage/storageAccounts/blobServices/containers',
    ResourceGroups = 'Microsoft.Resources/resourceGroups',
    RoleAssignments = 'Microsoft.Authorization/roleAssignments',
    StorageAccounts = 'Microsoft.Storage/storageAccounts',
    BlobServices = 'Microsoft.Storage/storageAccounts/blobServices'
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
