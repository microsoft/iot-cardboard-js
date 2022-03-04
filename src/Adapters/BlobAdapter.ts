import {
    IAuthService,
    IBlobAdapter,
    IBlobFile
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { IScenesConfig } from '../Models/Classes/3DVConfig';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import { ADT3DSceneConfigFileNameInBlobStore } from '../Models/Constants/Constants';
import { XMLParser } from 'fast-xml-parser';
import BlobsData from '../Models/Classes/AdapterDataClasses/BlobsData';

export default class BlobAdapter implements IBlobAdapter {
    protected storateAccountHostUrl: string;
    protected blobContainerPath: string;
    protected blobAuthService: IAuthService;
    protected blobProxyServerPath: string;

    constructor(
        blobContainerUrl: string,
        authService: IAuthService,
        blobProxyServerPath = '/proxy/blob'
    ) {
        if (blobContainerUrl) {
            const containerURL = new URL(blobContainerUrl);
            this.storateAccountHostUrl = containerURL.hostname;
            this.blobContainerPath = containerURL.pathname;
        }
        this.blobAuthService = authService;
        this.blobAuthService.login();
        this.blobProxyServerPath = blobProxyServerPath;
    }

    getBlobContainerURL() {
        return this.storateAccountHostUrl && this.blobContainerPath
            ? `https://${this.storateAccountHostUrl}${this.blobContainerPath}`
            : '';
    }

    setBlobContainerPath(blobContainerURL: string) {
        if (blobContainerURL) {
            try {
                const url = new URL(blobContainerURL);
                if (url.hostname.endsWith('blob.core.windows.net')) {
                    this.storateAccountHostUrl = url.hostname;
                    this.blobContainerPath = url.pathname;
                }
            } catch (error) {
                console.log('Unable to parse container URL!');
            }
        }
    }

    async getScenesConfig() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                let config;
                if (this.storateAccountHostUrl && this.blobContainerPath) {
                    const scenesBlob = await axios({
                        method: 'GET',
                        url: `${this.blobProxyServerPath}${this.blobContainerPath}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                        headers: {
                            authorization: 'Bearer ' + token,
                            'x-ms-version': '2017-11-09',
                            'x-blob-host': this.storateAccountHostUrl
                        }
                    });
                    if (scenesBlob.data) {
                        config = scenesBlob.data as IScenesConfig;
                    }
                }

                return new ADTScenesConfigData(config);
            } catch (err) {
                switch (err?.response?.status) {
                    case 404:
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.NonExistentBlob,
                            isCatastrophic: true,
                            rawError: err
                        });
                        break;
                    case 403:
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.UnauthorizedAccess,
                            isCatastrophic: true,
                            rawError: err
                        });
                        break;
                    default:
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.DataFetchFailed,
                            isCatastrophic: true,
                            rawError: err
                        });
                }
            }
        }, 'storage');
    }

    async putScenesConfig(config: IScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                const putBlob = await axios({
                    method: 'PUT',
                    url: `${this.blobProxyServerPath}${this.blobContainerPath}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                    headers: {
                        authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        'x-ms-version': '2017-11-09',
                        'x-blob-host': this.storateAccountHostUrl,
                        'x-ms-blob-type': 'BlockBlob'
                    },
                    data: config
                });
                let result;
                if (putBlob.status === 201) {
                    result = config;
                }

                return new ADTScenesConfigData(result);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    async getContainerBlobs(fileTypes: Array<string>) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                const filesData = await axios({
                    method: 'GET',
                    url: `${this.blobProxyServerPath}${this.blobContainerPath}`,
                    headers: {
                        authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        'x-ms-version': '2017-11-09',
                        'x-blob-host': this.storateAccountHostUrl
                    },
                    params: {
                        restype: 'container',
                        comp: 'list'
                    }
                });
                const filesXML = filesData.data;
                const parser = new XMLParser();
                let files: Array<IBlobFile> = parser.parse(filesXML)
                    ?.EnumerationResults?.Blobs?.Blob;
                if (fileTypes) {
                    files = files.filter((f) =>
                        fileTypes.includes(f.Name?.split('.')?.[1])
                    );
                }
                files.map(
                    (f) =>
                        (f.Path = `https://${this.storateAccountHostUrl}${this.blobContainerPath}/${f.Name}`)
                );

                return new BlobsData(files);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }
}
