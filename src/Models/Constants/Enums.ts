/** Names of themes, mapped value needs to match the scss keys */
export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Explorer = 'explorer',
    Kraken = 'kraken'
}

export enum ViewerModeStyles {
    Default = 'default',
    Transparent = 'transparent',
    Wireframe = 'wireframe'
}

export enum TSIComponentTypes {
    Linechart = 'linechart',
    Barchart = 'barchart'
}

export enum Locale {
    EN = 'en',
    DE = 'de'
}

export enum ComponentErrorType {
    TokenRetrievalFailed = 'TokenRetrievalFailed',
    DataFetchFailed = 'DataFetchFailed',
    DataUploadFailed = 'DataUploadFailed',
    InvalidCardType = 'InvalidCardType',
    ErrorBoundary = 'ErrorBoundary',
    UnknownError = 'UnknownError',
    NonExistentBlob = 'NonExistentBlob',
    UnauthorizedAccess = 'UnauthorizedAccess',
    ReaderAccessOnly = 'ReaderAccessOnly',
    JsonSchemaError = 'JsonSchemaError'
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
    Globe,
    SceneLobby,
    SceneBuilder
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

export enum ADT3DSceneTwinBindingsMode {
    Elements = 'elements',
    Behaviors = 'behaviors'
}

export enum ADT3DScenePageModes {
    BuildScene = 'adt-3d-scene-builder-mode-build',
    ViewScene = 'adt-3d-scene-builder-mode-view'
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
