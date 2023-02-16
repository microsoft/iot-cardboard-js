/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type IElement = ITwinToObjectMapping | ICustomProperty;
export type IDataSource = IElementTwinToObjectMappingDataSource | ICustomProperty;
export type IVisual = IPopoverVisual | IExpressionRangeVisual;
export type IWidget = IGaugeWidget | ILinkWidget | IValueWidget | IDataHistoryWidget | IPowerBIWidget;
/**
 * Widget group to which a widget belongs
 */
export type IGroupID = string;
/**
 * Expression which evaluates to a numeric value
 */
export type IValueExpression = string;
export type ValueRangeValueType = number | string | boolean;
export type IDTDLPropertyType =
    | 'boolean'
    | 'date'
    | 'dateTime'
    | 'double'
    | 'duration'
    | 'enum'
    | 'float'
    | 'integer'
    | 'long'
    | 'string'
    | 'time';
/**
 * A list of timeseries to render in the chart
 */
export type IDataHistoryTimeSeries = IDataHistoryBasicTimeSeries[];
export type IDataHistoryChartYAxisType = 'shared' | 'independent';
export type IDataHistoryAggregationType = 'min' | 'max' | 'avg';
export type IExpressionRangeType = 'NumericRange' | 'CategoricalValues';

/**
 * A vocabulary to annotate and validate the JSON representation of 3D scene configuration data
 */
export interface I3DScenesConfig {
    $schema: string;
    /**
     * 3D scene configuration data
     */
    configuration: {
        scenes: IScene[];
        behaviors: IBehavior[];
        layers: ILayer[];
    };
}
/**
 * A scene is a single view that can be rendered from 3D assets
 */
export interface IScene {
    assets: IAsset[];
    behaviorIDs: string[];
    elements: IElement[];
    id: string;
    description?: string;
    displayName: string;
    latitude?: number;
    longitude?: number;
    pollingConfiguration?: IPollingConfiguration;
}
/**
 * A 3D asset used to create the scene
 */
export interface IAsset {
    type: string;
    url: string;
    extensionProperties?: IExtensionProperties;
}
/**
 * Optional bag of non-schematized extension properties
 */
export interface IExtensionProperties {
    [k: string]: unknown;
}
/**
 * An elements maps twins to objects in the scene
 */
export interface ITwinToObjectMapping {
    type: 'TwinToObjectMapping';
    id: string;
    displayName: string;
    /**
     * The twin referenced by this element
     */
    primaryTwinID: string;
    /**
     * Array of of object IDs in the scene
     */
    objectIDs: string[];
    /**
     * Links to relevant twins other than the primary primaryTwin.  These aliases can be referenced in behavior expressions.
     */
    twinAliases?: {
        [k: string]: string;
    };
    extensionProperties?: IExtensionProperties;
}
/**
 * Free form property
 */
export interface ICustomProperty {
    type: 'CustomProperty';
    [k: string]: unknown;
}
/**
 * Configures the parameters for the polling of twin data from the twin graph.
 */
export interface IPollingConfiguration {
    /**
     * The minimum time in milliseconds that data should be refreshed. NOTE: it may take longer than this to fetch the data so this is a floor value intended to limit the frequency when the consumer knows the data is not updated more often than a particular frequency.
     */
    minimumPollingFrequency: number;
}
/**
 * A behavior applies visual or interactive representations of twin state to objects in the scene
 */
export interface IBehavior {
    id: string;
    displayName: string;
    twinAliases?: string[];
    /**
     * Data sources return an array of objects.  Each object is expected to have the same schema.  These objects can then be mapped over in visuals.
     */
    datasources: IDataSource[];
    /**
     * Visuals take a datasource, and modify objects in the scene based on expressions.  They allow you to color objects based on their state, float badges under alert conditions and configure popovers that trigger with user interaction
     */
    visuals: IVisual[];
}
/**
 * These datasources get their objects from the elements defined in a scene
 */
export interface IElementTwinToObjectMappingDataSource {
    type: 'ElementTwinToObjectMappingDataSource';
    elementIDs: string[];
    extensionProperties?: IExtensionProperties;
}
/**
 * A popover displays information about a datasource when you click on any of the associated objectIDs
 */
export interface IPopoverVisual {
    type: 'Popover';
    title: string;
    /**
     * Widgets are visuals within a popover.  Widgets can be grouped via widgetGroups property.
     */
    widgets: IWidget[];
    widgetGroups?: {
        id: string;
        title?: string;
        orientation?: string;
    }[];
    objectIDs: IObjectIDs;
}
/**
 * A gauge widget
 */
export interface IGaugeWidget {
    type: 'Gauge';
    id: string;
    groupID?: IGroupID;
    valueExpression: IValueExpression;
    widgetConfiguration: IGaugeWidgetConfiguration;
    extensionProperties?: IExtensionProperties;
}
/**
 * Widget configuration specifies widget specific properties that are used for rendering this gauge
 */
export interface IGaugeWidgetConfiguration {
    units?: string;
    label: string;
    valueRanges: IValueRange[];
}
/**
 * Range of values for which a visual indication is triggered
 */
export interface IValueRange {
    id: string;
    /**
     * min/max values are parsed as a two element array [min, max].  Boolean values are parsed as a single element array [true]. String values are parsed as regular arrays [string1, string2, string3]
     */
    values: ValueRangeValueType[];
    visual: IValueRangeVisual;
    extensionProperties?: IExtensionProperties;
}
/**
 * Visual data to apply when values are in range
 */
export interface IValueRangeVisual {
    color?: string;
    iconName?: string;
    labelExpression?: string;
    extensionProperties?: IExtensionProperties;
}
/**
 * A link widget which uses a string template to create a parametrized link
 */
export interface ILinkWidget {
    type: 'Link';
    id: string;
    groupID?: IGroupID;
    widgetConfiguration: ILinkWidgetConfiguration;
    extensionProperties?: IExtensionProperties;
}
/**
 * Widget configuration specifies widget specific properties that are used for rendering this link
 */
export interface ILinkWidgetConfiguration {
    label: string;
    /**
     * Template string which evalues to http link
     */
    linkExpression: string;
}
/**
 * A value widget which uses display name and value
 */
export interface IValueWidget {
    type: 'Value';
    id: string;
    groupID?: IGroupID;
    widgetConfiguration: IValueWidgetConfiguration;
    extensionProperties?: IExtensionProperties;
}
/**
 * Widget configuration specifies widget specific properties that are used for rendering this value
 */
export interface IValueWidgetConfiguration {
    displayName: string;
    valueExpression: IValueExpression;
    type: IDTDLPropertyType;
}
/**
 * A data history widget which uses twin properties to show timeseries data
 */
export interface IDataHistoryWidget {
    type: 'Data history';
    id: string;
    groupID?: IGroupID;
    widgetConfiguration: IDataHistoryWidgetConfiguration;
    extensionProperties?: IExtensionProperties;
}
/**
 * Widget configuration specifies widget specific properties that are used for rendering this data history
 */
export interface IDataHistoryWidgetConfiguration {
    /**
     * Database connection information of timeseries data
     */
    connection: IADXTimeSeriesConnection;
    displayName: string;
    timeSeries: IDataHistoryTimeSeries;
    chartOptions: IDataHistoryChartOptions;
}
/**
 * Azure Data Explorer connection information for time series data
 */
export interface IADXTimeSeriesConnection {
    adxClusterUrl: string;
    adxDatabaseName: string;
    adxTableName: string;
}
/**
 * A basic timeseries to be rendered in the chart of the data history widget
 */
export interface IDataHistoryBasicTimeSeries {
    id: string;
    expression: string;
    propertyType: IDTDLPropertyType;
    unit?: string;
    label?: string;
}
/**
 * Options to be used while rendering chart for data history widget
 */
export interface IDataHistoryChartOptions {
    yAxisType: IDataHistoryChartYAxisType;
    defaultQuickTimeSpanInMillis: number;
    aggregationType: IDataHistoryAggregationType;
    extensionProperties?: IExtensionProperties;
}
/**
 * A widget to connect to Power BI and display a specified visualization
 */
export interface IPowerBIWidget {
    type: 'PowerBI';
    id: string;
    groupID?: IGroupID;
    widgetConfiguration: IPowerBIWidgetConfiguration;
    extensionProperties?: IExtensionProperties;
}
/**
 * Widget configuration for required Power BI properties used to render visualization
 */
export interface IPowerBIWidgetConfiguration {
    /**
     * Supported types: report, dashboard, tile, visual
     */
    type: 'tile' | 'visual';
    label: string;
    /**
     * The URL of the report that contains the visual that you're embedding. This URL becomes the source of the HTML iframe element that contains the embedded visual. Specifically, the API assigns the URL to the src attribute of the iframe. Similar to "https://app.powerbi.com/reportEmbed?reportId=<report ID>&groupId=<group ID>" or "https://app.powerbi.com/groups/<group ID>/reports/<report ID>"
     */
    embedUrl?: string;
    /**
     * The name of the page that contains the visual that you're embedding
     */
    pageName?: string;
    visualName?: string;
    /**
     * Template string which evalues to data filter
     */
    dataFilterExpression?: string;
}
/**
 * objectIDs specify the objects in the scene that a visual pertains to
 */
export interface IObjectIDs {
    expression: string;
    extensionProperties?: IExtensionProperties;
}
/**
 * An expression range visual maps an expression result to a visual
 */
export interface IExpressionRangeVisual {
    type: 'ExpressionRangeVisual';
    id?: string;
    displayName?: string;
    /**
     * Expression to evaluate
     */
    valueExpression: string;
    expressionType: IExpressionRangeType;
    valueRanges: IValueRange[];
    valueRangeType?: IDTDLPropertyType;
    objectIDs: IObjectIDs;
    extensionProperties?: IExtensionProperties;
}
/**
 * Layers are used to group behavior visibility
 */
export interface ILayer {
    id: string;
    displayName: string;
    behaviorIDs: string[];
    extensionProperties?: IExtensionProperties;
}
