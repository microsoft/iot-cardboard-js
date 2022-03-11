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
    protected storageAccountHostUrl: string;
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
            this.storageAccountHostUrl = containerURL.hostname;
            this.blobContainerPath = containerURL.pathname;
        }
        this.blobAuthService = authService;
        this.blobAuthService.login();
        this.blobProxyServerPath = blobProxyServerPath;
    }

    getBlobContainerURL() {
        return this.storageAccountHostUrl && this.blobContainerPath
            ? `https://${this.storageAccountHostUrl}${this.blobContainerPath}`
            : '';
    }

    setBlobContainerPath(blobContainerURL: string) {
        if (blobContainerURL) {
            try {
                const url = new URL(blobContainerURL);
                if (url.hostname.endsWith('blob.core.windows.net')) {
                    this.storageAccountHostUrl = url.hostname;
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
                if (this.storageAccountHostUrl && this.blobContainerPath) {
                    const scenesBlob = await axios({
                        method: 'GET',
                        url: `${this.blobProxyServerPath}${this.blobContainerPath}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                        headers: {
                            authorization: 'Bearer ' + token,
                            'x-ms-version': '2017-11-09',
                            'x-blob-host': this.storageAccountHostUrl
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

    putScenesConfig(config: IScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTScenesConfigData,
            {
                method: 'put',
                url: `${this.blobProxyServerPath}${this.blobContainerPath}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-ms-version': '2017-11-09',
                    'x-blob-host': this.storageAccountHostUrl,
                    'x-ms-blob-type': 'BlockBlob'
                },
                data: config
            },
            undefined,
            'storage'
        );
    }

    /**
     * This method pulls blobs/files from container using List Blob API (https://docs.microsoft.com/en-us/rest/api/storageservices/list-blobs)
     * and accepts an array of file types to be used to filter those files. It parses XML response into JSON and returns adapter data with array of blobs
     */
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
                        'x-blob-host': this.storageAccountHostUrl
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
                        (f.Path = `https://${this.storageAccountHostUrl}${this.blobContainerPath}/${f.Name}`)
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

    // This method create/update existing blob in the container using Put Blob API (https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob)
    putBlob(file: File) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        const createBlobFileData = (apiResponse: string) => {
            // successful response data is alwasy empty string which is not useful
            if (apiResponse === '') {
                const blobFile: IBlobFile = {
                    Name: file.name,
                    Path: `https://${this.storageAccountHostUrl}${this.blobContainerPath}/${file.name}`,
                    Properties: { 'Content-Length': file.size }
                };
                return [blobFile];
            } else {
                return null;
            }
        };

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            BlobsData,
            {
                method: 'put',
                url: `${this.blobProxyServerPath}${this.blobContainerPath}/${file.name}`,
                headers: {
                    'x-ms-version': '2017-11-09',
                    'x-blob-host': this.storageAccountHostUrl,
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Length': file.size,
                    'Content-Type': 'application/octet-stream'
                },
                data: file
            },
            createBlobFileData,
            'storage'
        );
    }
}
