import {
    JsonDiscriminatorProperty,
    JsonDiscriminatorValue,
    JsonElementType,
    JsonObject,
    JsonProperty,
    JsonType
} from 'ta-json';

export class TwinToObjectMapping {
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

    // Note this parameterized constructor
    constructor(
        id: string,
        displayName: string,
        primaryTwinID: string,
        meshIDs: string[],
        twinAliases?: Record<string, unknown>
    ) {
        this.id = id;
        this.displayName = displayName;
        this.primaryTwinID = primaryTwinID;
        this.meshIDs = meshIDs;
        if (twinAliases) {
            this.twinAliases = twinAliases;
        }
    }
}

@JsonObject()
export class Asset {
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

@JsonObject()
@JsonDiscriminatorProperty('type')
export class Datasource {
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

export class Color {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    expression: string;
}

export class ElementIDs {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(String)
    expression: string;
}

export class ControlConfiguration {
    @JsonProperty()
    @JsonElementType(Number)
    valueBreakPoints: number[];
    @JsonProperty()
    @JsonType(String)
    expression: string;
    @JsonProperty()
    @JsonType(String)
    label: string;
}

export class Widget {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(ControlConfiguration)
    controlConfiguration: ControlConfiguration;
}

@JsonObject()
export class Label {
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
@JsonObject()
@JsonDiscriminatorProperty('type')
export class Visual {
    @JsonProperty()
    @JsonType(String)
    type: VisualType;
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

@JsonObject()
export class Behavior {
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

@JsonObject()
export class ViewerConfiguration {
    @JsonProperty()
    @JsonElementType(Scene)
    scenes: Scene[];
    @JsonProperty()
    @JsonElementType(Behavior)
    behaviors: Behavior[];
}

@JsonObject()
export class ScenesConfig {
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
