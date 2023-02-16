import {
    ADTAdapterTwinsData,
    KeyValuePairAdapterData
} from '../Models/Classes';
import ADTModelData, {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterResult from '../Models/Classes/AdapterResult';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentError } from '../Models/Classes/Errors';
import {
    ADTRelationshipData,
    ADTRelationshipsData
} from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import {
    IADT3DViewerAdapter,
    IADTAdapter,
    IKeyValuePairAdapter,
    IMockAdapter
} from '../Models/Constants/Interfaces';
import {
    AdapterMethodParamsForSearchADTTwins,
    ADTPatch,
    ComponentErrorType,
    DtdlInterface,
    IADTTwin,
    IBlobAdapter,
    IStorageBlob,
    IGetKeyValuePairsAdditionalParameters,
    IModelledPropertyBuilderAdapter,
    IPropertyInspectorAdapter,
    IAzureResource,
    PRIMARY_TWIN_NAME,
    AzureResourceTypes,
    AzureAccessPermissionRoleGroups,
    IAzureRoleAssignment,
    BlobStorageServiceCorsAllowedOrigins,
    BlobStorageServiceCorsAllowedMethods,
    BlobStorageServiceCorsAllowedHeaders,
    AzureResourceDisplayFields,
    AdapterMethodParamsForGetAzureResources,
    RequiredAccessRoleGroupForStorageContainer,
    AdapterMethodParamsForSearchTwinsByQuery,
    IADXConnection,
    ADXTimeSeries,
    IMockError,
    TimeSeriesData,
    IMockData
} from '../Models/Constants';
import seedRandom from 'seedrandom';
import { ADTRelationship, KeyValuePairData } from '../Models/Constants/Types';
import { SceneVisual } from '../Models/Classes/SceneView.types';
import mockVConfig from './__mockData__/3DScenesConfiguration.json';
import mockTwinData from './__mockData__/MockAdapterData/MockTwinData.json';
import mockModelData from './__mockData__/MockAdapterData/MockModelData.json';
import mockADTInstanceResourceGraphData from './__mockData__/MockAdapterData/MockResourceGraphDataForADTInstances.json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADT3DViewerData from '../Models/Classes/AdapterDataClasses/ADT3DViewerData';
import {
    AzureMissingRoleDefinitionsData,
    AzureResourceData,
    AzureResourcesData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
    createGUID,
    getModelContentType,
    parseDTDLModelsAsync,
    validate3DConfigWithSchema
} from '../Models/Services/Utils';
import {
    StorageBlobsData,
    StorageBlobServiceCorsRulesData
} from '../Models/Classes/AdapterDataClasses/StorageData';
import {
    I3DScenesConfig,
    ITwinToObjectMapping
} from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { DatasourceType, ElementType } from '../Models/Classes/3DVConfig';
import { ADTAdapterPatchData } from '../Models/Classes/AdapterDataClasses/ADTAdapterData';
import ExpandedADTModelData from '../Models/Classes/AdapterDataClasses/ExpandedADTModelData';
import { applyPatch, Operation } from 'fast-json-patch';
import { DTDLType } from '../Models/Classes/DTDL';
import i18n from '../i18n';
import ViewerConfigUtility from '../Models/Classes/ViewerConfigUtility';
import ADTInstanceTimeSeriesConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceTimeSeriesConnectionData';
import { handleMigrations } from './BlobAdapterUtility';
import ADXTimeSeriesData from '../Models/Classes/AdapterDataClasses/ADXTimeSeriesData';
import { getMockTimeSeriesDataArrayInLocalTime } from '../Models/SharedUtils/DataHistoryUtils';
import { IPowerBIWidgetBuilderAdapter } from '../Components/PowerBIWidget/Internal/PowerBIWidgetBuilder/PowerBIWidgetBuilder.types';
import { IVisual, IPage } from 'powerbi-models';

export default class MockAdapter
    implements
        IKeyValuePairAdapter,
        IADT3DViewerAdapter,
        IBlobAdapter,
        Partial<IADTAdapter>,
        IPropertyInspectorAdapter,
        IModelledPropertyBuilderAdapter,
        IPowerBIWidgetBuilderAdapter {
    private mockError: IMockError = null;
    public mockData: IMockData = {
        scenesConfig: mockVConfig as I3DScenesConfig,
        models: mockModelData as DtdlInterface[],
        twins: mockTwinData,
        timeSeriesDataList: null
    };
    private networkTimeoutMillis;
    private isDataStatic;
    private mockEnvironmentHostName =
        'mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net';
    private mockContainerUrl =
        'https://mockStorageAccountName.blob.core.windows.net/mockContainerName';
    private mockADXConnectionInformation: IADXConnection = {
        kustoClusterUrl:
            'https://mockKustoClusterName.westus2.kusto.windows.net',
        kustoDatabaseName: 'mockKustoDatabaseName',
        kustoTableName: 'mockKustoTableName'
    };
    private seededRng = seedRandom('cardboard seed');
    private mockTwinPropertiesMap: {
        [id: string]: Record<string, unknown>;
    } = {};

    constructor(mockAdapterArgs?: IMockAdapter) {
        this.mockData = {
            ...this.mockData,
            ...(mockAdapterArgs?.mockData && mockAdapterArgs?.mockData)
        };
        this.mockError = mockAdapterArgs?.mockError;

        this.networkTimeoutMillis =
            typeof mockAdapterArgs?.networkTimeoutMillis === 'number'
                ? mockAdapterArgs.networkTimeoutMillis
                : 0;
        this.isDataStatic =
            typeof mockAdapterArgs?.isDataStatic === 'boolean'
                ? mockAdapterArgs.isDataStatic
                : true;

        this.initializeMockTwinProperties();
    }
    getVisualsOnPage(reportUrl: string, pageName: string): Promise<IVisual[]> {
        if (!reportUrl || !pageName) {
            return Promise.resolve([]);
        }
        // eslint-disable-next-line no-debugger
        debugger;
        if (pageName === 'page1') {
            return Promise.resolve([
                {
                    name: 'visual1',
                    title: 'visual1',
                    type: 'barChart'
                },
                {
                    name: 'visual2',
                    title: 'visual2',
                    type: 'textbox'
                },
                {
                    name: 'visual3',
                    title: 'visual3',
                    type: 'lineChart'
                },
                {
                    name: 'visual4',
                    title: 'visual4',
                    type: 'actionButton'
                }
            ]);
        }
        return Promise.resolve([
            {
                name: 'otherVisual1',
                title: 'Other Visual1',
                type: 'barChart'
            },
            {
                name: 'otherVisual2',
                title: 'Other Visual2',
                type: 'textbox'
            },
            {
                name: 'otherVisual3',
                title: 'Other Visual3',
                type: 'lineChart'
            },
            {
                name: 'otherVisual4',
                title: 'Other Visual4',
                type: 'actionButton'
            }
        ]);
    }
    getPagesInReport(reportUrl: string): Promise<IPage[]> {
        if (!reportUrl) {
            return Promise.resolve([]);
        }
        return Promise.resolve([
            {
                name: 'page1',
                displayName: 'page1',
                isActive: true
            },
            {
                name: 'page2',
                displayName: 'page2',
                isActive: false
            }
        ]);
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
                type: this.mockError.type,
                rawError:
                    this.mockError.rawError || new Error('Mock error message')
            });
        }
    }

    async resetSceneConfig() {
        return new AdapterResult<ADTScenesConfigData>({
            result: null,
            errorInfo: null
        });
    }

    async getModelIdFromTwinId(twinId: string) {
        const twinResult = await this.getADTTwin(twinId);
        const twinData = twinResult.getData();
        const modelId = twinData.$metadata.$model;

        return new AdapterResult<ADTTwinToModelMappingData>({
            result: new ADTTwinToModelMappingData({
                twinId,
                modelId
            }),
            errorInfo: null
        });
    }

    async getAllAdtModels() {
        const rawModels = this.mockData.models || [];
        const parsedModels = await parseDTDLModelsAsync(rawModels);
        return new AdapterResult<ADTAllModelsData>({
            result: new ADTAllModelsData({ rawModels, parsedModels }),
            errorInfo: null
        });
    }

    async updateTwin(twinId: string, patches: ADTPatch[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            await this.mockNetwork();

            const targetTwin = this.mockData.twins?.find(
                (twin) => twin.$dtId === twinId
            );

            if (targetTwin) {
                const patchRes = applyPatch(
                    targetTwin,
                    patches as Operation[],
                    true,
                    true
                );
                console.log('Mock update twin patch res: ', patchRes);
                return new ADTAdapterPatchData(patches);
            } else {
                throw new ComponentError({
                    isCatastrophic: true,
                    type: ComponentErrorType.UnknownError,
                    rawError: new Error('Twin ID not found')
                });
            }
        });
    }

    // Stub method to adhere to interface (not currently used in mock environment)
    async updateRelationship(
        _twinId: string,
        _relationshipId: string,
        patches: ADTPatch[]
    ) {
        return new AdapterResult<ADTAdapterPatchData>({
            result: new ADTAdapterPatchData(patches),
            errorInfo: null
        });
    }

    // Stub method to adhere to interface (not currently used in mock environment)
    async getADTRelationship(_twinId: string, _relationshipId: string) {
        return new AdapterResult<ADTRelationshipData>({
            result: null,
            errorInfo: null
        });
    }

    async getExpandedAdtModel(modelId: string, baseModelIds?: string[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        return await adapterMethodSandbox.safelyFetchData(async () => {
            await this.mockNetwork();

            const expandedModels: DtdlInterface[] = [];

            const recursivelyAddToExpandedModels = (modelId: string) => {
                try {
                    // add root model
                    const rootModel = this.mockData.models?.find(
                        (m) => m['@id'] === modelId
                    );

                    if (!rootModel) {
                        throw new Error(`${modelId} not found`);
                    }

                    expandedModels.push(rootModel);

                    // recursively add extended models
                    const rawExtendedModelIds = rootModel.extends;

                    if (rawExtendedModelIds) {
                        const extendedModelsIds = Array.isArray(
                            rawExtendedModelIds
                        )
                            ? rawExtendedModelIds
                            : [rawExtendedModelIds];

                        for (const mId of extendedModelsIds) {
                            recursivelyAddToExpandedModels(mId);
                        }
                    }

                    // add component models
                    const componentModelIds = rootModel?.contents
                        ?.filter(
                            (m) =>
                                getModelContentType(m['@type']) ===
                                DTDLType.Component
                        )
                        ?.map((m) => 'schema' in m && (m.schema as string));

                    if (componentModelIds) {
                        for (const mId of componentModelIds) {
                            recursivelyAddToExpandedModels(mId);
                        }
                    }
                } catch (err) {
                    adapterMethodSandbox.pushError({
                        isCatastrophic: false,
                        rawError: err,
                        message: i18n.t('propertyInspector.modelNotFound', {
                            modelId
                        })
                    });
                    return;
                }
            };

            // If list of base models known, fetch all models directly
            if (baseModelIds) {
                for (const mId of [modelId, ...baseModelIds]) {
                    try {
                        const model = this.mockData.models?.find(
                            (m) => m['@id'] === mId
                        );
                        if (!model) {
                            throw new Error(`${modelId} not found`);
                        }
                        expandedModels.push(model);
                    } catch (err) {
                        adapterMethodSandbox.pushError({
                            isCatastrophic: false,
                            rawError: err,
                            message: i18n.t('propertyInspector.modelNotFound', {
                                modelId
                            })
                        });
                    }
                }
            } else {
                // If base models unknown, recursively expand and fetch in sequence
                recursivelyAddToExpandedModels(modelId);
            }

            return new ExpandedADTModelData({
                expandedModels,
                rootModel: expandedModels.find(
                    (model) => model['@id'] === modelId
                )
            });
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
            const getTwinData = (id: string) => {
                const twinData: IADTTwin = {
                    $dtId: id,
                    $etag: `${id}Tag`,
                    $metadata: {
                        $model: `${id}Model`
                    }
                };
                // add on the mock properties
                const additionalProperties = this.mockTwinPropertiesMap[id] || {
                    InFlow: 50,
                    OutFlow: 30
                };
                for (const property of Object.keys(additionalProperties)) {
                    twinData[property] = additionalProperties[property];
                }
                const data = new ADTTwinData(twinData);
                return data;
            };

            await this.mockNetwork();

            const mockTwin = this.mockData.twins?.find(
                (twin) => twin.$dtId === twinId
            );

            return new AdapterResult<ADTTwinData>({
                result: mockTwin
                    ? new ADTTwinData(mockTwin)
                    : getTwinData(twinId),
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
            const config = validate3DConfigWithSchema(
                this.mockData.scenesConfig
            );
            // To test out migrations with mock data
            handleMigrations(config);
            return new ADTScenesConfigData(config);
        });
    }

    async putScenesConfig(config: I3DScenesConfig) {
        try {
            await this.mockNetwork();
            this.mockData.scenesConfig = config;
            return new AdapterResult<ADTScenesConfigData>({
                result: new ADTScenesConfigData(this.mockData.scenesConfig),
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
            const mockBlobFile: IStorageBlob = {
                Name: file.name,
                Path: `https://mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net/${file.name}`,
                Properties: { 'Content-Length': file.size }
            };
            return new AdapterResult<StorageBlobsData>({
                result: new StorageBlobsData([mockBlobFile]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<StorageBlobsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getSceneData(sceneId: string, config: I3DScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox();

        // get scene based on id
        const scene = config?.configuration?.scenes?.find(
            (scene) => scene.id === sceneId
        );
        let modelUrl = null;
        const sceneVisuals: SceneVisual[] = [];
        if (scene) {
            // get modelUrl
            modelUrl = scene.assets?.find((asset) => asset.url)?.url;

            if (scene.behaviorIDs) {
                // cycle through behaviors for scene
                for (const behaviorId of scene.behaviorIDs) {
                    // cycle through all behaviors
                    // check if behavior is relevent for the current scene
                    const behavior = ViewerConfigUtility.getBehaviorById(
                        config,
                        behaviorId
                    );
                    if (!behavior) {
                        continue;
                    }
                    const mappingIds = new Set<string>();
                    // cycle through the datasources of behavior
                    for (const dataSource of behavior.datasources) {
                        // if its a TwinToObjectMappingDatasource get the mapping id
                        if (
                            dataSource.type ===
                            DatasourceType.ElementTwinToObjectMappingDataSource
                        ) {
                            dataSource.elementIDs.forEach((mappingId) => {
                                mappingIds.add(mappingId);
                            });
                        }
                    }

                    // cycle through mapping ids to get twins for behavior and scene
                    for (const id of Array.from(mappingIds)) {
                        const twins = {};
                        const element: ITwinToObjectMapping = scene.elements?.find(
                            (mapping) =>
                                mapping.type ===
                                    ElementType.TwinToObjectMapping &&
                                mapping.id === id
                        ) as ITwinToObjectMapping;

                        if (element) {
                            // get primary twin
                            twins[
                                PRIMARY_TWIN_NAME
                            ] = this.mockData.twins?.find(
                                (t) => t.$dtId === element.primaryTwinID
                            ) || {
                                $dtId: 'machineID1',
                                InFlow: 300,
                                OutFlow: 250,
                                Temperature: 50,
                                displayName: 'My Machine 1'
                            };

                            // check for twin aliases and add to twins object
                            if (element.twinAliases) {
                                for (const alias of Object.keys(
                                    element.twinAliases
                                )) {
                                    twins[alias] = this.mockData.twins?.find(
                                        (t) =>
                                            t.$dtId ===
                                            element.twinAliases[alias]
                                    ) || {
                                        $dtId: 'machineID2',
                                        InFlow: 300,
                                        OutFlow: 250,
                                        Temperature: 50,
                                        displayName: 'My Machine 2'
                                    };
                                }
                            }

                            const existingSceneVisual = sceneVisuals.find(
                                (sV) => sV.element.id === id
                            );
                            if (!existingSceneVisual) {
                                const sceneVisual = new SceneVisual(
                                    element,
                                    [behavior],
                                    twins
                                );
                                sceneVisuals.push(sceneVisual);
                            } else {
                                existingSceneVisual.behaviors.push(behavior);
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
                    value: this.mockData.twins?.filter((t) =>
                        t[params.searchProperty].includes(params.searchTerm)
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

    getFirstPropertyFromQuery = (query: string) => {
        // Initial position index is the index after WHERE in the query
        // used here to search for first property after the WHERE clause
        const initialPositionIndex = query.indexOf('WHERE ') + 6;
        return query
            .substring(
                initialPositionIndex,
                query.indexOf(' ', initialPositionIndex)
            )
            .split('T.')[1];
    };

    getFirstValueFromQuery = (query: string) => {
        // Find value after equals operator to match to
        // Return null in case equals operator is not found to return all twins
        const equalsPosition = query.indexOf(' = ');
        if (equalsPosition !== -1) {
            return query
                .substring(
                    equalsPosition + 2,
                    query.indexOf('\n', equalsPosition + 2)
                )
                .trim();
        } else {
            return null;
        }
    };

    async searchTwinsByQuery(params: AdapterMethodParamsForSearchTwinsByQuery) {
        try {
            await this.mockNetwork();
            const firstProperty = this.getFirstPropertyFromQuery(params.query);
            const firstValue = this.getFirstValueFromQuery(params.query);

            const filteredTwins = this.mockData.twins?.filter((twin) => {
                return String(twin[`${firstProperty}`]) === firstValue;
            });

            return new AdapterResult({
                // Return filtered results only in the case that user is searching for equals
                // else return all twins
                result: new ADTAdapterTwinsData({
                    value: firstValue ? filteredTwins : this.mockData.twins
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
        if (hostName.startsWith('https://'))
            hostName = hostName.replace('https://', '');
        this.mockEnvironmentHostName = hostName;
    }

    setADXConnectionInformation = (
        adxConnectionInformation: IADXConnection
    ) => {
        this.mockADXConnectionInformation = adxConnectionInformation;
    };

    getADXConnectionInformation = () => {
        return this.mockADXConnectionInformation;
    };

    async getResourceByUrl(_urlString: string, type: AzureResourceTypes) {
        switch (type.toLowerCase()) {
            case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                return new AdapterResult<AzureResourceData>({
                    result: new AzureResourceData({
                        name: 'adtInstance123',
                        id:
                            '/subscriptions/subscription123/resourcegroups/resourceGroup123/providers/Microsoft.DigitalTwins/digitalTwinsInstances/adtInstance123',
                        type: AzureResourceTypes.DigitalTwinInstance,
                        subscriptionName: 'subscription123',
                        location: 'westus2',
                        properties: {
                            hostName:
                                'adtInstance123.api.wus2.ss.azuredigitaltwins-test.net'
                        }
                    }),
                    errorInfo: null
                });
            case AzureResourceTypes.StorageAccount.toLowerCase():
                return new AdapterResult<AzureResourceData>({
                    result: new AzureResourceData({
                        name: 'storageAccount123',
                        id:
                            '/subscriptions/subscription123/resourceGroups/resourceGroup123/providers/Microsoft.Storage/storageAccounts/storageAccount123',
                        type: AzureResourceTypes.StorageAccount,
                        subscriptionName: 'subscription123',
                        properties: {
                            primaryEndpoints: {
                                blob:
                                    'https://storageAccount123.blob.core.windows.net/'
                            }
                        }
                    }),
                    errorInfo: null
                });
            case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                return new AdapterResult<AzureResourceData>({
                    result: new AzureResourceData({
                        name: 'container123',
                        id:
                            '/subscriptions/subscription123/resourceGroups/resourceGroup123/providers/Microsoft.Storage/storageAccounts/storageAccount123/blobServices/default/containers/container123',
                        type: AzureResourceTypes.StorageBlobContainer,
                        subscriptionName: 'subscription123',
                        properties: {
                            publicAccess: 'Container'
                        }
                    }),
                    errorInfo: null
                });
            default:
                return new AdapterResult<AzureResourceData>({
                    result: new AzureResourceData(null),
                    errorInfo: null
                });
        }
    }

    async getResources({
        resourceType
    }: AdapterMethodParamsForGetAzureResources) {
        const mockStorageContainerResources: Array<IAzureResource> = [
            {
                name: 'container123',
                id:
                    '/subscriptions/subscription123/resourceGroups/resourceGroup123/providers/Microsoft.Storage/storageAccounts/storageAccount123/blobServices/default/containers/container123',
                type: AzureResourceTypes.StorageBlobContainer,
                subscriptionName: 'subscription123',
                properties: {
                    publicAccess: 'Container'
                }
            }
        ];
        const mockStorageAccountResources: Array<IAzureResource> = [
            {
                name: 'storageAccount123',
                id:
                    '/subscriptions/subscription123/resourceGroups/resourceGroup123/providers/Microsoft.Storage/storageAccounts/storageAccount123',
                type: AzureResourceTypes.StorageAccount,
                subscriptionName: 'subscription123',
                properties: {
                    primaryEndpoints: {
                        blob: 'https://storageAccount123.blob.core.windows.net/'
                    }
                }
            }
        ];
        const mockADTInstanceResources: Array<IAzureResource> = mockADTInstanceResourceGraphData.data.map(
            (d) => d as IAzureResource
        );
        if (resourceType === AzureResourceTypes.DigitalTwinInstance) {
            return new AdapterResult({
                result: new AzureResourcesData(mockADTInstanceResources),
                errorInfo: null
            });
        } else if (resourceType === AzureResourceTypes.StorageBlobContainer) {
            return new AdapterResult({
                result: new AzureResourcesData(mockStorageContainerResources),
                errorInfo: null
            });
        } else if (resourceType === AzureResourceTypes.StorageAccount) {
            return new AdapterResult({
                result: new AzureResourcesData(mockStorageAccountResources),
                errorInfo: null
            });
        } else {
            return new AdapterResult({
                result: new AzureResourcesData([]),
                errorInfo: null
            });
        }
    }

    async hasRoleDefinitions(
        _resourceId: string,
        _accessRolesToCheck: AzureAccessPermissionRoleGroups,
        _uniqueObjectId?: string
    ) {
        return true;
    }

    async getResourcesByPermissions(params: {
        getResourcesParams: AdapterMethodParamsForGetAzureResources;
        requiredAccessRoles: AzureAccessPermissionRoleGroups;
    }) {
        try {
            const getResourcesResult = await this.getResources(
                params.getResourcesParams
            );
            let resources: Array<IAzureResource> = getResourcesResult.getData();

            if (resources?.length) {
                // apply searchParams to the list of resources returned
                if (params.getResourcesParams.searchParams?.filter) {
                    resources = resources.filter((resource) =>
                        Object.keys(AzureResourceDisplayFields).some(
                            (displayField) =>
                                !!resource[displayField]?.includes(displayField)
                        )
                    );
                }
                if (params.getResourcesParams.searchParams?.take) {
                    resources = resources.slice(
                        0,
                        params.getResourcesParams.searchParams?.take
                    );
                }

                const resourcesWithPermissions: Array<IAzureResource> = [];
                const hasRoleDefinitionsResults = await Promise.all(
                    resources.map((resource) =>
                        this.hasRoleDefinitions(
                            resource.id,
                            params.requiredAccessRoles,
                            params.getResourcesParams.userData?.uniqueObjectId
                        )
                    )
                );
                hasRoleDefinitionsResults.forEach((haveAccess, idx) => {
                    if (haveAccess) {
                        const resourceWithPermission = resources[idx];
                        resourcesWithPermissions.push(resourceWithPermission);
                    }
                });
                resources = resourcesWithPermissions;
            }

            return new AdapterResult({
                result: new AzureResourcesData(resources),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getMissingStorageContainerAccessRoles(_containerURLString?: string) {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new AzureMissingRoleDefinitionsData(
                    RequiredAccessRoleGroupForStorageContainer
                ),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<AzureMissingRoleDefinitionsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async addMissingRolesToStorageContainer(
        _missingRoleDefinitionIds: AzureAccessPermissionRoleGroups
    ) {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new AzureResourcesData([
                    {
                        properties: {
                            roleDefinitionId:
                                '/subscriptions/subscriptionId123/providers/Microsoft.Authorization/roleDefinitions/00000000-0000-0000-0000-000000000000'
                        },
                        id:
                            '/subscriptions/subscriptionId123/providers/Microsoft.Authorization/roleAssignments/roleAssignmentId123',
                        type: 'Microsoft.Authorization/roleAssignments',
                        name: 'roleAssignmentId123'
                    } as IAzureRoleAssignment
                ]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<AzureResourcesData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getContainerBlobs() {
        const mockBlobs: Array<IStorageBlob> = [
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
            }
        ];
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new StorageBlobsData(mockBlobs),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<StorageBlobsData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    private initializeMockTwinProperties() {
        this.mockTwinPropertiesMap['SaltMachine_C1'] = {
            InFlow: 50,
            OutFlow: 30
        };
        this.mockTwinPropertiesMap['BoxA'] = {
            Volume: 237
        };
    }

    async getBlobServiceCorsProperties() {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new StorageBlobServiceCorsRulesData([
                    {
                        AllowedMethods: BlobStorageServiceCorsAllowedOrigins,
                        AllowedOrigins: BlobStorageServiceCorsAllowedMethods,
                        AllowedHeaders: BlobStorageServiceCorsAllowedHeaders,
                        MaxAgeInSeconds: 0
                    }
                ]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<StorageBlobServiceCorsRulesData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async setBlobServiceCorsProperties() {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new StorageBlobServiceCorsRulesData(''),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<StorageBlobServiceCorsRulesData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getTimeSeriesConnectionInformation(_adtUrl: string) {
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new ADTInstanceTimeSeriesConnectionData({
                    kustoClusterUrl:
                        'https://mockKustoClusterName.westus2.kusto.windows.net',
                    kustoDatabaseName: 'mockKustoDatabaseName',
                    kustoTableName: 'mockKustoTableName'
                }),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADTInstanceTimeSeriesConnectionData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    /** Returns a mock data based on the passed query by parsing it
     * to get quick time, twin id and twin property to reflect
     * on the generated mock data */
    async getTimeSeriesData(
        seriesIds: Array<string>,
        query: string,
        _connection?: IADXConnection,
        useStaticData?: boolean
    ) {
        let mockData: Array<ADXTimeSeries> = [];
        let mockTimeSeriesData: Array<Array<TimeSeriesData>> = this.mockData
            .timeSeriesDataList;

        try {
            await this.mockNetwork();
            try {
                const listOfTimeSeries = query.split(';'); // split the query by statements for each time series
                listOfTimeSeries.forEach((ts, idx) => {
                    const split = ts.split('ago(')[1].split(')'); // split the query by timestamp 'ago' operation
                    const quickTimeSpanInMillis = Number(
                        split[0].replace('ms', '') // get the quick time in milliseconds and cast it to number
                    );
                    const idAndPropertyPart = split[1]
                        .split('Id == ')[1]
                        .split(' and Key == '); // get the part of the query where there is twin id and property information
                    const twinId = idAndPropertyPart[0].replace(/'/g, ''); // get the id and replace the single quote characters around the string
                    const twinProperty = idAndPropertyPart[1]
                        .split(' | ')[0]
                        .replace(/'/g, ''); // get the twin property and replace the single quote characters around the string

                    if (!mockTimeSeriesData) {
                        mockTimeSeriesData = getMockTimeSeriesDataArrayInLocalTime(
                            listOfTimeSeries.length,
                            5,
                            quickTimeSpanInMillis,
                            useStaticData
                        );
                    }
                    mockData.push({
                        seriesId: seriesIds[idx],
                        id: twinId,
                        key: twinProperty,
                        data: mockTimeSeriesData[idx]
                    });
                });
            } catch (error) {
                console.log(error);
                mockData = [
                    {
                        seriesId: createGUID(),
                        id: 'PasteurizationMachine_A01',
                        key: 'InFlow',
                        data: getMockTimeSeriesDataArrayInLocalTime(
                            1,
                            undefined,
                            undefined,
                            useStaticData
                        )[0]
                    }
                ];
            }
            return new AdapterResult({
                result: new ADXTimeSeriesData(mockData),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<ADXTimeSeriesData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async updateADXConnectionInformation() {
        try {
            await this.mockNetwork();
            const mockConnectionInformation: IADXConnection = {
                kustoClusterUrl:
                    'https://mockKustoClusterName.westus2.kusto.windows.net',
                kustoDatabaseName: 'mockKustoDatabaseName',
                kustoTableName: 'mockKustoTableName'
            };
            this.setADXConnectionInformation(mockConnectionInformation);

            return new AdapterResult({
                result: new ADTInstanceTimeSeriesConnectionData(
                    mockConnectionInformation
                ),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }
}
