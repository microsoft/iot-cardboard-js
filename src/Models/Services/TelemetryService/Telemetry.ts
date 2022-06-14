import {
    CustomProperties,
    IBaseTelemetryParams,
    IExceptionTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams,
    SeverityLevel,
    TelemetryType
} from './TelemetryService.types';

export abstract class Telemetry {
    name: string;
    type: TelemetryType;
    customProperties: CustomProperties;
    timestamp: Date;
    constructor(
        name: string,
        type: TelemetryType,
        customProperties: CustomProperties
    ) {
        this.name = name;
        this.type = type;
        this.customProperties = customProperties;
        this.timestamp = new Date();
    }
}

/** Telemetry for network requests
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-request-telemetry
 */
export class RequestTelemetry extends Telemetry {
    name: string;
    url: string;
    success: boolean;
    responseCode: number;
    requestMethod: string;
    customProperties: CustomProperties;
    constructor({
        name,
        url,
        requestMethod,
        responseCode,
        success,
        customProperties
    }: IRequestTelemetryParams) {
        super(name, TelemetryType.request, customProperties);
        this.url = url;
        this.success = success;
        this.responseCode = responseCode;
        this.requestMethod = requestMethod;
        this.customProperties = customProperties;
    }
}

/** Telemetry for exceptions
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-exception-telemetry
 */
export class ExceptionTelemetry extends Telemetry {
    problemId: string;
    severityLevel: SeverityLevel;
    message: string;
    stack: string;

    constructor({
        name,
        message,
        problemId,
        stack,
        customProperties,
        severityLevel
    }: IExceptionTelemetryParams) {
        super(name, TelemetryType.exception, customProperties);
        this.problemId = problemId;
        this.severityLevel = severityLevel;
        this.message = message;
        this.stack = stack;
    }
}

/** Telemetry for trace statements (similar to log entries)
 * https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-model-trace-telemetry
 */
export class TraceTelemetry extends Telemetry {
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
export class EventTelemetry extends Telemetry {
    constructor({ name, customProperties }: IBaseTelemetryParams) {
        super(name, TelemetryType.trace, customProperties);
    }
}
