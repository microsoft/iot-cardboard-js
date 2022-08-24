import { LOCAL_STORAGE_KEYS } from '../../Constants/Constants';
import { getDebugLogger } from '../Utils';
import {
    TelemetryEvent,
    TelemetryException,
    TelemetryItem,
    TelemetryMetric,
    TelemetryRequest,
    TelemetryTrace
} from './Telemetry';

const debugLogging =
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.Telemetry.debugLogging
    ) === 'true' || false;
const logDebugConsole = getDebugLogger('TelemetryService', debugLogging);

class TelemetryService {
    static telemetryCallback: (telemetry: TelemetryItem) => Promise<void>;

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: TelemetryItem) => Promise<void>
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

    static sendEvent(telemetry: TelemetryEvent) {
        this.sendTelemetry(telemetry);
    }

    static sendMetric(telemetry: TelemetryMetric) {
        this.sendTelemetry(telemetry);
    }

    static sendException(telemetry: TelemetryException) {
        this.sendTelemetry(telemetry);
    }

    static sendTrace(telemetry: TelemetryTrace) {
        this.sendTelemetry(telemetry);
    }

    static sendRequest(telemetry: TelemetryRequest) {
        this.sendTelemetry(telemetry);
    }
}

export default TelemetryService;
