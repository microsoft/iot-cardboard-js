import {
    JsonDiscriminatorProperty,
    JsonDiscriminatorValue,
    JsonElementType,
    JsonObject,
    JsonProperty,
    JsonType
} from 'ta-json';

export interface ITwinToObjectMapping {
    id: string;
    displayName: string;
    primaryTwinID: string;
    meshIDs: string[];
    twinAliases: any;
}
export class TwinToObjectMapping implements ITwinToObjectMapping {
    @JsonProperty()
    @JsonType(String)
    id: string;
    @JsonProperty()
    @JsonType(String)
    displayName: string;
    @JsonProperty()
    @JsonType(String)
    primaryTwinID: string;
    @JsonProperty()
    @JsonElementType(String)
    meshIDs: string[];
    @JsonProperty()
    @JsonType(Object)
    twinAliases: any;
}

export interface IAsset {
    type: string;
    name: string;
    url: string;
}

@JsonObject()
export class Asset implements IAsset {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    name: string;
    @JsonProperty()
    @JsonType(String)
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

@JsonObject()
export class Scene {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    id: string;
    @JsonProperty()
    @JsonType(String)
    displayName: string;
    @JsonProperty()
    @JsonType(Number)
    latitude: number;
    @JsonProperty()
    @JsonType(Number)
    longitude: number;
    @JsonProperty()
    @JsonElementType(Asset)
    assets: Asset[];
    @JsonProperty()
    @JsonElementType(TwinToObjectMapping)
    twinToObjectMappings: TwinToObjectMapping[];
    @JsonProperty()
    @JsonElementType(String)
    behaviors: string[];
}

export enum DatasourceType {
    TwinToObjectMapping = 'TwinToObjectMappingDatasource',
    FilteredTwin = 'FilteredTwinDatasource'
}

export interface IDatasource {
    type: DatasourceType;
    mappingIDs: string[];
    twinFilterQuery: string;
    messageFilter: string;
    twinFilterSelector: string;
}

@JsonObject()
@JsonDiscriminatorProperty('type')
export class Datasource implements IDatasource {
    @JsonProperty()
    @JsonType(String)
    type: DatasourceType;
    @JsonProperty()
    @JsonElementType(String)
    mappingIDs: string[];
    @JsonProperty()
    @JsonType(String)
    twinFilterQuery: string;
    @JsonProperty()
    @JsonType(String)
    messageFilter: string;
    @JsonProperty()
    @JsonType(String)
    twinFilterSelector: string;
}

export interface IColor {
    type: string;
    expression: string;
}
export class Color implements IColor {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    expression: string;
}

export interface IElementIDs {
    type: string;
    expression: string;
}
export class ElementIDs implements IElementIDs {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    expression: string;
}

export interface IControlConfiguration {
    valueBreakPoints: number[];
    colors: string[];
    expression: string;
    label: string;
    width: number;
    height: number;
    units: string;
}

export class ControlConfiguration implements IControlConfiguration {
    @JsonProperty()
    @JsonElementType(Number)
    valueBreakPoints: number[];
    @JsonProperty()
    @JsonElementType(String)
    colors: string[];
    @JsonProperty()
    @JsonType(String)
    expression: string;
    @JsonProperty()
    @JsonType(String)
    title: string;
    @JsonProperty()
    @JsonType(Boolean)
    isHorizontal: boolean;
    @JsonProperty()
    @JsonType(String)
    label: string;
    @JsonProperty()
    @JsonType(Number)
    width: number;
    @JsonProperty()
    @JsonType(Number)
    height: number;
    @JsonProperty()
    @JsonType(String)
    units: string;
    @JsonProperty()
    @JsonElementType(Object) // Can't use Widget as its not defined yet
    widgets: Widget[];
}

export interface IWidget {
    type: string;
    controlConfiguration: IControlConfiguration;
}

export class Widget implements IWidget {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(ControlConfiguration)
    controlConfiguration: ControlConfiguration;
}

export interface ILabel {
    type: string;
    visibleWhen: string;
    expression: string;
}
@JsonObject()
export class Label implements ILabel {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    visibleWhen: string;
    @JsonProperty()
    @JsonType(String)
    expression: string;
}

export enum VisualType {
    ColorChange = 'ColorChange',
    OnClickPopover = 'OnClickPopover',
    Label = 'Label'
}

export interface IVisual {
    type: VisualType;
    title: string;
    elementIDs: IElementIDs;
    color: IColor;
    widgets: IWidget[];
    label: ILabel;
}
@JsonObject()
@JsonDiscriminatorProperty('type')
export class Visual implements IVisual {
    @JsonProperty()
    @JsonType(String)
    type: VisualType;
    @JsonProperty()
    @JsonType(String)
    title: string;
    @JsonProperty()
    @JsonType(Boolean)
    isHorizontal: boolean;
    @JsonProperty()
    @JsonType(ElementIDs)
    elementIDs: ElementIDs;
    @JsonProperty()
    @JsonType(Color)
    color: Color;
    @JsonProperty()
    @JsonElementType(Widget)
    widgets: Widget[];
    @JsonProperty()
    @JsonType(Label)
    label: Label;
}

export interface IBehavior {
    id: string;
    type: string;
    layers: string[];
    datasources: IDatasource[];
    visuals: IVisual[];
    twinAliases: string[];
}
@JsonObject()
export class Behavior implements IBehavior {
    constructor({
        id,
        type,
        layers,
        datasources,
        visuals,
        twinAliases
    }: {
        id: string;
        type: string;
        layers: string[];
        datasources: Datasource[];
        visuals: Visual[];
        twinAliases: string[];
    }) {
        this.id = id;
        this.type = type;
        this.layers = layers;
        this.datasources = datasources;
        this.visuals = visuals;
        this.twinAliases = twinAliases;
    }

    @JsonProperty()
    @JsonType(String)
    id: string;
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonElementType(String)
    layers: string[];
    @JsonProperty()
    @JsonType(Datasource)
    datasources: Datasource[];
    @JsonProperty()
    @JsonElementType(Visual)
    visuals: Visual[];
    @JsonProperty()
    @JsonType(String)
    twinAliases: string[];
}

export interface IViewerConfiguration {
    scenes: IScene[];
    behaviors: IBehavior[];
}
@JsonObject()
export class ViewerConfiguration implements IViewerConfiguration {
    @JsonProperty()
    @JsonElementType(Scene)
    scenes: Scene[];
    @JsonProperty()
    @JsonElementType(Behavior)
    behaviors: Behavior[];
}

export interface IScenesConfig {
    type: string;
    viewerConfiguration: IViewerConfiguration;
}
@JsonObject()
export class ScenesConfig implements IScenesConfig {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(ViewerConfiguration)
    viewerConfiguration: ViewerConfiguration;
}

// Discriminators using enums were not working based on the example, keeping these classes around in case we can solve it
// In the meantime properties of the subclasses are just applied to the base class, and consumers can make switch statements based
// on "type"
JsonObject();
JsonDiscriminatorValue(DatasourceType.TwinToObjectMapping);
export class TwinToObjectMappingDatasource extends Datasource {
    constructor() {
        super();
        this.type = DatasourceType.TwinToObjectMapping;
    }
    @JsonProperty()
    @JsonElementType(String)
    mappingIDs: string[];
}

JsonObject();
JsonDiscriminatorValue(DatasourceType.FilteredTwin);
export class FilteredTwinDatasource extends Datasource {
    constructor() {
        super();
        this.type = DatasourceType.FilteredTwin;
    }
    @JsonProperty()
    @JsonType(String)
    twinFilterQuery: string;
    @JsonProperty()
    @JsonType(String)
    messageFilter: string;
    @JsonProperty()
    @JsonType(String)
    twinFilterSelector: string;
}

JsonObject();
JsonDiscriminatorValue(VisualType.ColorChange);
export class ColorChangeVisual extends Visual {
    constructor() {
        super();
        this.type = VisualType.ColorChange;
    }
    @JsonProperty()
    @JsonType(Color)
    color: Color;
}

JsonObject();
JsonDiscriminatorValue(VisualType.OnClickPopover);
export class OnClickPopoverVisual extends Visual {
    constructor() {
        super();
        this.type = VisualType.OnClickPopover;
    }
    @JsonProperty()
    @JsonElementType(Widget)
    widgets: Widget[];
}

JsonObject();
JsonDiscriminatorValue(VisualType.Label);
export class LabelVisual extends Visual {
    constructor() {
        super();
        this.type = VisualType.Label;
    }
    @JsonProperty()
    @JsonType(Label)
    label: Label;
}
