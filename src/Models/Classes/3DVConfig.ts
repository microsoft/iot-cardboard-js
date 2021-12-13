import { JsonElementType, JsonObject, JsonProperty, JsonType } from 'ta-json';

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
    name: string;
    @JsonProperty()
    @JsonType(String)
    id: string;
    @JsonProperty()
    @JsonType(Number)
    latitude: number;
    @JsonProperty()
    @JsonType(Number)
    longitude: number;
    @JsonProperty()
    @JsonElementType(Asset)
    assets: Asset[];
}

@JsonObject()
export class DataSourceValue {
    @JsonProperty()
    @JsonType(String)
    sceneID: string;
    @JsonProperty()
    @JsonElementType(String)
    meshSet: string[][];
    @JsonProperty()
    @JsonElementType(String)
    selectionSet: string[][];
}

@JsonObject()
export class DataSource {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonElementType(String)
    aliasSet: string[];
    @JsonProperty()
    @JsonElementType(DataSourceValue)
    values: DataSourceValue[];
}

@JsonObject()
export class ControlConfig {
    @JsonProperty()
    @JsonElementType(Number)
    valueBreakPoints: number[];
    @JsonProperty()
    @JsonType(String)
    property: string;
    @JsonProperty()
    @JsonType(String)
    label: string;
    @JsonProperty()
    @JsonType(String)
    url: string;
}

@JsonObject()
export class PopoverConfiguration {
    @JsonProperty()
    @JsonType(String)
    control: string;
    @JsonProperty()
    @JsonType(ControlConfig)
    controlConfig: ControlConfig;
}

@JsonObject()
export class Behavior {
    @JsonProperty()
    @JsonType(String)
    name: string;
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonElementType(String)
    layers: string[];
    @JsonProperty()
    @JsonType(DataSource)
    dataSources: DataSource;
    @JsonProperty()
    @JsonType(String)
    colorExpression: string;
    @JsonProperty()
    @JsonType(String)
    labelExpression: string;
    @JsonProperty()
    @JsonElementType(PopoverConfiguration)
    popoverConfiguration: PopoverConfiguration[];
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
export class Config {
    @JsonProperty()
    @JsonType(String)
    type: string;
    @JsonProperty()
    @JsonType(ViewerConfiguration)
    viewerConfiguration: ViewerConfiguration;
}
