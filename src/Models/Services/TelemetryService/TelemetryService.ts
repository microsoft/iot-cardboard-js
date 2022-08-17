import { getDebugLogger } from '../Utils';
import { ITelemetryItem } from './Telemetry';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TelemetryService', debugLogging);

class TelemetryService {
    static telemetryCallback: (telemetry: ITelemetryItem) => void;

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: ITelemetryItem) => void
    ) {
        TelemetryService.telemetryCallback = telemetryCallback;
    }

    // Report telemetry to telemetry processing callback (if present)
    static sendTelemetry(telemetry: ITelemetryItem) {
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
