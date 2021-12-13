import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import ADTModelData from '../Models/Classes/AdapterDataClasses/ADTModelData';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterResult from '../Models/Classes/AdapterResult';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentError } from '../Models/Classes/Errors';
import { ADTRelationshipsData } from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import {
    IADT3DViewerAdapter,
    IADTAdapter,
    IKeyValuePairAdapter,
    IMockAdapter,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import {
    IBlobAdapter,
    IGetKeyValuePairsAdditionalParameters
} from '../Models/Constants';
import seedRandom from 'seedrandom';
import {
    ADTRelationship,
    KeyValuePairData,
    TsiClientData
} from '../Models/Constants/Types';
import ADTVisualTwinData from '../Models/Classes/AdapterDataClasses/ADTVisualTwinData';
import { SceneViewLabel } from '../Models/Classes/SceneView.types';
import mockVConfig from '../../.storybook/test_data/vconfig-MattReworkFusionChristian.json';
import { Config, Scene } from '../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADTSceneData from '../Models/Classes/AdapterDataClasses/ADTSceneData';

export default class MockAdapter
    implements
        IKeyValuePairAdapter,
        IADT3DViewerAdapter,
        ITsiClientChartDataAdapter,
        IBlobAdapter,
        Partial<IADTAdapter> {
    private mockData = null;
    private mockError = null;
    private networkTimeoutMillis;
    private isDataStatic;
    private seededRng = seedRandom('cardboard seed');

    constructor(mockAdapterArgs?: IMockAdapter) {
        this.mockData = mockAdapterArgs?.mockData;
        this.mockError = mockAdapterArgs?.mockError;
        this.networkTimeoutMillis =
            typeof mockAdapterArgs?.networkTimeoutMillis === 'number'
                ? mockAdapterArgs.networkTimeoutMillis
                : 0;
        this.isDataStatic =
            typeof mockAdapterArgs?.isDataStatic === 'boolean'
                ? mockAdapterArgs.isDataStatic
                : true;
    }

    async mockNetwork() {
        // If mocking network latency, wait for networkTimeoutMillis
        if (this.networkTimeoutMillis > 0) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, this.networkTimeoutMillis);
            });
        }

        // throw error if mock error type passed into adapter
        if (this.mockError) {
            throw new ComponentError({
                isCatastrophic: true,
                type: this.mockError,
                rawError: new Error('Mock error message')
            });
        }
    }

    async getKeyValuePairs(
        _id: string,
        properties: string[],
        additionalParameters: IGetKeyValuePairsAdditionalParameters
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            const getKVPData = () => {
                const kvps = [];
                properties.forEach((p) => {
                    const kvp = {} as KeyValuePairData;
                    kvp.key = p;
                    kvp.value = this.isDataStatic
                        ? this.seededRng()
                        : Math.random();
                    if (additionalParameters?.isTimestampIncluded) {
                        kvp.timestamp = this.isDataStatic
                            ? new Date(1616712321258)
                            : new Date();
                    }
                    kvps.push(kvp);
                });
                return kvps;
            };

            await this.mockNetwork();
            return new KeyValuePairAdapterData(getKVPData());
        });
    }

    generateMockLineChartData(
        searchSpan: SearchSpan,
        properties: string[]
    ): TsiClientData {
        const data = [];
        const from = searchSpan.from;
        const to = searchSpan.to;
        const bucketSizeMillis =
            searchSpan.bucketSizeMillis ||
            Math.ceil((to.valueOf() - from.valueOf()) / 100);
        for (let i = 0; i < properties.length; i++) {
            const lines = {};
            data.push({ [properties[i]]: lines });
            for (let j = 0; j < 1; j++) {
                const values = {};
                lines[''] = values;
                for (let k = 0; k < 60; k++) {
                    if (!(k % 2 && k % 3)) {
                        // if check is to create some sparseness in the data
                        const to = new Date(
                            from.valueOf() + bucketSizeMillis * k
                        );
                        const val = this.isDataStatic
                            ? this.seededRng()
                            : Math.random();
                        values[to.toISOString()] = { avg: val };
                    }
                }
            }
        }
        return data;
    }

    async getRelationships(id: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            const getRelationshipsData = () => {
                const relationships: ADTRelationship[] = [];
                for (let i = 1; i <= 5; i++) {
                    relationships.push({
                        relationshipId: `relationship ${id}`,
                        relationshipName: `relationship ${i}`,
                        targetId: `target twin ${i}`,
                        targetModel: `target model ${i}`
                    });
                }
                return relationships;
            };

            await this.mockNetwork();

            return new ADTRelationshipsData(getRelationshipsData());
        });
    }

    async getADTModel(modelId: string) {
        try {
            const getModelData = () => {
                return new ADTModelData({
                    id: modelId,
                    description: {},
                    displayName: null,
                    decommissioned: false,
                    uploadTime: '2021-1-1'
                });
            };

            await this.mockNetwork();

            return new AdapterResult<ADTModelData>({
                result: getModelData(),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTModelData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getADTTwin(twinId: string) {
        try {
            const getTwinData = () => {
                return new ADTTwinData({
                    $dtId: twinId,
                    $etag: `${twinId}Tag`,
                    $metadata: {
                        $model: `${twinId}Model`
                    }
                });
            };

            await this.mockNetwork();

            return new AdapterResult<ADTTwinData>({
                result: getTwinData(),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTTwinData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getScenesConfig() {
        try {
            const sceneConfig = TaJson.parse<Config>(
                JSON.stringify(mockVConfig),
                Config
            );
            await this.mockNetwork();

            return new AdapterResult<ADTScenesConfigData>({
                result: new ADTScenesConfigData(sceneConfig),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTScenesConfigData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    //TODO: implement this properly
    async addScene(_config: Config, _scene: Scene) {
        await this.mockNetwork();
        return new AdapterResult<ADTSceneData>({
            result: null,
            errorInfo: null
        });
    }

    //TODO: implement this properly
    async editScene(_config: Config, _sceneId: string, _scene: Scene) {
        await this.mockNetwork();
        return new AdapterResult<ADTSceneData>({
            result: null,
            errorInfo: null
        });
    }

    //TODO: implement this properly
    async deleteScene(_config: Config, _sceneId: string) {
        await this.mockNetwork();
        return new AdapterResult<ADTSceneData>({
            result: null,
            errorInfo: null
        });
    }

    async getTsiclientChartDataShape(
        _id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            const getData = (): TsiClientData => {
                if (this.mockData !== undefined) {
                    return this.mockData;
                } else {
                    return this.generateMockLineChartData(
                        searchSpan,
                        properties
                    );
                }
            };

            await this.mockNetwork();
            return new TsiClientAdapterData(getData());
        });
    }

    async getVisualADTTwin(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        const getData = () => {
            const label1 = new SceneViewLabel();
            label1.color = '#FF0000';
            label1.meshIds = ['Model_primitive2'];
            label1.metric = `${twinId} Temperature`;
            label1.value = 45;
            const label2 = new SceneViewLabel();
            label2.color = '#FFFF00';
            label2.meshIds = ['Model_primitive1'];
            label2.metric = `${twinId} Pressure`;
            label2.value = 43;
            const labels = [label1, label2];
            return labels;
        };
        await this.mockNetwork();
        return await adapterMethodSandbox.safelyFetchData(async () => {
            return new ADTVisualTwinData(
                'https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/factory/4992245be3164456a07d1b237c24f016.gltf',
                getData()
            );
        });
    }
}
