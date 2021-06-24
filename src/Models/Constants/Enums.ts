export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

export enum TSIComponentTypes {
    Linechart = 'linechart',
    Barchart = 'barchart'
}

export enum Locale {
    EN = 'en',
    DE = 'de'
}

export enum CardErrorType {
    TokenRetrievalFailed = 'TokenRetrievalFailed',
    DataFetchFailed = 'DataFetchFailed',
    InvalidCardType = 'InvalidCardType',
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
