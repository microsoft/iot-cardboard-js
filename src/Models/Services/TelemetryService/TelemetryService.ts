import { Telemetry } from './Telemetry';

class TelemetryService {
    static telemetryCallback;

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: Telemetry) => void
    ) {
        TelemetryService.telemetryCallback = telemetryCallback;
    }

    // Report telemetry to telemetry processing callback (if present)
    static sendTelemetry(telemetry: Telemetry) {
        if (TelemetryService.telemetryCallback)
            TelemetryService.telemetryCallback(telemetry);
    }
}

export default TelemetryService;
