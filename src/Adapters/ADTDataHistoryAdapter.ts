import ADTInstanceTimeSeriesConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceTimeSeriesConnectionData';
import {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    modelRefreshMaxAge,
    timeSeriesConnectionRefreshMaxAge
} from '../Models/Constants/Constants';
import {
    IADTDataHistoryAdapter,
    IADXConnection,
    IAuthService
} from '../Models/Constants/Interfaces';
import { applyMixins, getDebugLogger } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import ADXAdapter from './ADXAdapter';
import AzureManagementAdapter from './AzureManagementAdapter';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ADTDataHistoryAdapter', debugLogging);

export default class ADTDataHistoryAdapter implements IADTDataHistoryAdapter {
    constructor(
        authService: IAuthService,
        adtHostUrl: string,
        adxConnectionInformation?: IADXConnection,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.adxConnectionInformation = adxConnectionInformation;
        this.authService = this.adxAuthService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.adtProxyServerPath = adtProxyServerPath;

        this.adtTwinCache = new AdapterEntityCache<ADTTwinData>(9000);
        this.adtModelsCache = new AdapterEntityCache<ADTAllModelsData>(
            modelRefreshMaxAge
        );
        this.adtTwinToModelMappingCache = new AdapterEntityCache<ADTTwinToModelMappingData>(
            modelRefreshMaxAge
        );
        this.timeSeriesConnectionCache = new AdapterEntityCache<ADTInstanceTimeSeriesConnectionData>(
            timeSeriesConnectionRefreshMaxAge
        );

        this.authService.login();
        // Fetch & cache models on mount (makes first use of models faster as models should already be cached)
        this.getAllAdtModels();
    }

    async updateADXConnectionInformation() {
        if (this.adtHostUrl) {
            logDebugConsole(
                'debug',
                '[START] Fetching time series connection information of ADT instance with url: ',
                this.adtHostUrl
            );
            const connectionInformation = await this.getTimeSeriesConnectionInformation(
                this.adtHostUrl,
                true,
                true
            );
            this.setADXConnectionInformation(connectionInformation.getData());
            logDebugConsole(
                'debug',
                '[END] Fetched time series connection information of ADT instance: ',
                this.adxConnectionInformation
            );
            return connectionInformation;
        } else {
            logDebugConsole(
                'error',
                'No adtHostUrl in adapter found get the connection information for!'
            );
            return new AdapterResult<ADTInstanceTimeSeriesConnectionData>({
                result: null,
                errorInfo: null
            });
        }
    }
}

export default interface ADTDataHistoryAdapter
    extends ADTAdapter,
        ADXAdapter,
        AzureManagementAdapter {
    updateADXConnectionInformation(): Promise<
        AdapterResult<ADTInstanceTimeSeriesConnectionData>
    >;
}
applyMixins(ADTDataHistoryAdapter, [
    ADTAdapter,
    ADXAdapter,
    AzureManagementAdapter
]);
