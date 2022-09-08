import {
    ADTAdapterTwinsData,
    KeyValuePairAdapterData,
    TsiClientAdapterData
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
    IAzureSubscription,
    AzureResourceDisplayFields,
    AdapterMethodParamsForGetAzureResources,
    RequiredAccessRoleGroupForStorageContainer,
    AdapterMethodParamsForSearchTwinsByQuery
} from '../Models/Constants';
import seedRandom from 'seedrandom';
import {
    ADTRelationship,
    KeyValuePairData,
    TsiClientData
} from '../Models/Constants/Types';
import { SceneVisual } from '../Models/Classes/SceneView.types';
import mockVConfig from './__mockData__/3DScenesConfiguration.json';
import mockTwinData from './__mockData__/MockAdapterData/MockTwinData.json';
import mockModelData from './__mockData__/MockAdapterData/MockModelData.json';
import mockSubscriptionData from './__mockData__/MockAdapterData/MockSubscriptionData.json';
import ADTScenesConfigData from '../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import ADT3DViewerData from '../Models/Classes/AdapterDataClasses/ADT3DViewerData';
import {
    AzureMissingRoleDefinitionsData,
    AzureResourcesData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
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
import { AzureSubscriptionData } from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import { ADTAdapterPatchData } from '../Models/Classes/AdapterDataClasses/ADTAdapterData';
import ExpandedADTModelData from '../Models/Classes/AdapterDataClasses/ExpandedADTModelData';
import { applyPatch, Operation } from 'fast-json-patch';
import { DTDLType } from '../Models/Classes/DTDL';
import i18n from '../i18n';
import ViewerConfigUtility from '../Models/Classes/ViewerConfigUtility';

const MAX_RESOURCE_TAKE_LIMIT = 5;
export default class MockAdapter
    implements
        IKeyValuePairAdapter,
        IADT3DViewerAdapter,
        ITsiClientChartDataAdapter,
        IBlobAdapter,
        Partial<IADTAdapter>,
        IPropertyInspectorAdapter,
        IModelledPropertyBuilderAdapter {
    private mockData = null;
    private mockError = null;
    public mockTwins: IADTTwin[] = null;
    public mockModels: DtdlInterface[] = null;
    private networkTimeoutMillis;
    private isDataStatic;
    public scenesConfig: I3DScenesConfig;
    private mockEnvironmentHostName =
        'mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net';
    private mockContainerUrl =
        'https://mockStorageAccountName.blob.core.windows.net/mockContainerName';
    private seededRng = seedRandom('cardboard seed');
    private mockTwinPropertiesMap: {
        [id: string]: Record<string, unknown>;
    } = {};

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
        this.mockTwins = mockTwinData;
        this.mockModels = (mockModelData as any) as DtdlInterface[];
        this.initializeMockTwinProperties();
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
        const rawModels = (this.mockModels as any) as DtdlInterface[];
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

            const targetTwin = this.mockTwins.find(
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
                    const rootModel = this.mockModels.find(
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
                        ?.map((m) => m.schema as string);

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
                        const model = this.mockModels.find(
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

            const mockTwin = this.mockTwins.find(
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
                            twins[PRIMARY_TWIN_NAME] = this.mockTwins.find(
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
                                    twins[alias] = this.mockTwins.find(
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
                    value: this.mockTwins.filter((t) =>
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

            const filteredTwins = this.mockTwins.filter((twin) => {
                return String(twin[`${firstProperty}`]) === firstValue;
            });

            return new AdapterResult({
                // Return filtered results only in the case that user is searching for equals
                // else return all twins
                result: new ADTAdapterTwinsData({
                    value: firstValue ? filteredTwins : this.mockTwins
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

    async getSubscriptions() {
        const mockSubscriptions: Array<IAzureSubscription> = mockSubscriptionData;
        try {
            await this.mockNetwork();

            return new AdapterResult({
                result: new AzureSubscriptionData(mockSubscriptions),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<AzureSubscriptionData>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
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
                properties: {
                    primaryEndpoints: {
                        blob: 'https://storageAccount123.blob.core.windows.net/'
                    }
                }
            }
        ];
        const mockADTInstanceResources: Array<IAzureResource> = [
            {
                name: 'adtInstance123',
                id:
                    '/subscriptions/subscription123/resourcegroups/resourceGroup123/providers/Microsoft.DigitalTwins/digitalTwinsInstances/adtInstance123',
                type: AzureResourceTypes.DigitalTwinInstance,
                location: 'westus2',
                properties: {
                    hostName:
                        'adtInstance123.api.wus2.ss.azuredigitaltwins-test.net'
                }
            }
        ];
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
                resources = resources.slice(
                    0,
                    params.getResourcesParams.searchParams?.take ||
                        MAX_RESOURCE_TAKE_LIMIT
                ); // take the first n number of resources to make sure the browser won't crash with making thousands of requests

                // no need to emulate hasRoleDefinitions
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
}
