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
    valueBreakPoints?: number[];
    colors?: string[];
    expression?: string;
    title?: string;
    isHorizontal?: boolean;
    label?: string;
    width?: number;
    height?: number;
    units?: string;
    widgets?: IWidget[];
}

export interface IWidget {
    type: WidgetType;
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

export enum WidgetType {
    Gauge = 'Gauge',
    Link = 'Link',
    Trend = 'Trend',
    Panel = 'Panel'
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

export interface IWidgetLibraryItem {
    title: string;
    description: string;
    iconName: string;
    disabled?: boolean;
    data: {
        type: WidgetType;
        controlConfiguration: IControlConfiguration;
    };
}

// Default objects
export const defaultBehavior: IBehavior = {
    id: '',
    type: 'Behavior',
    layers: ['PhysicalProperties'],
    datasources: [],
    visuals: [
        {
            type: VisualType.ColorChange,
            color: {
                type: 'BindingExpression',
                expression: ''
            },
            elementIDs: {
                type: 'MeshIDArray',
                expression: 'meshIDs'
            },
            label: null,
            isHorizontal: false,
            title: '',
            widgets: []
        }
    ],
    twinAliases: []
};

export const defaultOnClickPopover: IVisual = {
    type: VisualType.OnClickPopover,
    title: '',
    widgets: [],
    elementIDs: {
        type: 'MeshIDArray',
        expression: 'meshIDs'
    }
};

export const defaultGaugeWidget: IWidget = {
    type: WidgetType.Gauge,
    controlConfiguration: {
        valueBreakPoints: [],
        units: '',
        colors: [],
        expression: '',
        label: ''
    }
};

export const defaultLinkWidget: IWidget = {
    type: WidgetType.Link,
    controlConfiguration: {
        expression: ''
    }
};
