import {
    IAuthService,
    IBlobAdapter,
    IStorageBlob,
    IBlobServiceCorsRule
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import {
    ADT3DSceneConfigFileNameInBlobStore,
    BlobStorageServiceCorsAllowedHeaders,
    BlobStorageServiceCorsAllowedMethods,
    BlobStorageServiceCorsAllowedOrigins,
    LOCAL_STORAGE_KEYS
} from '../Models/Constants/Constants';
import {
    validate3DConfigWithSchema,
    getTimeStamp,
    getUrlFromString,
    validateExplorerOrigin
} from '../Models/Services/Utils';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import {
    StorageBlobsData,
    StorageBlobServiceCorsRulesData
} from '../Models/Classes/AdapterDataClasses/StorageData';
import { I3DScenesConfig } from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import defaultConfig from './__mockData__/3DScenesConfiguration.default.json';
import { ComponentError } from '../Models/Classes';
import { handleMigrations, LogConfigFileTelemetry } from './BlobAdapterUtility';
import { AxiosObjParam } from '../Models/Constants/Types';

const forceCORS =
    localStorage.getItem(LOCAL_STORAGE_KEYS.FeatureFlags.Proxy.forceCORS) ===
    'true';

export default class BlobAdapter implements IBlobAdapter {
    protected storageAccountName: string;
    protected storageAccountHostName: string;
    protected containerName: string;
    protected containerResourceId: string; // resource scope
    protected blobAuthService: IAuthService;
    protected blobProxyServerPath: string;
    protected useBlobProxy: boolean;

    constructor(
        blobContainerUrl: string,
        authService: IAuthService,
        blobProxyServerPath = '/proxy/blob',
        useBlobProxy = true
    ) {
        this.setBlobContainerPath(blobContainerUrl);
        this.blobAuthService = authService;
        this.blobAuthService.login();
        this.blobProxyServerPath = blobProxyServerPath;
        /**
         * Check if class has been initialized with CORS enabled or if origin matches dev or prod explorer urls,
         * override if CORS is forced by feature flag
         *  */
        this.useBlobProxy =
            (useBlobProxy || !validateExplorerOrigin(window.origin)) &&
            !forceCORS;
    }

    getBlobContainerURL() {
        return this.storageAccountHostName && this.containerName
            ? `https://${this.storageAccountHostName}/${this.containerName}`
            : null;
    }

    getStorageAccountURL() {
        return this.storageAccountHostName
            ? `https://${this.storageAccountHostName}`
            : null;
    }

    generateBlobUrl(path: string) {
        if (this.useBlobProxy) {
            return `${this.blobProxyServerPath}${path}`;
        } else {
            if (this.getStorageAccountURL()) {
                // Need to have this done with only storage account since path will always include container name if required
                return `${this.getStorageAccountURL()}${path}`;
            } else {
                return null;
            }
        }
    }

    generateBlobHeaders(headers: AxiosObjParam = {}) {
        if (this.useBlobProxy) {
            return {
                ...headers,
                'x-blob-host': this.storageAccountHostName
            };
        } else {
            return headers;
        }
    }

    async resetSceneConfig() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const copyConfigBlob = async () => {
                const todayDate = getTimeStamp();
                const headers = {
                    authorization: 'Bearer ' + token,
                    'x-ms-version': '2017-11-09',
                    'Content-Type': 'application/json',
                    'x-ms-blob-type': 'BlockBlob',
                    'x-ms-copy-source': `https://${this.storageAccountHostName}/${this.containerName}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                    'x-ms-requires-sync': 'true'
                };
                await axios({
                    method: 'put',
                    url: this.generateBlobUrl(
                        `/${this.containerName}/3DScenesConfiguration_corrupted_${todayDate}.json`
                    ),
                    headers: this.generateBlobHeaders(headers)
                });
                return new ADTScenesConfigData(null);
            };
            try {
                const corruptedConfig = await copyConfigBlob();
                await this.putScenesConfig(defaultConfig);
                return corruptedConfig;
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: error
                });
            }
        }, 'storage');
    }

    setBlobContainerPath(blobContainerURL: string) {
        if (blobContainerURL) {
            try {
                const url = getUrlFromString(blobContainerURL);
                this.storageAccountHostName = url.hostname;
                this.storageAccountName = url.hostname.split('.')[0];
                this.containerName = url.pathname.split('/')[1];
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
                if (this.storageAccountHostName && this.containerName) {
                    const headers = {};
                    headers['x-ms-version'] = '2017-11-09';
                    if (token) {
                        headers['Authorization'] = 'Bearer ' + token;
                    }

                    const scenesBlob = await axios({
                        method: 'GET',
                        url: this.generateBlobUrl(
                            `/${
                                this.containerName
                            }/${ADT3DSceneConfigFileNameInBlobStore}.json?cachebust=${new Date().valueOf()}`
                        ),
                        headers: this.generateBlobHeaders(headers)
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
                handleMigrations(configBlob.data);
                LogConfigFileTelemetry(configBlob.data); // fire and forget the telemetry logging
                return configBlob;
            } catch (err) {
                if (
                    err instanceof ComponentError &&
                    err.type === ComponentErrorType.JsonSchemaError
                ) {
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
                    case 500:
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.InternalServerError,
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

    putScenesConfig(config: I3DScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        const headers = {
            'Content-Type': 'application/json',
            'x-ms-version': '2017-11-09',
            'x-ms-blob-type': 'BlockBlob'
        };
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTScenesConfigData,
            {
                method: 'put',
                url: this.generateBlobUrl(
                    `/${this.containerName}/${ADT3DSceneConfigFileNameInBlobStore}.json`
                ),
                headers: this.generateBlobHeaders(headers),
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
            const headers = {
                authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                'x-ms-version': '2017-11-09'
            };
            try {
                const filesData = await axios({
                    method: 'GET',
                    url: this.generateBlobUrl(`/${this.containerName}`),
                    headers: this.generateBlobHeaders(headers),
                    params: {
                        restype: 'container',
                        comp: 'list'
                    }
                });
                const filesXML = filesData.data;
                const parser = new XMLParser();
                let files: Array<IStorageBlob> = parser.parse(filesXML)
                    ?.EnumerationResults?.Blobs?.Blob;
                if (fileTypes) {
                    files = files.filter((f) =>
                        fileTypes.includes(f.Name?.split('.')?.[1])
                    );
                }
                files.map(
                    (f) =>
                        (f.Path = `https://${this.storageAccountHostName}/${this.containerName}/${f.Name}`)
                );

                return new StorageBlobsData(files);
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
            // successful response data is always empty string which is not useful
            if (apiResponse === '') {
                const blobFile: IStorageBlob = {
                    Name: file.name,
                    Path: `https://${this.storageAccountHostName}/${this.containerName}/${file.name}`,
                    Properties: { 'Content-Length': file.size }
                };
                return [blobFile];
            } else {
                return null;
            }
        };

        const headers = {
            'x-ms-version': '2017-11-09',
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': 'application/octet-stream'
        };
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            StorageBlobsData,
            {
                method: 'put',
                url: this.generateBlobUrl(
                    `/${this.containerName}/${file.name}`
                ),
                headers: this.generateBlobHeaders(headers),
                data: file
            },
            createBlobFileData,
            'storage'
        );
    }

    // This method fetches the properties of storage account
    getBlobServiceCorsProperties() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        const getCorsData = (apiResponse: string) => {
            if (apiResponse) {
                const parser = new XMLParser();
                const parsedCors = parser.parse(apiResponse)
                    ?.StorageServiceProperties?.Cors;

                const corsRules: Array<IBlobServiceCorsRule> = [];
                if (parsedCors) {
                    if (Array.isArray(parsedCors.CorsRule)) {
                        parsedCors.CorsRule.map((corsRule: any) => {
                            corsRules.push({
                                AllowedOrigins: corsRule.AllowedOrigins.split(
                                    ','
                                ),
                                AllowedMethods: corsRule.AllowedMethods.split(
                                    ','
                                ),
                                AllowedHeaders: corsRule.AllowedHeaders.split(
                                    ','
                                )
                            } as IBlobServiceCorsRule);
                        });
                    } else {
                        corsRules.push({
                            AllowedOrigins: parsedCors.CorsRule.AllowedOrigins.split(
                                ','
                            ),
                            AllowedMethods: parsedCors.CorsRule.AllowedMethods.split(
                                ','
                            ),
                            AllowedHeaders: parsedCors.CorsRule.AllowedHeaders.split(
                                ','
                            )
                        } as IBlobServiceCorsRule);
                    }
                }

                const uniqueAllowedOrigins = new Set(
                    ...corsRules.map((rule) => rule.AllowedOrigins)
                );
                const originToMethodsAndHeadersMapping: Record<
                    string, //origin
                    {
                        allowedMethods: Array<string>;
                        allowedHeaders: Array<string>;
                    }
                > = {};
                uniqueAllowedOrigins.forEach((origin) => {
                    originToMethodsAndHeadersMapping[origin] = {
                        allowedMethods: corsRules.reduce((acc, rule) => {
                            if (rule.AllowedOrigins.includes(origin)) {
                                acc = [...acc, ...rule.AllowedMethods];
                            }
                            return acc;
                        }, []),
                        allowedHeaders: corsRules.reduce((acc, rule) => {
                            if (rule.AllowedOrigins.includes(origin)) {
                                acc = [...acc, ...rule.AllowedHeaders];
                            }
                            return acc;
                        }, [])
                    };
                });

                const hasProperOrigins = [
                    ...BlobStorageServiceCorsAllowedOrigins,
                    '*'
                ].some((origin: string) =>
                    Object.keys(originToMethodsAndHeadersMapping).includes(
                        origin
                    )
                );
                const hasProperMethods = BlobStorageServiceCorsAllowedMethods.every(
                    (method: string) =>
                        Object.values(originToMethodsAndHeadersMapping)
                            .map((mapping) => mapping.allowedMethods)
                            .reduce(
                                (acc: boolean, methodGroup) =>
                                    acc && methodGroup.includes(method),
                                true
                            )
                );
                const hasProperHeaders =
                    BlobStorageServiceCorsAllowedHeaders.every(
                        (header: string) =>
                            Object.values(originToMethodsAndHeadersMapping)
                                .map((mapping) => mapping.allowedHeaders)
                                .reduce(
                                    (acc: boolean, headerGroup) =>
                                        acc &&
                                        headerGroup?.findIndex(
                                            (h) =>
                                                h.toLowerCase() ===
                                                header.toLowerCase()
                                        ) !== -1,
                                    true
                                )
                    ) ||
                    ['*'].every((header: string) =>
                        Object.values(originToMethodsAndHeadersMapping)
                            .map((mapping) => mapping.allowedHeaders)
                            .reduce(
                                (acc: boolean, headerGroup) =>
                                    acc && headerGroup?.includes(header),
                                true
                            )
                    );
                if (hasProperOrigins && hasProperMethods && hasProperHeaders) {
                    return corsRules;
                } else if (hasProperOrigins && hasProperMethods) {
                    if (this.useBlobProxy) {
                        // don't show CORS update available for proxy users, just return existing cors properties
                        return corsRules;
                    } else {
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.ForceCORSError,
                            isCatastrophic: true
                        });
                    }
                } else {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.CORSError,
                        isCatastrophic: true
                    });
                }
            } else {
                return null;
            }
        };

        const headers = {
            'x-ms-version': '2021-06-08'
        };
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            StorageBlobServiceCorsRulesData,
            {
                method: 'get',
                // URL here requires storage account with container name removed
                url: this.generateBlobUrl(''),
                headers: this.generateBlobHeaders(headers),
                params: {
                    restype: 'service',
                    comp: 'properties'
                }
            },
            getCorsData,
            'storage'
        );
    }

    // TODO: make sure you don't override but append missing CORS rules
    setBlobServiceCorsProperties() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        const builder = new XMLBuilder({
            ignoreAttributes: false
        });
        const xmlContent = builder.build({
            StorageServiceProperties: {
                Cors: {
                    CorsRule: {
                        AllowedOrigins: BlobStorageServiceCorsAllowedOrigins.join(),
                        AllowedMethods: BlobStorageServiceCorsAllowedMethods.join(),
                        AllowedHeaders: BlobStorageServiceCorsAllowedHeaders.join(),
                        ExposedHeaders: '',
                        MaxAgeInSeconds: 0
                    }
                }
            }
        });

        const headers = {
            'x-ms-version': '2020-08-04',
            'Content-Type': 'text/xml'
        };
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            StorageBlobServiceCorsRulesData,
            {
                method: 'put',
                // URL here requires storage account url with container name removed
                url: this.generateBlobUrl(''),
                headers: this.generateBlobHeaders(headers),
                params: {
                    restype: 'service',
                    comp: 'properties'
                },
                data: xmlContent
            },
            undefined,
            'storage'
        );
    }
}
