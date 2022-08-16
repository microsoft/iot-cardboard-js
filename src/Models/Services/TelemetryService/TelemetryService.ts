import { getDebugLogger } from '../Utils';
import { ITelemetryEvent } from './Telemetry';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TelemetryService', debugLogging);

class TelemetryService {
    static telemetryCallback: (telemetry: ITelemetryEvent) => void;

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: ITelemetryEvent) => void
    ) {
        TelemetryService.telemetryCallback = telemetryCallback;
    }

    // Report telemetry to telemetry processing callback (if present)
    static sendTelemetry(telemetry: ITelemetryEvent) {
        logDebugConsole(
            'debug',
            `[Telemetry] [${telemetry.type}] ${telemetry.name}`,
            telemetry
        );
        if (TelemetryService.telemetryCallback)
            TelemetryService.telemetryCallback(telemetry);
    }
}

export default TelemetryService;
