import {
    TelemetryEvent,
    TelemetryException,
    TelemetryMetric,
    TelemetryRequest,
    TelemetryTrace
} from '../Services/TelemetryService/Telemetry';
import TelemetryService from '../Services/TelemetryService/TelemetryService';
import {
    IEventTelemetryParams,
    IExceptionTelemetryParams,
    IMetricTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams
} from '../Services/TelemetryService/TelemetryService.types';

const useTelemetry = () => {
    return {
        sendTelemetry: TelemetryService.sendTelemetry,
        sendRequestTelemetry: (telemetryParams: IRequestTelemetryParams) =>
            TelemetryService.sendRequest(new TelemetryRequest(telemetryParams)),
        sendExceptionTelemetry: (telemetryParams: IExceptionTelemetryParams) =>
            TelemetryService.sendException(
                new TelemetryException(telemetryParams)
            ),
        sendTraceTelemetry: (telemetryParams: ITraceTelemetryParams) =>
            TelemetryService.sendTrace(new TelemetryTrace(telemetryParams)),
        sendEventTelemetry: (telemetryParams: IEventTelemetryParams) =>
            TelemetryService.sendEvent(new TelemetryEvent(telemetryParams)),
        sendMetricTelemetry: (telemetryParams: IMetricTelemetryParams) =>
            TelemetryService.sendMetric(new TelemetryMetric(telemetryParams))
    };
};

export default useTelemetry;
