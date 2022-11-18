import { isNumericType } from '../../Components/ADT3DSceneBuilder/Internal/VisualRuleForm/VisualRuleFormUtility';
import { createGUID } from '../Services/Utils';
import {
    IBehavior,
    IDataHistoryAggregationType,
    IDataHistoryChartYAxisType,
    IDataHistoryWidget,
    IDTDLPropertyType,
    IExpressionRangeVisual,
    IGaugeWidget,
    ILayer,
    ILinkWidget,
    IPopoverVisual,
    ITwinToObjectMapping,
    IValueRange,
    IValueWidget,
    IWidget
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';

export enum DatasourceType {
    ElementTwinToObjectMappingDataSource = 'ElementTwinToObjectMappingDataSource'
}

export enum ElementType {
    TwinToObjectMapping = 'TwinToObjectMapping'
}

export enum VisualType {
    Popover = 'Popover',
    ExpressionRangeVisual = 'ExpressionRangeVisual'
}

export enum WidgetType {
    Gauge = 'Gauge',
    Link = 'Link',
    Value = 'Value',
    Trend = 'Trend',
    Panel = 'Panel',
    DataHistory = 'Data history'
}

export interface IWidgetLibraryItem {
    title: string;
    description: string;
    notAvailableDescription?: string;
    learnMoreLink?: string;
    iconName: string;
    disabled?: boolean;
    data: IWidget;
}

export interface IBehaviorTwinAliasItem {
    alias: string;
    elementToTwinMappings: Array<{ elementId: string; twinId: string }>;
}

export interface IElementTwinAliasItem {
    alias: string;
    twinId: string;
}

// Default objects
export const getDefaultElement = (
    partial?: Partial<ITwinToObjectMapping>
): ITwinToObjectMapping => ({
    type: ElementType.TwinToObjectMapping,
    id: '',
    displayName: '',
    primaryTwinID: '',
    objectIDs: [],
    ...partial
});

export const defaultBehavior: IBehavior = {
    id: '',
    displayName: '',
    datasources: [],
    visuals: []
};

export const defaultLayer: ILayer = {
    id: '',
    behaviorIDs: [],
    displayName: ''
};

export const defaultOnClickPopover: IPopoverVisual = {
    type: VisualType.Popover,
    title: '',
    widgets: [],
    objectIDs: {
        expression: 'meshIDs'
    }
};

export const getDefaultVisualRule = (id?: string): IExpressionRangeVisual => ({
    id: id ? id : createGUID(),
    type: VisualType.ExpressionRangeVisual,
    valueExpression: '',
    valueRanges: [],
    expressionType: 'NumericRange',
    objectIDs: {
        expression: 'objectIDs'
    }
});

export const getDefaultVisualRuleCondition = (
    type: IDTDLPropertyType = 'integer',
    color?: string
): IValueRange => ({
    id: createGUID(),
    values: isNumericType(type) ? [0, 1] : type === 'boolean' ? [true] : [],
    visual: {
        color: color,
        iconName: undefined,
        labelExpression: undefined
    }
});

export const defaultGaugeWidget: IGaugeWidget = {
    id: '',
    type: WidgetType.Gauge,
    valueExpression: '',
    widgetConfiguration: {
        label: '',
        valueRanges: []
    }
};

export const defaultLinkWidget: ILinkWidget = {
    id: '',
    type: WidgetType.Link,
    widgetConfiguration: {
        label: '',
        linkExpression: ''
    }
};

export const defaultValueWidget: IValueWidget = {
    id: '',
    type: WidgetType.Value,
    widgetConfiguration: {
        displayName: '',
        valueExpression: null,
        type: 'double'
    }
};

export const defaultDataHistoryWidget: IDataHistoryWidget = {
    id: '',
    type: WidgetType.DataHistory,
    widgetConfiguration: {
        connection: null,
        displayName: '',
        timeSeries: [],
        chartOptions: {
            aggregationType: 'avg' as IDataHistoryAggregationType,
            defaultQuickTimeSpanInMillis: 15 * 60 * 1000, // last 15 min by default
            yAxisType: 'shared' as IDataHistoryChartYAxisType
        }
    }
};

export const defaultBehaviorTwinAlias: IBehaviorTwinAliasItem = {
    alias: '',
    elementToTwinMappings: []
};

export const defaultElementTwinAlias: IElementTwinAliasItem = {
    alias: '',
    twinId: null
};
