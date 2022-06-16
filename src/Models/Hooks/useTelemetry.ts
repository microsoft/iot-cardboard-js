import {
    EventTelemetry,
    ExceptionTelemetry,
    RequestTelemetry,
    TraceTelemetry
} from '../Services/TelemetryService/Telemetry';
import TelemetryService from '../Services/TelemetryService/TelemetryService';
import {
    IBaseTelemetryParams,
    IExceptionTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams
} from '../Services/TelemetryService/TelemetryService.types';

const useTelemetry = () => {
    return {
        sendTelemetry: TelemetryService.sendTelemetry,
        sendRequestTelemetry: (
            requestTelemetryParams: IRequestTelemetryParams
        ) =>
            TelemetryService.sendTelemetry(
                new RequestTelemetry(requestTelemetryParams)
            ),
        sendExceptionTelemetry: (
            exceptionTelemetryParams: IExceptionTelemetryParams
        ) =>
            TelemetryService.sendTelemetry(
                new ExceptionTelemetry(exceptionTelemetryParams)
            ),
        sendTraceTelemetry: (traceTelemetryParams: ITraceTelemetryParams) =>
            TelemetryService.sendTelemetry(
                new TraceTelemetry(traceTelemetryParams)
            ),
        sendEventTelemetry: (eventTelemetryParams: IBaseTelemetryParams) =>
            TelemetryService.sendTelemetry(
                new EventTelemetry(eventTelemetryParams)
            )
    };
};

export default useTelemetry;
