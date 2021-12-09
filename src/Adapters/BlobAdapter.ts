import { IAuthService, IBlobAdapter } from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { CardErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import ADTScenesData from '../Models/Classes/AdapterDataClasses/ADTScenesData';
import { Config } from '../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';

export default class BlobAdapter implements IBlobAdapter {
    private storateAccountHostUrl: string;
    private blobPath: string;
    private authService: IAuthService;
    private blobProxyServerPath: string;

    constructor(
        storateAccountHostUrl: string,
        blobPath: string,
        authService: IAuthService,
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.storateAccountHostUrl = storateAccountHostUrl;
        this.blobPath = blobPath;
        this.authService = authService;
        this.authService.login();
        this.blobProxyServerPath = blobProxyServerPath;
    }
    async getScenes() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

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
                let scenes = [];
                if (scenesBlob.data) {
                    const sceneConfig = TaJson.parse<Config>(
                        JSON.stringify(scenesBlob.data),
                        Config
                    );
                    scenes = sceneConfig.viewerConfiguration.scenes;
                }

                return new ADTScenesData(scenes);
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
