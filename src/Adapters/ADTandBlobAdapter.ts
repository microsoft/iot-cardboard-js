import { ADTTwinData } from '../Models/Classes';
import {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import { modelRefreshMaxAge } from '../Models/Constants';
import { IAuthService } from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import BlobAdapter from './BlobAdapter';

export default class ADTandBlobAdapter {
    constructor(
        adtHostUrl: string,
        blobContainerUrl: string,
        authService: IAuthService,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.adtTwinCache = new AdapterEntityCache<ADTTwinData>(9000);
        this.adtModelsCache = new AdapterEntityCache<ADTAllModelsData>(
            modelRefreshMaxAge
        );
        this.adtTwinToModelMappingCache = new AdapterEntityCache<ADTTwinToModelMappingData>(
            modelRefreshMaxAge
        );

        if (blobContainerUrl) {
            const containerURL = new URL(blobContainerUrl);
            this.storageAccountHostUrl = containerURL.hostname;
            this.blobContainerPath = containerURL.pathname;
        }

        this.adtProxyServerPath = adtProxyServerPath;
        this.blobProxyServerPath = blobProxyServerPath;
        this.authService.login();
    }
}

export default interface ADTandBlobAdapter extends ADTAdapter, BlobAdapter {}
applyMixins(ADTandBlobAdapter, [ADTAdapter, BlobAdapter]);
