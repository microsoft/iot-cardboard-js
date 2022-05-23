import {
    IADTAdapter,
    IADTRelationship,
    IADTTwin,
    IAuthService,
    IGetKeyValuePairsAdditionalParameters
} from '../Models/Constants/Interfaces';
import axiosRetry from 'axios-retry';
import {
    AdapterMethodParamsForGetADTModels,
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins,
    ADTRelationship,
    ADTRelationshipsApiData
} from '../Models/Constants/Types';
import { KeyValuePairAdapterData } from '../Models/Classes';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import {
    ADTRelationshipData,
    ADTRelationshipsData
} from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import {
    ADT_ApiVersion,
    ComponentErrorType,
    DTwin,
    DTwinRelationship,
    DTModel,
    ADTPatch,
    IADTTwinComponent,
    KeyValuePairData,
    DTwinUpdateEvent,
    IComponentError,
    PRIMARY_TWIN_NAME,
    IADTModel,
    modelRefreshMaxAge,
    twinRefreshMaxAge,
    instancesRefreshMaxAge
} from '../Models/Constants';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import ADTModelData, {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import {
    ADTAdapterModelsData,
    ADTAdapterPatchData,
    ADTAdapterTwinsData
} from '../Models/Classes/AdapterDataClasses/ADTAdapterData';
import ADTTwinLookupData from '../Models/Classes/AdapterDataClasses/ADTTwinLookupData';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { DtdlInterface } from '../Models/Constants/dtdlInterfaces';
import {
    getModelContentType,
    parseDTDLModelsAsync
} from '../Models/Services/Utils';
import { DTDLType } from '../Models/Classes/DTDL';
import ExpandedADTModelData from '../Models/Classes/AdapterDataClasses/ExpandedADTModelData';
import {
    ADTModelsData,
    ADTTwinsData
} from '../Models/Classes/AdapterDataClasses/ADTUploadData';
import i18n from '../i18n';
import { SimulationAdapterData } from '../Models/Classes/AdapterDataClasses/SimulationAdapterData';
import ADT3DViewerData from '../Models/Classes/AdapterDataClasses/ADT3DViewerData';
import { SceneVisual } from '../Models/Classes/SceneView.types';
import ViewerConfigUtility from '../Models/Classes/ViewerConfigUtility';
import {
    I3DScenesConfig,
    ITwinToObjectMapping
} from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementType } from '../Models/Classes/3DVConfig';
import { ModelDict } from 'azure-iot-dtdl-parser/dist/parser/modelDict';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import queryString from 'query-string';

export default class ADTAdapter implements IADTAdapter {
    public tenantId: string;
    public uniqueObjectId: string;
    public authService: IAuthService;
    public adtHostUrl: string;
    protected adtProxyServerPath: string;
    public packetNumber = 0;
    protected axiosInstance: AxiosInstance;
    public cachedModels: DtdlInterface[];
    public cachedTwinModelMap: Map<string, string>;
    public parsedModels: ModelDict;
    protected adtTwinCache: AdapterEntityCache<ADTTwinData>;
    protected adtModelsCache: AdapterEntityCache<ADTAllModelsData>;
    protected adtTwinToModelMappingCache: AdapterEntityCache<ADTTwinToModelMappingData>;
    protected adtInstancesCache: AdapterEntityCache<ADTInstancesData>;

    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.adtProxyServerPath = adtProxyServerPath;
        this.authService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.cachedTwinModelMap = new Map();
        this.adtTwinCache = new AdapterEntityCache<ADTTwinData>(
            twinRefreshMaxAge
        );
        this.adtModelsCache = new AdapterEntityCache<ADTAllModelsData>(
            modelRefreshMaxAge
        );
        this.adtTwinToModelMappingCache = new AdapterEntityCache<ADTTwinToModelMappingData>(
            modelRefreshMaxAge
        );
        this.adtInstancesCache = new AdapterEntityCache<ADTInstancesData>(
            instancesRefreshMaxAge
        );

        this.authService.login();
        this.axiosInstance = axios.create({ baseURL: this.adtProxyServerPath });
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryCondition: (axiosError: AxiosError) => {
                return (
                    axiosError?.response?.status == 429 ||
                    axiosError?.response?.status >= 500
                );
            },
            retryDelay: (retryCount) => {
                console.log((Math.pow(2, retryCount) - Math.random()) * 1000);
                return (Math.pow(2, retryCount) - Math.random()) * 1000;
            }
        });
    }

    getAdtHostUrl() {
        return this.adtHostUrl;
    }

    setAdtHostUrl(hostName: string) {
        this.adtHostUrl = hostName;
    }

    getRelationships(id: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        /*
            NOTE: the targetModel property is a custom property that needs to be explicitly 
            defined in the DTDL model's definition of that relationship type, and needs to 
            be explicitly provided when creating the twin relationship
        */
        const createRelationships = (
            axiosData: ADTRelationshipsApiData
        ): ADTRelationship[] =>
            axiosData.value.map((rawRelationship: IADTRelationship) => {
                return {
                    relationshipId: rawRelationship.$relationshipId,
                    relationshipName: rawRelationship.$relationshipName,
                    targetId: rawRelationship.$targetId,
                    targetModel: rawRelationship.targetModel
                        ? rawRelationship.targetModel
                        : ''
                };
            });

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTRelationshipsData,
            {
                method: 'get',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(id)}/relationships`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            },
            createRelationships
        );
    }

    getADTTwin(twinId: string, useCache = false) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const getDataMethod = () =>
            adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
                ADTTwinData,
                {
                    method: 'get',
                    url: `${
                        this.adtProxyServerPath
                    }/digitaltwins/${encodeURIComponent(twinId)}`,
                    headers: {
                        'x-adt-host': this.adtHostUrl
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                }
            );
        if (useCache) {
            return this.adtTwinCache.getEntity(twinId, getDataMethod);
        } else {
            return getDataMethod();
        }
    }

    async getModelIdFromTwinId(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        const getDataMethod = () =>
            adapterMethodSandbox.safelyFetchData(async () => {
                try {
                    const twinResult = await this.getADTTwin(twinId, true);
                    if (!twinResult.hasNoData()) {
                        const twinData = twinResult.getData();
                        const modelId = twinData.$metadata.$model;
                        return new ADTTwinToModelMappingData({
                            twinId,
                            modelId
                        });
                    } else {
                        throw new Error('Twin fetch failed');
                    }
                } catch (err) {
                    adapterMethodSandbox.pushError({
                        isCatastrophic: true,
                        type: ComponentErrorType.DataFetchFailed,
                        rawError: err
                    });
                }
            });

        return this.adtTwinToModelMappingCache.getEntity(twinId, getDataMethod);
    }

    async getAllAdtModels() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const getDataMethod = () =>
            adapterMethodSandbox.safelyFetchData(async () => {
                try {
                    let rawModels: DtdlInterface[] = [];
                    const appendModels = async (nextLink?: string) => {
                        // Get next chunk of models
                        const adtModelsApiData = await this.getADTModels({
                            shouldIncludeDefinitions: true,
                            ...(nextLink && { continuationToken: nextLink })
                        });

                        // Add to models list
                        rawModels = [
                            ...rawModels,
                            ...adtModelsApiData.result.data.value.map(
                                (adtModel: IADTModel) => adtModel.model
                            )
                        ];

                        // If next link present, fetch next chunk
                        if (adtModelsApiData.result.data.nextLink) {
                            try {
                                const url = new URL(
                                    adtModelsApiData.result.data.nextLink
                                );
                                const continuationToken = queryString.parse(
                                    url.search
                                ).continuationToken as string;
                                await appendModels(continuationToken);
                            } catch (e) {
                                console.log(
                                    'Continuation token for models call unsuccessfully parsed',
                                    e
                                );
                            }
                        }
                    };

                    await appendModels();

                    const parsedModels = await parseDTDLModelsAsync(rawModels);
                    return new ADTAllModelsData({
                        rawModels,
                        parsedModels
                    });
                } catch (err) {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.ModelsRetrievalFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                }
            });
        return this.adtModelsCache.getEntity('adt_models', getDataMethod);
    }

    getADTModel(modelId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTModelData,
            {
                method: 'get',
                url: `${this.adtProxyServerPath}/models/${modelId}`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    deleteADTModel(modelId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTModelData,
            {
                method: 'delete',
                url: `${this.adtProxyServerPath}/models/${modelId}`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    deleteADTTwin(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTTwinData,
            {
                method: 'delete',
                url: `${this.adtProxyServerPath}/digitaltwins/${twinId}`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    async getADTModels(params: AdapterMethodParamsForGetADTModels = null) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTAdapterModelsData,
            {
                method: 'get',
                url: `${this.adtProxyServerPath}/models${
                    params?.shouldIncludeDefinitions
                        ? '?includeModelDefinition=True'
                        : ''
                }`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion,
                    ...(params?.continuationToken && {
                        continuationToken: params.continuationToken
                    })
                }
            }
        );
    }

    createADTModels(models: DTModel[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTAdapterModelsData,
            {
                method: 'post',
                url: `${this.adtProxyServerPath}/models`,
                data: models,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    async updateTwins(events: Array<DTwinUpdateEvent>) {
        this.packetNumber++;
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const data = await Promise.all(
                events.map((event) => {
                    const id = event.dtId;
                    return axios({
                        method: 'patch',
                        url: `${this.adtProxyServerPath}/digitaltwins/${id}`,
                        data: event.patchJSON,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl
                        },
                        params: {
                            'api-version': ADT_ApiVersion
                        }
                    }).catch((err) => {
                        return err.response.data;
                    });
                })
            );
            return new SimulationAdapterData(data);
        });
    }

    getADTTwinsByModelId(params: AdapterMethodParamsForGetADTTwinsByModelId) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTAdapterTwinsData,
            {
                method: 'post',
                url: `${this.adtProxyServerPath}/query`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                },
                data: {
                    query: `SELECT * FROM DIGITALTWINS WHERE $metadata.$model = '${params.modelId}'`,
                    continuationToken: params.continuationToken
                }
            }
        );
    }

    searchADTTwins(params: AdapterMethodParamsForSearchADTTwins) {
        params.shouldSearchByModel = params.shouldSearchByModel ?? true;
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTAdapterTwinsData,
            {
                method: 'post',
                url: `${this.adtProxyServerPath}/query`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                },
                data: {
                    query: `SELECT * FROM DIGITALTWINS T WHERE ${
                        params.shouldSearchByModel
                            ? `CONTAINS(T.$metadata.$model, '${params.searchTerm}') OR `
                            : ''
                    }CONTAINS(T.$dtId, '${params.searchTerm}')`,
                    continuationToken: params.continuationToken
                }
            }
        );
    }

    async createModels(models: DTModel[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await this.axiosInstance({
                method: 'post',
                url: `/models`,
                data: models,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }).catch((err) => {
                if (err?.response?.status === 409) {
                    return { data: models };
                } else {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.DataUploadFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                    return null;
                }
            });
            return new ADTModelsData(axiosResult?.data);
        });
    }

    async createTwins(twins: DTwin[], onUploadProgress?) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let uploadCounter = 0;
            const data = await Promise.all(
                twins.map(async (twin) => {
                    const twinCopy = JSON.parse(JSON.stringify(twin));
                    delete twinCopy['$dtId'];
                    const axiosResponse = await this.axiosInstance({
                        method: 'put',
                        url: `/digitaltwins/${encodeURIComponent(twin.$dtId)}`,
                        data: twinCopy,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl
                        },
                        params: {
                            'api-version': ADT_ApiVersion
                        }
                    }).catch((err) => {
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.DataUploadFailed,
                            isCatastrophic: false,
                            rawError: err
                        });
                        return null;
                    });
                    uploadCounter++;
                    onUploadProgress &&
                        onUploadProgress(uploadCounter, twins.length);
                    return axiosResponse ? axiosResponse.data : null;
                })
            );

            //filter out nulls, i.e. errors
            const filteredResponses = data.filter((resp) => {
                return resp !== null;
            });

            return new ADTTwinsData(filteredResponses);
        });
    }

    async createRelationships(
        relationships: DTwinRelationship[],
        onUploadProgress?
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let uploadCounter = 0;
            const data = await Promise.all(
                relationships.map(async (relationship: DTwinRelationship) => {
                    const payload = {
                        $targetId: relationship.$targetId,
                        $relationshipName: relationship.$name
                    };
                    const axiosResponse = await this.axiosInstance({
                        method: 'put',
                        url: `/digitaltwins/${encodeURIComponent(
                            relationship.$dtId
                        )}/relationships/${encodeURIComponent(
                            relationship.$relId
                        )}`,
                        data: payload,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl
                        },
                        params: {
                            'api-version': ADT_ApiVersion
                        }
                    }).catch((err) => {
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.DataUploadFailed,
                            isCatastrophic: false,
                            rawError: err
                        });
                        return null;
                    });

                    uploadCounter++;
                    onUploadProgress &&
                        onUploadProgress(uploadCounter, relationships.length);

                    return axiosResponse ? axiosResponse.data : null;
                })
            );

            //filter out nulls, i.e. errors
            const filteredResponses = data.filter((resp) => {
                return resp !== null;
            });

            return new ADTRelationshipsData(filteredResponses);
        });
    }

    getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters: IGetKeyValuePairsAdditionalParameters
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        const createKeyValuePairData = (
            axiosData: IADTTwin
        ): KeyValuePairData[] =>
            axiosData
                ? properties.map((prop) => {
                      const kvp = {} as KeyValuePairData;
                      kvp.key = prop;
                      if (axiosData[prop]?.$metadata) {
                          // means it is a component
                          kvp.value = createKeyValuePairDataFromTwinComponent(
                              axiosData[prop]
                          );
                      } else {
                          kvp.value = axiosData[prop];
                          if (additionalParameters?.isTimestampIncluded) {
                              kvp.timestamp = new Date(
                                  axiosData.$metadata?.[prop]?.lastUpdateTime
                              );
                          }
                      }
                      return kvp;
                  })
                : [];

        const createKeyValuePairDataFromTwinComponent = (
            component: IADTTwinComponent
        ): KeyValuePairData[] => {
            if (
                component &&
                component.$metadata &&
                typeof component.$metadata === 'object' &&
                Object.keys(component.$metadata).length
            ) {
                return Object.keys(component.$metadata).reduce((acc, prop) => {
                    const kvp = {} as KeyValuePairData;
                    kvp.key = prop;
                    if (
                        !(
                            component[prop]?.$metadata &&
                            typeof component[prop]?.$metadata === 'object'
                        )
                    ) {
                        /**
                         * Currently in DTDL V2, the maximum depth of Components is 1 and so components cannot contain another component.
                         * See details: https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#component
                         * But, to be safe we are checking if there is a subcomponent in a component having '$metadata' field
                         * to exclude it by showing only properties/telemetries of the component, otherwise the value of the
                         * component would be infinitely big to display in a card.
                         */
                        if (typeof component[prop] === 'object') {
                            // e.g. Properties, which can have 'Object' type of schema, can include sub-properties
                            kvp.value = createKeyValuePairDataFromTwinComponent(
                                component[prop]
                            );
                        } else {
                            kvp.value = component[prop];
                            if (additionalParameters?.isTimestampIncluded) {
                                kvp.timestamp = new Date(
                                    component.$metadata?.[prop]?.lastUpdateTime
                                );
                            }
                            acc.push(kvp);
                        }
                    }
                    return acc;
                }, []);
            }
        };

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            KeyValuePairAdapterData,
            {
                method: 'get',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(id)}`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            },
            createKeyValuePairData
        );
    }

    async lookupADTTwin(twinId: string) {
        const twinData = await this.getADTTwin(twinId);
        const modelData = await this.getADTModel(
            twinData.getData()?.$metadata?.$model
        );
        return new ADTTwinLookupData(twinData.getData(), modelData.getData());
    }

    async getExpandedAdtModel(modelId: string, baseModelIds?: string[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const expandedModels: DtdlInterface[] = [];

            const fetchFullModel = async (targetModelId: string) => {
                return axios({
                    method: 'get',
                    url: `${
                        this.adtProxyServerPath
                    }/models/${encodeURIComponent(
                        targetModelId
                    )}?includeModelDefinition=True`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                });
            };

            const recursivelyAddToExpandedModels = async (modelId: string) => {
                try {
                    // Add root model
                    const rootModel = (await fetchFullModel(modelId)).data
                        .model;
                    expandedModels.push(rootModel);

                    // Add extended models
                    const baseModelsRaw = rootModel?.extends;
                    if (baseModelsRaw) {
                        const baseModelsList = Array.isArray(baseModelsRaw)
                            ? baseModelsRaw
                            : [baseModelsRaw];

                        await Promise.all(
                            baseModelsList.map((baseModelId) => {
                                return recursivelyAddToExpandedModels(
                                    baseModelId
                                );
                            })
                        );
                    }

                    // Add component models
                    const componentModelIds = rootModel?.contents
                        ?.filter(
                            (m) =>
                                getModelContentType(m['@type']) ===
                                DTDLType.Component
                        )
                        ?.map((m) => m.schema as string); // May need more validation to ensure component schema is a DTMI string

                    if (componentModelIds) {
                        await Promise.all(
                            componentModelIds?.map((componentModelId) => {
                                return recursivelyAddToExpandedModels(
                                    componentModelId
                                );
                            })
                        );
                    }

                    return rootModel;
                } catch (err) {
                    adapterMethodSandbox.pushError({
                        isCatastrophic: false,
                        rawError: err,
                        message: modelId
                    });
                    return;
                }
            };

            const parallelFetchModel = async (modelId: string) => {
                try {
                    const model = (await fetchFullModel(modelId)).data.model;
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
            };

            // If list of base models known, fetch all models in parallel
            if (baseModelIds) {
                await Promise.all(
                    [modelId, ...baseModelIds].map((id) => {
                        return parallelFetchModel(id);
                    })
                );
            } else {
                // If base models unknown, recursively expand and fetch in sequence
                await recursivelyAddToExpandedModels(modelId);
            }

            return new ExpandedADTModelData({
                expandedModels,
                rootModel: expandedModels.find(
                    (model) => model['@id'] === modelId
                )
            });
        });
    }

    async updateTwin(twinId: string, patches: Array<ADTPatch>) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResponse = await axios({
                method: 'patch',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(twinId)}`,
                data: patches,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            });

            if (axiosResponse.status === 204) {
                return new ADTAdapterPatchData(patches);
            } else {
                throw new Error(axiosResponse.statusText);
            }
        });
    }

    async getADTRelationship(twinId: string, relationshipId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResponse = await axios({
                method: 'get',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(
                    twinId
                )}/relationships/${encodeURIComponent(relationshipId)}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            });

            return new ADTRelationshipData(axiosResponse.data);
        });
    }

    async updateRelationship(
        twinId: string,
        relationshipId: string,
        patches: Array<ADTPatch>
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResponse = await axios({
                method: 'patch',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(
                    twinId
                )}/relationships/${encodeURIComponent(relationshipId)}`,
                data: patches,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            });

            if (axiosResponse.status === 204) {
                return new ADTAdapterPatchData(patches);
            } else {
                throw new Error(axiosResponse.statusText);
            }
        });
    }

    async getIncomingRelationships(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        const createRelationships = (
            axiosData: ADTRelationshipsApiData
        ): ADTRelationship[] =>
            axiosData.value.map((rawRelationship: IADTRelationship) => {
                return {
                    relationshipId: rawRelationship.$relationshipId,
                    relationshipName: rawRelationship.$relationshipName,
                    relationshipLink: rawRelationship.$relationshipLink,
                    sourceId: rawRelationship.$sourceId
                };
            });

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTRelationshipsData,
            {
                method: 'get',
                url: `${
                    this.adtProxyServerPath
                }/digitaltwins/${encodeURIComponent(
                    twinId
                )}/incomingrelationships`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            },
            createRelationships
        );
    }

    async getSceneData(sceneId: string, config: I3DScenesConfig) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        function pushErrors(errors: IComponentError[]) {
            if (errors) {
                for (const error of errors) {
                    adapterMethodSandbox.pushError({
                        type: error.type,
                        isCatastrophic: false, // TODO: for now set it to false to prevent partial getTwin failures causing the base card content render, revert it with error.isCatastrophic when proper error handling is implemented for partial failures
                        rawError: new Error(error.message)
                    });
                }
            }
        }

        return await adapterMethodSandbox.safelyFetchData(async () => {
            // get scene based on id
            const scene = config.configuration?.scenes?.find(
                (scene) => scene.id === sceneId
            );
            let modelUrl = null;
            const sceneVisuals: SceneVisual[] = [];
            const twinIdToResolvedTwinMap = new Map<string, boolean>();

            if (scene) {
                // get modelUrl
                modelUrl = scene.assets?.find((asset) => asset.url)?.url;

                if (scene.behaviorIDs) {
                    // get all twins for all behaviors in the scene
                    for (const sceneBehaviorId of scene.behaviorIDs) {
                        for (const behavior of config.configuration.behaviors) {
                            if (sceneBehaviorId === behavior.id) {
                                const {
                                    primaryTwinIds,
                                    aliasedTwinMap
                                } = ViewerConfigUtility.getTwinIdsForBehaviorInScene(
                                    behavior,
                                    config,
                                    sceneId
                                );
                                primaryTwinIds.forEach(
                                    (tid) =>
                                        (twinIdToResolvedTwinMap[tid] = true)
                                );
                                Object.entries(aliasedTwinMap).forEach(
                                    (atm) =>
                                        (twinIdToResolvedTwinMap[atm[1]] = true)
                                );
                            }
                        }
                    }
                    const twinIdsArray = Object.keys(twinIdToResolvedTwinMap);
                    const twinResults = await Promise.all(
                        twinIdsArray.map((twinId) =>
                            this.getADTTwin(twinId, true)
                        )
                    );
                    twinResults.forEach((adapterResult, idx) => {
                        pushErrors(adapterResult.getErrors());
                        twinIdToResolvedTwinMap[twinIdsArray[idx]] =
                            adapterResult.result?.data;
                    });
                    // end: get all twins for all behaviors in the scene

                    // map resolved twins to SceneVisuals
                    for (const sceneBehaviorId of scene.behaviorIDs) {
                        // cycle through all behaviors
                        // check if behavior is relevant for the current scene
                        for (const behavior of config.configuration.behaviors)
                            if (sceneBehaviorId === behavior.id) {
                                const mappingIds = ViewerConfigUtility.getMappingIdsForBehavior(
                                    behavior
                                );

                                // cycle through mapping ids to get twins for behavior and scene
                                for (const id of mappingIds) {
                                    const twins = {};
                                    const element = scene.elements.find(
                                        (element) =>
                                            element.type ===
                                                ElementType.TwinToObjectMapping &&
                                            element.id === id
                                    ) as ITwinToObjectMapping;
                                    if (element) {
                                        twins[PRIMARY_TWIN_NAME] =
                                            twinIdToResolvedTwinMap[
                                                element.primaryTwinID
                                            ];

                                        // check for twin aliases and add to twins object
                                        if (element.twinAliases) {
                                            for (const alias of Object.keys(
                                                element.twinAliases
                                            )) {
                                                twins[alias] =
                                                    twinIdToResolvedTwinMap[
                                                        element.twinAliases[
                                                            alias
                                                        ]
                                                    ];
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
                                            existingSceneVisual.behaviors.push(
                                                behavior
                                            );
                                        }
                                    }
                                }
                            }
                    }
                }
            }
            return new ADT3DViewerData(modelUrl, sceneVisuals);
        });
    }
}
