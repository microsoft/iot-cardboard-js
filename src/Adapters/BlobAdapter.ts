import { IAuthService, IBlobAdapter } from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { ScenesConfig, Scene } from '../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADTSceneData from '../Models/Classes/AdapterDataClasses/ADTSceneData';
import { ADT3DSceneConfigFileNameInBlobStore } from '../Models/Constants/Constants';

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
        const containerURL = new URL(blobContainerUrl);
        this.storateAccountHostUrl = containerURL.hostname;
        this.blobContainerPath = containerURL.pathname;
        this.blobAuthService = authService;
        this.blobAuthService.login();
        this.blobProxyServerPath = blobProxyServerPath;
    }

    getBlobContainerURL() {
        return `https://${this.storateAccountHostUrl}${this.blobContainerPath}`;
    }

    setBlobContainerPath(blobContainerURL: string) {
        if (blobContainerURL) {
            const url = new URL(blobContainerURL);
            if (url.hostname.endsWith('blob.core.windows.net'))
                this.blobContainerPath = new URL(blobContainerURL).pathname;
        }
    }

    async getScenesConfig() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                const scenesBlob = await axios({
                    method: 'GET',
                    url: `${this.blobProxyServerPath}${this.blobContainerPath}/${ADT3DSceneConfigFileNameInBlobStore}.json`,
                    headers: {
                        authorization: 'Bearer ' + token,
                        'x-ms-version': '2017-11-09',
                        'x-blob-host': this.storateAccountHostUrl
                    }
                });
                let config;
                if (scenesBlob.data) {
                    config = TaJson.parse<ScenesConfig>(
                        JSON.stringify(scenesBlob.data),
                        ScenesConfig
                    );
                }

                return new ADTScenesConfigData(config);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    async putScenesConfig(config: ScenesConfig) {
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
                    data: TaJson.serialize(config)
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

    async addScene(config: ScenesConfig, scene: Scene) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const updatedConfig = { ...config };
                updatedConfig.viewerConfiguration.scenes.push(scene);
                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.getData()) {
                    return new ADTSceneData(scene);
                } else {
                    return new ADTSceneData(null);
                }
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    async editScene(config: ScenesConfig, sceneId: string, scene: Scene) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const sceneIndex: number = config.viewerConfiguration.scenes.findIndex(
                    (s) => s.id === sceneId
                );
                const updatedConfig = { ...config };
                updatedConfig.viewerConfiguration.scenes[sceneIndex] = scene;
                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.result.data) {
                    return new ADTSceneData(scene);
                } else {
                    return new ADTSceneData(null);
                }
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    async deleteScene(config: ScenesConfig, sceneId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const sceneIndex: number = config.viewerConfiguration.scenes.findIndex(
                    (s) => s.id === sceneId
                );
                const updatedConfig = { ...config };
                updatedConfig.viewerConfiguration.scenes.splice(sceneIndex, 1);
                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.getData()) {
                    return new ADTSceneData(
                        config.viewerConfiguration.scenes[sceneIndex]
                    );
                } else {
                    return new ADTSceneData(null);
                }
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
