import {
    CustomProperties,
    IBaseTelemetryParams,
    IExceptionTelemetryParams,
    IMetricTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams,
    SeverityLevel,
    TelemetryType
} from './TelemetryService.types';

export type TelemetryItem =
    | TelemetryEvent
    | TelemetryException
    | TelemetryMetric
    | TelemetryRequest
    | TelemetryTrace;

export abstract class Telemetry {
    name: string;
    type: TelemetryType;
    customProperties: CustomProperties;
    timestamp: string;
    constructor(
        name: string,
        type: TelemetryType,
        customProperties: CustomProperties
    ) {
        this.name = name;
        this.type = type;
        this.customProperties = customProperties;
        this.timestamp = new Date().toUTCString();
    }
}

/** Telemetry for network requests
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-request-telemetry
 */
export class TelemetryRequest extends Telemetry {
    type: TelemetryType.request;
    name: string;
    url: string;
    success: boolean;
    responseCode: number;
    responseMessage: string;
    requestMethod: string;
    customProperties: CustomProperties;
    constructor({
        name,
        url,
        requestMethod,
        responseCode,
        responseMessage,
        success,
        customProperties
    }: IRequestTelemetryParams) {
        super(name, TelemetryType.request, customProperties);
        this.url = url;
        this.success = success;
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.requestMethod = requestMethod;
        this.customProperties = customProperties;
    }
}

/** Telemetry for exceptions
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-exception-telemetry
 */
export class TelemetryException extends Telemetry {
    type: TelemetryType.exception;
    exceptionId: string;
    severityLevel: SeverityLevel;
    message: string;
    stack: string;

    constructor({
        name,
        message,
        exceptionId,
        stack,
        customProperties,
        severityLevel
    }: IExceptionTelemetryParams) {
        super(name, TelemetryType.exception, customProperties);
        this.exceptionId = exceptionId;
        this.severityLevel = severityLevel;
        this.message = message;
        this.stack = stack;
    }
}

/** Telemetry for trace statements (similar to log entries)
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-trace-telemetry
 */
export class TelemetryTrace extends Telemetry {
    type: TelemetryType.trace;
    message: string;
    severityLevel: SeverityLevel;

    constructor({
        name,
        message,
        severityLevel,
        customProperties
    }: ITraceTelemetryParams) {
        super(name, TelemetryType.trace, customProperties);
        this.message = message;
        this.severityLevel = severityLevel;
    }
}

/** Telemetry for application events (Typically it is a user interaction such as button click)
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-event-telemetry
 */
export class TelemetryEvent extends Telemetry {
    type: TelemetryType.event;
    constructor({ name, customProperties }: IBaseTelemetryParams) {
        super(name, TelemetryType.event, customProperties);
    }
}

/** Telemetry for application measurements (Typically it is a state of the app like queue length, or duration something took to complete)
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-metric-telemetry
 */
export class TelemetryMetric extends Telemetry {
    type: TelemetryType.metric;
    average: number;
    min?: number;
    max?: number;
    sampleSize?: number;
    constructor({
        name,
        average,
        min,
        max,
        sampleSize,
        customProperties
    }: IMetricTelemetryParams) {
        super(name, TelemetryType.event, customProperties);
        this.average = average;
        this.min = min;
        this.max = max;
        this.sampleSize = sampleSize || 1;
    }
}
