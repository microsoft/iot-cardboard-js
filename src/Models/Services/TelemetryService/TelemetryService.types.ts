/** Loosely based on the Application insights telemetry data model
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model
 */
export enum TelemetryType {
    request = 'request',
    exception = 'exception',
    trace = 'trace',
    event = 'event'
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
    name: string;
    customProperties?: CustomProperties;
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
