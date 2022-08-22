import { getDebugLogger } from '../Utils';
import { TelemetryItem } from './Telemetry';

const debugLogging = true;
const logDebugConsole = getDebugLogger('TelemetryService', debugLogging);

class TelemetryService {
    static telemetryCallback: (telemetry: TelemetryItem) => void;

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: TelemetryItem) => void
    ) {
        TelemetryService.telemetryCallback = telemetryCallback;
    }

    // Report telemetry to telemetry processing callback (if present)
    static sendTelemetry(telemetry: TelemetryItem) {
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
