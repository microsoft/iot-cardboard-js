import {
    TelemetryEvent,
    TelemetryException,
    TelemetryMetric,
    TelemetryRequest,
    TelemetryTrace
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
                new TelemetryRequest(telemetryParams)
            ),
        sendExceptionTelemetry: (telemetryParams: IExceptionTelemetryParams) =>
            TelemetryService.sendTelemetry(
                new TelemetryException(telemetryParams)
            ),
        sendTraceTelemetry: (telemetryParams: ITraceTelemetryParams) =>
            TelemetryService.sendTelemetry(new TelemetryTrace(telemetryParams)),
        sendEventTelemetry: (telemetryParams: IBaseTelemetryParams) =>
            TelemetryService.sendTelemetry(new TelemetryEvent(telemetryParams)),
        sendMetricTelemetry: (telemetryParams: IMetricTelemetryParams) =>
            TelemetryService.sendTelemetry(new TelemetryMetric(telemetryParams))
    };
};

export default useTelemetry;
