import {
    AppRegion,
    ComponentName,
    TelemetryTrigger
} from '../../Constants/TelemetryConstants';

/** Loosely based on the Application insights telemetry data model
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model
 */
export enum TelemetryType {
    event = 'event',
    exception = 'exception',
    metric = 'metric',
    request = 'request',
    trace = 'trace'
}

export interface ITelemetry {
    type: TelemetryType;
}

export type CustomProperties = Record<string, any>;
export type SeverityLevel =
    | 'Verbose'
    | 'Information'
    | 'Warning'
    | 'Error'
    | 'Critical';

export interface IBaseTelemetryParams {
    customProperties?: CustomProperties;
    name: string;
}

export interface IRequestTelemetryParams extends IBaseTelemetryParams {
    url: string;
    success?: boolean;
    responseCode?: number;
    responseMessage?: string;
    requestMethod?: string;
}

export interface IExceptionTelemetryParams extends IBaseTelemetryParams {
    /** Identifier of where the exception was thrown in code.
     * Used for exceptions grouping. Typically a combination of exception
     * type and a function from the call stack. */
    exceptionId: string;

    /** Trace severity level */
    severityLevel?: SeverityLevel;
    message?: string;
    stack?: string;
}

export interface ITraceTelemetryParams extends IBaseTelemetryParams {
    message: string;
    /** Trace severity level */
    severityLevel?: SeverityLevel;
}

export type IEventTelemetryParams =
    | IEventTelemetryForComponentAction
    | IEventTelemetryForComponentView
    | IEventTelemetryForService;

interface IEventTelemetryParamsBase extends IBaseTelemetryParams {
    triggerType: TelemetryTrigger;
}
type IEventTelemetryForComponentAction = IEventTelemetryParamsBase & {
    triggerType: TelemetryTrigger.UserAction;
    componentName: ComponentName;
    appRegion: AppRegion;
};
type IEventTelemetryForComponentView = IEventTelemetryParamsBase & {
    triggerType: TelemetryTrigger.UserView;
    componentName: ComponentName;
    appRegion: AppRegion;
};
type IEventTelemetryForService = IEventTelemetryParamsBase & {
    triggerType: TelemetryTrigger.SystemAction;
    componentName?: ComponentName;
    appRegion?: AppRegion;
};

export interface IMetricTelemetryParams extends IBaseTelemetryParams {
    average: number;
    min?: number;
    max?: number;
    sampleSize?: number;
}
