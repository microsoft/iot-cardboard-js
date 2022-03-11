import {
    IAuthService,
    IBlobAdapter,
    IBlobFile
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import { ADT3DSceneConfigFileNameInBlobStore } from '../Models/Constants/Constants';
import { validate3DConfigWithSchema } from '../Models/Services/Utils';
import { XMLParser } from 'fast-xml-parser';
import BlobsData from '../Models/Classes/AdapterDataClasses/BlobsData';
import { I3DScenesConfig } from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import defaultConfig from './__mockData__/3DScenesConfiguration.default.json';
import { ComponentError } from '../Models/Classes';

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
                console.error('Unable to parse container URL!');
            }
        }
    }

    async getScenesConfig() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const getConfigBlob = async () => {
                let config: I3DScenesConfig;
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
                        config = validate3DConfigWithSchema(scenesBlob.data);
                    } else {
                        throw new Error('Data not found');
                    }
                }
                return new ADTScenesConfigData(config);
            };

            try {
                const configBlob = await getConfigBlob();
                return configBlob;
            } catch (err) {
                if (
                    err instanceof ComponentError &&
                    err.type === ComponentErrorType.JsonSchemaError
                ) {
                    // If JsonSchemaError - throw to adapter sandbox to classify
                    throw err;
                }
                switch (err?.response?.status) {
                    case 404:
                        // If config does not exist, create, then retry getting config blob
                        await this.putScenesConfig(defaultConfig);
                        return await getConfigBlob();
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

    async putScenesConfig(config: I3DScenesConfig) {
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
                        'x-blob-host': this.storageAccountHostUrl,
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
}
