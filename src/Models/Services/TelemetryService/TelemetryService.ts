import { Md5 } from 'ts-md5';
import { LOCAL_STORAGE_KEYS } from '../../Constants/Constants';
import { CUSTOM_PROPERTY_NAMES } from '../../Constants/TelemetryConstants';
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
    private static environmentHash: string; // the hashed value of the environment
    private static sceneHash: string; // the hash of the scene id

    // Attach telemetry processing callback from consuming application
    static registerTelemetryCallback(
        telemetryCallback: (telemetry: TelemetryItem) => Promise<void>
    ) {
        TelemetryService.telemetryCallback = telemetryCallback;
    }

    // #region public telemetry emitters

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

    // #endregion

    // #region public setters

    /** store the current environment parameters */
    static setEnvironment(
        adtInstanceUrl: string,
        storageBlobUrl: string
    ): void {
        this.environmentHash = Md5.hashStr(adtInstanceUrl + storageBlobUrl);
        logDebugConsole(
            'debug',
            `Updating environment hash to ${this.environmentHash}. {storageUrl, adtInstance}`,
            storageBlobUrl,
            adtInstanceUrl
        );
    }

    /** store the scene id for the current scene */
    static setSceneId(sceneId: string): void {
        this.sceneHash = Md5.hashStr(sceneId);
        logDebugConsole(
            'debug',
            `Updating scene hash to ${this.sceneHash}. {sceneId}`,
            sceneId
        );
    }

    // #endregion

    // #region private methods

    // Report telemetry to telemetry processing callback (if present)
    private static sendTelemetry(telemetry: TelemetryItem) {
        // add the common properties for all events
        TelemetryService._addCommonTelemetryProperties(telemetry);

        logDebugConsole(
            'debug',
            `[Telemetry] [${telemetry.type}] ${telemetry.name}`,
            telemetry
        );
        if (TelemetryService.telemetryCallback)
            TelemetryService.telemetryCallback(telemetry);
    }

    private static _addCommonTelemetryProperties(telemetry: TelemetryItem) {
        if (!telemetry.customProperties) {
            telemetry.customProperties = {};
        }
        // add the scene hash
        if (this.sceneHash) {
            telemetry.customProperties[
                CUSTOM_PROPERTY_NAMES.SceneHash
            ] = this.sceneHash;
        }
        // add the Environment hash
        if (this.environmentHash) {
            telemetry.customProperties[
                CUSTOM_PROPERTY_NAMES.EnvironmentHash
            ] = this.environmentHash;
        }
    }

    // #endregion
}

export default TelemetryService;
