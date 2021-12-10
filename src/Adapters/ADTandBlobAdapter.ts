import { IAuthService } from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import BlobAdapter from './BlobAdapter';

export default class ADTandBlobAdapter {
    constructor(
        adtHostUrl: string,
        storateAccountHostUrl: string,
        blobPath: string,
        authService: IAuthService,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = authService;
        this.storateAccountHostUrl = storateAccountHostUrl;
        this.blobPath = blobPath;

        this.adtProxyServerPath = adtProxyServerPath;
        this.blobProxyServerPath = blobProxyServerPath;
        this.authService.login();
    }
}

export default interface ADTandBlobAdapter extends ADTAdapter, BlobAdapter {}
applyMixins(ADTandBlobAdapter, [ADTAdapter, BlobAdapter]);
