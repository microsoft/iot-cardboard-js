import {
    IBehavior,
    IGaugeWidget,
    ILinkWidget,
    IPopoverVisual,
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
    StatusColoring = 'StatusColoring',
    Alert = 'Alert'
}

export enum WidgetType {
    Gauge = 'Gauge',
    Link = 'Link',
    Trend = 'Trend',
    Panel = 'Panel'
}

export interface IWidgetLibraryItem {
    title: string;
    description: string;
    iconName: string;
    disabled?: boolean;
    data: IWidget;
}

// Default objects
export const defaultBehavior: IBehavior = {
    id: '',
    displayName: '',
    datasources: [],
    visuals: []
};

export const defaultOnClickPopover: IPopoverVisual = {
    type: VisualType.Popover,
    title: '',
    widgets: [],
    objectIDs: {
        expression: 'meshIDs'
    }
};

export const defaultGaugeWidget: IGaugeWidget = {
    id: 'temp',
    type: WidgetType.Gauge,
    valueExpression: '',
    widgetConfiguration: {
        label: '',
        valueRanges: []
    }
};

export const defaultLinkWidget: ILinkWidget = {
    id: 'temp',
    type: WidgetType.Link,
    widgetConfiguration: {
        label: '',
        linkExpression: ''
    }
};
