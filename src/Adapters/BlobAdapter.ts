import { IAuthService, IBlobAdapter } from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { CardErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { Config, Scene } from '../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADTSceneData from '../Models/Classes/AdapterDataClasses/ADTSceneData';

export default class BlobAdapter implements IBlobAdapter {
    protected storateAccountHostUrl: string;
    protected blobPath: string;
    protected blobAuthService: IAuthService;
    protected blobProxyServerPath: string;

    constructor(
        storateAccountHostUrl: string,
        blobPath: string,
        authService: IAuthService,
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.storateAccountHostUrl = storateAccountHostUrl;
        this.blobPath = blobPath;
        this.blobAuthService = authService;
        this.blobAuthService.login();
        this.blobProxyServerPath = blobProxyServerPath;
    }
    async getScenesConfig() {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                const scenesBlob = await axios({
                    method: 'GET',
                    url: `${this.blobProxyServerPath}/${this.blobPath}`,
                    headers: {
                        authorization: 'Bearer ' + token,
                        'x-ms-version': '2017-11-09',
                        'x-blob-host': this.storateAccountHostUrl
                    }
                });
                let scenesConfig;
                if (scenesBlob.data) {
                    const config = TaJson.parse<Config>(
                        JSON.stringify(scenesBlob.data),
                        Config
                    );
                    scenesConfig = config.viewerConfiguration;
                }

                return new ADTScenesConfigData(scenesConfig);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    //TODO: implement this properly
    async addScene(_scene: Scene) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                return new ADTSceneData(null);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    //TODO: implement this properly
    async editScene(_sceneId: string, _scene: Scene) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                return new ADTSceneData(null);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }

    //TODO: implement this properly
    async deleteScene(_sceneId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.blobAuthService
        );
        return await adapterMethodSandbox.safelyFetchData(async (_token) => {
            try {
                return new ADTSceneData(null);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'storage');
    }
}
