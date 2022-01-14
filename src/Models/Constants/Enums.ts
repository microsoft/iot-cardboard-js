export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Explorer = 'explorer'
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
    UnknownError = 'UnknownError'
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
    SceneTwinList,
    TwinBindingsWithScene
}

export enum ADT3DSceneBuilderMode {
    ElementsIdle,
    BehaviorIdle,
    CreateElement,
    EditElement,
    CreateBehavior,
    EditBehavior
}

export enum ADT3DSceneTwinBindingsMode {
    Elements = 'elements',
    Behaviors = 'behaviors'
}

export enum ADT3DScenePageModes {
    BuildScene = 'adt-3d-scene-builder-mode-build',
    ViewScene = 'adt-3d-scene-builder-mode-view'
}
