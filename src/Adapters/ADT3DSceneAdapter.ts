import { IAuthService } from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import ADXAdapter from './ADXAdapter';
import AzureManagementAdapter from './AzureManagementAdapter';
import BlobAdapter from './BlobAdapter';

export default class ADT3DSceneAdapter {
    constructor(
        authService: IAuthService,
        adtHostUrl: string,
        blobContainerUrl?: string,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
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

export default interface ADT3DSceneAdapter
    extends ADTAdapter,
        BlobAdapter,
        AzureManagementAdapter,
        ADXAdapter {}
applyMixins(ADT3DSceneAdapter, [
    ADTAdapter,
    BlobAdapter,
    AzureManagementAdapter,
    ADXAdapter
]);
