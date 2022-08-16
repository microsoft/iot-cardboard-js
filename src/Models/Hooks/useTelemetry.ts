import {
    EventTelemetry,
    ExceptionTelemetry,
    MetricTelemetry,
    RequestTelemetry,
    TraceTelemetry
} from '../Services/TelemetryService/Telemetry';
import TelemetryService from '../Services/TelemetryService/TelemetryService';
import {
    IBaseTelemetryParams,
    IExceptionTelemetryParams,
    IMetricTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams
} from '../Services/TelemetryService/TelemetryService.types';

const useTelemetry = () => {
    return {
        sendTelemetry: TelemetryService.sendTelemetry,
        sendRequestTelemetry: (telemetryParams: IRequestTelemetryParams) =>
            TelemetryService.sendTelemetry(
                new RequestTelemetry(telemetryParams)
            ),
        sendExceptionTelemetry: (telemetryParams: IExceptionTelemetryParams) =>
            TelemetryService.sendTelemetry(
                new ExceptionTelemetry(telemetryParams)
            ),
        sendTraceTelemetry: (telemetryParams: ITraceTelemetryParams) =>
            TelemetryService.sendTelemetry(new TraceTelemetry(telemetryParams)),
        sendEventTelemetry: (telemetryParams: IBaseTelemetryParams) =>
            TelemetryService.sendTelemetry(new EventTelemetry(telemetryParams)),
        sendMetricTelemetry: (telemetryParams: IMetricTelemetryParams) =>
            TelemetryService.sendTelemetry(new MetricTelemetry(telemetryParams))
    };
};

export default useTelemetry;
