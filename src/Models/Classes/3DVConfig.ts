export interface ITwinToObjectMapping {
    id: string;
    displayName: string;
    primaryTwinID: string;
    meshIDs: string[];
    twinAliases?: any;
}

export interface IAsset {
    type: string;
    name: string;
    url: string;
}
export interface IScene {
    type: string;
    id: string;
    displayName: string;
    latitude: number;
    longitude: number;
    assets: IAsset[];
    twinToObjectMappings: ITwinToObjectMapping[];
    behaviors: string[];
}

export enum DatasourceType {
    TwinToObjectMapping = 'TwinToObjectMappingDatasource',
    FilteredTwin = 'FilteredTwinDatasource'
}

export interface IDatasource {
    type: DatasourceType;
    mappingIDs?: string[];
    twinFilterQuery?: string;
    messageFilter?: string;
    twinFilterSelector?: string;
}

export interface IColor {
    type: string;
    expression: string;
}

export interface IElementIDs {
    type: string;
    expression: string;
}

export interface IControlConfiguration {
    valueBreakPoints: number[];
    colors: string[];
    expression: string;
    title: string;
    isHorizontal: boolean;
    label: string;
    width: number;
    height: number;
    units: string;
    widgets: IWidget[];
}

export interface IWidget {
    type: string;
    controlConfiguration: IControlConfiguration;
}
export interface ILabel {
    type: string;
    visibleWhen: string;
    expression: string;
}

export enum VisualType {
    ColorChange = 'ColorChange',
    OnClickPopover = 'OnClickPopover',
    Label = 'Label'
}

export interface IVisual {
    type: VisualType;
    title?: string;
    isHorizontal?: boolean;
    elementIDs?: IElementIDs;
    color?: IColor;
    widgets?: IWidget[];
    label?: ILabel;
}

export interface IBehavior {
    id: string;
    type: string;
    layers: string[];
    datasources: IDatasource[];
    visuals: IVisual[];
    twinAliases?: string[];
}

export interface IViewerConfiguration {
    scenes: IScene[];
    behaviors: IBehavior[];
}

export interface IScenesConfig {
    type: string;
    viewerConfiguration: IViewerConfiguration;
}
