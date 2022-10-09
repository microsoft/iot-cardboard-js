import produce from 'immer';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../Theming/Palettes';
import { createGUID } from '../Services/Utils';
import {
    IBehavior,
    IDataHistoryAggregationType,
    IDataHistoryChartYAxisType,
    IDataHistoryWidget,
    IExpressionRangeVisual,
    IGaugeWidget,
    ILayer,
    ILinkWidget,
    IPopoverVisual,
    ITwinToObjectMapping,
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

export const defaultStatusColorVisual: IExpressionRangeVisual = {
    type: VisualType.ExpressionRangeVisual,
    expressionType: 'NumericRange',
    valueExpression: '',
    valueRanges: [],
    objectIDs: {
        expression: 'objectIDs'
    }
};

export const defaultAlertVisual: IExpressionRangeVisual = {
    type: VisualType.ExpressionRangeVisual,
    expressionType: 'CategoricalValues',
    valueExpression: '',
    valueRanges: [
        {
            id: '',
            values: [true],
            visual: {
                color: defaultSwatchColors[0].item,
                iconName: defaultSwatchIcons[0].item,
                labelExpression: ''
            }
        }
    ],
    objectIDs: {
        expression: 'objectIDs'
    }
};

export const getDefaultAlertVisualWithId = () => {
    const uniqueIdDefaultAlertVisual = produce(defaultAlertVisual, (draft) => {
        draft.valueRanges[0].id = createGUID();
    });
    return uniqueIdDefaultAlertVisual;
};

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
        connectionString: '',
        displayName: '',
        timeSeries: [],
        chartOptions: {
            aggregationType: 'avg' as IDataHistoryAggregationType,
            defaultQuickTimeSpan: 15 * 60 * 1000, // last 15 min by default
            yAxisType: 'Shared' as IDataHistoryChartYAxisType
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
