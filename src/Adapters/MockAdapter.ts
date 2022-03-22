import {
    ADTAdapterTwinsData,
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
    AdapterMethodParamsForSearchADTTwins,
    IBlobAdapter,
    IBlobFile,
    IGetKeyValuePairsAdditionalParameters,
    linkedTwinName
} from '../Models/Constants';
import seedRandom from 'seedrandom';
import {
    ADTRelationship,
    KeyValuePairData,
    TsiClientData
} from '../Models/Constants/Types';
import { SceneVisual } from '../Models/Classes/SceneView.types';
import mockVConfig from './__mockData__/3DScenesConfiguration.json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADT3DViewerData from '../Models/Classes/AdapterDataClasses/ADT3DViewerData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import { validate3DConfigWithSchema } from '../Models/Services/Utils';
import BlobsData from '../Models/Classes/AdapterDataClasses/BlobsData';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { DatasourceType, ElementType } from '../Models/Classes/3DVConfig';

const mockTwins = [
    {
        $dtId: 'PasteurizationMachine_A01',
        $etag: 'PasteurizationMachineTag',
        $metadata: {
            $model: 'PasteurizationMachine'
        },
        InFlow: 100,
        OutFlow: 150,
        Temperature: 50
    },
    {
        $dtId: 'PasteurizationMachine_A02',
        $etag: 'PasteurizationMachineTag',
        $metadata: {
            $model: 'PasteurizationMachine'
        },
        InFlow: 200,
        OutFlow: 250,
        Temperature: 150
    },
    {
        $dtId: 'PasteurizationMachine_A03',
        $etag: 'PasteurizationMachineTag',
        $metadata: {
            $model: 'PasteurizationMachine'
        },
        InFlow: 300,
        OutFlow: 350,
        Temperature: 250
    },
    {
        $dtId: 'SaltMachine_C1',
        $etag: 'SaltMachineTag',
        $metadata: {
            $model: 'SaltMachine'
        },
        InFlow: 100,
        OutFlow: 150
    },
    {
        $dtId: 'SaltMachine_C2',
        $etag: 'SaltMachineTag',
        $metadata: {
            $model: 'SaltMachine'
        },
        InFlow: 200,
        OutFlow: 250
    }
];

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
    private scenesConfig: I3DScenesConfig;
    private mockEnvironmentHostName =
        'mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net';
    private mockContainerUrl =
        'https://mockStorageAccountName.blob.core.windows.net/mockContainerName';
    private seededRng = seedRandom('cardboard seed');

    constructor(mockAdapterArgs?: IMockAdapter) {
        this.mockData = mockAdapterArgs?.mockData;
        this.scenesConfig = mockAdapterArgs?.mockData || mockVConfig;

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

    async resetSceneConfig() {
        return new AdapterResult<ADTScenesConfigData>({
            result: null,
            errorInfo: null
        });
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
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            await this.mockNetwork();
            // If schema validation fails - error with be thrown and classified by adapterMethodSandbox
            const config = validate3DConfigWithSchema(this.scenesConfig);
            return new ADTScenesConfigData(config);
        });
    }

    async putScenesConfig(config: I3DScenesConfig) {
        try {
            await this.mockNetwork();
            this.scenesConfig = config;
            return new AdapterResult<ADTScenesConfigData>({
                result: new ADTScenesConfigData(this.scenesConfig),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTScenesConfigData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async putBlob(file: File) {
        try {
            await this.mockNetwork();
            const mockBlobFile: IBlobFile = {
                Name: file.name,
                Path: `https://mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net/${file.name}`,
                Properties: { 'Content-Length': file.size }
            };
            return new AdapterResult<BlobsData>({
                result: new BlobsData([mockBlobFile]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<BlobsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
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

    async getSceneData(sceneId: string, config: I3DScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        // get scene based on id
        const scene = config.configuration.scenes?.find(
            (scene) => scene.id === sceneId
        );
        let modelUrl = null;
        const sceneVisuals: SceneVisual[] = [];
        if (scene) {
            // get modelUrl
            modelUrl = scene.assets?.find((asset) => asset.url)?.url;

            if (scene.behaviorIDs) {
                // cycle through behaviors for scene
                for (const sceneBehavior of scene.behaviorIDs) {
                    // cycle through all behaviors
                    // check if behavior is relevent for the current scene
                    for (const behavior of config.configuration?.behaviors)
                        if (sceneBehavior === behavior.id) {
                            const mappingIds: string[] = [];
                            // cycle through the datasources of behavior
                            for (const dataSource of behavior.datasources) {
                                // if its a TwinToObjectMappingDatasource get the mapping id
                                if (
                                    dataSource.type ===
                                    DatasourceType.ElementTwinToObjectMappingDataSource
                                ) {
                                    dataSource.elementIDs.forEach(
                                        (mappingId) => {
                                            mappingIds.push(mappingId);
                                        }
                                    );
                                }

                                // TODO get FilteredTwinDatasources
                            }

                            // cycle through mapping ids to get twins for behavior and scene
                            for (const id of mappingIds) {
                                const twins = {};
                                const mapping: ITwinToObjectMapping = scene.elements.find(
                                    (mapping) =>
                                        mapping.type ===
                                            ElementType.TwinToObjectMapping &&
                                        mapping.id === id
                                ) as ITwinToObjectMapping;

                                if (mapping) {
                                    // get primary twin
                                    twins[linkedTwinName] = mockTwins[
                                        mapping.linkedTwinID
                                    ] || {
                                        $dtId: 'machineID1',
                                        InFlow: 300,
                                        OutFlow: 250,
                                        Temperature: 50,
                                        displayName: 'My Machine 1'
                                    };

                                    // check for twin aliases and add to twins object
                                    if (mapping.twinAliases) {
                                        for (const alias of Object.keys(
                                            mapping.twinAliases
                                        )) {
                                            twins[alias] = mockTwins[alias] || {
                                                $dtId: 'machineID2',
                                                InFlow: 300,
                                                OutFlow: 250,
                                                Temperature: 50,
                                                displayName: 'My Machine 2'
                                            };
                                        }
                                    }

                                    const sceneVisual = new SceneVisual(
                                        mapping.objectIDs,
                                        behavior.visuals,
                                        twins
                                    );
                                    sceneVisuals.push(sceneVisual);
                                }
                            }
                        }
                }
            }
        }

        await this.mockNetwork();
        return await adapterMethodSandbox.safelyFetchData(async () => {
            return new ADT3DViewerData(
                modelUrl, //3d file with public access which does not require authentication to read
                sceneVisuals
            );
        });
    }

    async searchADTTwins(params: AdapterMethodParamsForSearchADTTwins) {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new ADTAdapterTwinsData({
                    value: mockTwins.filter((t) =>
                        t.$dtId.includes(params.searchTerm)
                    )
                }),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTAdapterTwinsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getADTInstances() {
        const mockEnvironments = [
            {
                name: 'mockADTInstanceResourceName',
                hostName:
                    'mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net',
                resourceId: '12345',
                location: 'wcus'
            }
        ];
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new ADTInstancesData(mockEnvironments),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTInstancesData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    getBlobContainerURL = () => {
        return this.mockContainerUrl;
    };

    setBlobContainerPath = (configBlobPath: string) => {
        this.mockContainerUrl = configBlobPath;
    };

    getAdtHostUrl() {
        return this.mockEnvironmentHostName;
    }

    setAdtHostUrl(hostName: string) {
        this.mockEnvironmentHostName = hostName;
    }

    async getTwinsForBehavior(
        _sceneId: string,
        _config: I3DScenesConfig,
        _behavior: IBehavior
    ): Promise<Record<string, any>> {
        return null;
    }

    async getCommonTwinPropertiesForBehavior(
        _sceneId: string,
        _config: I3DScenesConfig,
        _behavior: IBehavior
    ): Promise<string[]> {
        return ['$dtId', 'InFlow', 'OutFlow'];
    }

    async getContainerBlobs() {
        const mockBlobs: Array<IBlobFile> = [
            {
                Name: 'BasicObjects.gltf',
                Path:
                    'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/BasicObjects.gltf',
                Properties: { 'Content-Length': 1000 }
            },
            {
                Name: 'BluePackingLine.gltf',
                Path:
                    'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/BluePackingLine.gltf',
                Properties: { 'Content-Length': 2000 }
            },
            {
                Name: '3DScenesConfiguration.json',
                Path:
                    'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/3DScenesConfiguration.json',
                Properties: { 'Content-Length': 3000 }
            }
        ];
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new BlobsData(mockBlobs),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<BlobsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }
}
