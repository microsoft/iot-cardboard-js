import { IAuthService, IBlobAdapter } from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { IScenesConfig, IBehavior, IScene } from '../Models/Classes/3DVConfig';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADTSceneData from '../Models/Classes/AdapterDataClasses/ADTSceneData';
import { ADT3DSceneConfigFileNameInBlobStore } from '../Models/Constants/Constants';
import ViewConfigBehaviorData from '../Models/Classes/AdapterDataClasses/ViewConfigBehaviorData';

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
            const url = new URL(blobContainerURL);
            if (url.hostname.endsWith('blob.core.windows.net')) {
                this.storateAccountHostUrl = url.hostname;
                this.blobContainerPath = url.pathname;
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
                if (err?.response?.status === 404) {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.NonExistantBlob,
                        isCatastrophic: false,
                        rawError: err,
                        message: err.response.statusText
                    });
                } else {
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

    async addScene(config: IScenesConfig, scene: IScene) {
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

    async editScene(config: IScenesConfig, sceneId: string, scene: IScene) {
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

    async deleteScene(config: IScenesConfig, sceneId: string) {
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

    async addBehavior(
        config: IScenesConfig,
        sceneId: string,
        behavior: IBehavior
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const updatedConfig = { ...config };
                updatedConfig.viewerConfiguration.behaviors.push(behavior);
                updatedConfig.viewerConfiguration.scenes
                    .find((scene) => scene.id === sceneId)
                    ?.behaviors?.push(behavior.id);

                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.getData()) {
                    return new ViewConfigBehaviorData(behavior);
                } else {
                    return new ViewConfigBehaviorData(null);
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

    async editBehavior(
        config: IScenesConfig,
        behavior: IBehavior,
        originalBehaviorId: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const updatedConfig = { ...config };

                // Update modified behavior
                const behaviorIdx = updatedConfig.viewerConfiguration.behaviors.findIndex(
                    (b) => b.id === originalBehaviorId
                );
                updatedConfig.viewerConfiguration.behaviors[
                    behaviorIdx
                ] = behavior;

                // If behavior ID changed, update matching scene behavior Ids with updated Id
                if (behavior.id !== originalBehaviorId) {
                    updatedConfig.viewerConfiguration.scenes.forEach(
                        (scene) => {
                            const behaviorIdIdxInSceneBehaviors = scene?.behaviors?.indexOf(
                                originalBehaviorId
                            );
                            if (behaviorIdIdxInSceneBehaviors !== -1) {
                                scene.behaviors[behaviorIdIdxInSceneBehaviors] =
                                    behavior.id;
                            }
                        }
                    );
                }

                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.getData()) {
                    return new ViewConfigBehaviorData(behavior);
                } else {
                    return new ViewConfigBehaviorData(null);
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

    async deleteBehavior(config: IScenesConfig, behavior: IBehavior) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                const updatedConfig = { ...config };

                // Splice behavior out of behavior list
                const behaviorIdx = updatedConfig.viewerConfiguration.behaviors.findIndex(
                    (b) => b.id === behavior.id
                );

                if (behaviorIdx !== -1) {
                    updatedConfig.viewerConfiguration.behaviors.splice(
                        behaviorIdx,
                        1
                    );
                }

                // If matching behavior Id found in ANY scene, splice out scene's behavior Id array
                updatedConfig.viewerConfiguration.scenes.forEach((scene) => {
                    const matchingBehaviorIdIdx = scene.behaviors.indexOf(
                        behavior.id
                    );
                    if (matchingBehaviorIdIdx !== -1) {
                        scene.behaviors.splice(matchingBehaviorIdIdx, 1);
                    }
                });

                const putConfigResult = await this.putScenesConfig(
                    updatedConfig
                );
                if (putConfigResult.getData()) {
                    return new ViewConfigBehaviorData(behavior);
                } else {
                    return new ViewConfigBehaviorData(null);
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
