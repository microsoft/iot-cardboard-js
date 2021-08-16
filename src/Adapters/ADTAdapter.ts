import {
    IADTAdapter,
    IADTRelationship,
    IADTTwin,
    IAuthService,
    IGetKeyValuePairsAdditionalParameters
} from '../Models/Constants/Interfaces';
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
    DTModel,
    AdtPatch,
    IADTTwinComponent,
    KeyValuePairData
} from '../Models/Constants';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import ADTModelData from '../Models/Classes/AdapterDataClasses/ADTModelData';
import {
    ADTAdapterModelsData,
    ADTAdapterPatchData,
    ADTAdapterTwinsData
} from '../Models/Classes/AdapterDataClasses/ADTAdapterData';
import ADTTwinLookupData from '../Models/Classes/AdapterDataClasses/ADTTwinLookupData';
import axios from 'axios';
import { DtdlInterface } from '../Models/Constants/dtdlInterfaces';
import { getModelContentType } from '../Models/Services/Utils';
import { DTDLType } from '../Models/Classes/DTDL';
import ExpandedADTModelData from '../Models/Classes/AdapterDataClasses/ExpandedADTModelData';

export default class ADTAdapter implements IADTAdapter {
    private authService: IAuthService;
    private adtHostUrl: string;
    private adtProxyServerPath: string;

    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        adtProxyServerPath = '/api/proxy'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.adtProxyServerPath = adtProxyServerPath;
        this.authService = authService;
        this.authService.login();
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
                url: `${this.adtProxyServerPath}/digitaltwins/${id}/relationships`,
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

    getADTTwin(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTTwinData,
            {
                method: 'get',
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

    getADTModels(params: AdapterMethodParamsForGetADTModels = null) {
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
                    query: `SELECT * FROM DIGITALTWINS T WHERE CONTAINS(T.$metadata.$model, '${params.searchTerm}') OR CONTAINS(T.$dtId, '${params.searchTerm}')`,
                    continuationToken: params.continuationToken
                }
            }
        );
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
                url: `${this.adtProxyServerPath}/digitaltwins/${id}`,
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
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const twinData = await adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTTwinData,
            {
                method: 'get',
                url: `${this.adtProxyServerPath}/digitaltwins/${twinId}`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );

        const modelData = await adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTModelData,
            {
                method: 'get',
                url: `${this.adtProxyServerPath}/models/${
                    twinData.getData()?.$metadata?.$model
                }`,
                headers: {
                    'x-adt-host': this.adtHostUrl
                },
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
        return new ADTTwinLookupData(twinData.getData(), modelData.getData());
    }

    async getExpandedAdtModel(modelId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const expandedModels: DtdlInterface[] = [];

            const fetchFullModel = async (targetModelId: string) => {
                return axios({
                    method: 'get',
                    url: `${this.adtProxyServerPath}/models/${targetModelId}?includeModelDefinition=True`,
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
                // Add root model
                const rootModel = (await fetchFullModel(modelId)).data.model;
                expandedModels.push(rootModel);

                // Add extended models
                const baseModelsRaw = rootModel?.extends;
                if (baseModelsRaw) {
                    const baseModelsList = Array.isArray(baseModelsRaw)
                        ? baseModelsRaw
                        : [baseModelsRaw];

                    await axios.all(
                        baseModelsList.map((baseModelId) => {
                            return recursivelyAddToExpandedModels(baseModelId);
                        })
                    );
                }

                // Add component models
                const componentModelIds = rootModel.contents
                    ?.filter(
                        (m) =>
                            getModelContentType(m['@type']) ===
                            DTDLType.Component
                    )
                    .map((m) => m.schema as string); // May need more validation to ensure component schema is a DTMI string

                await axios.all(
                    componentModelIds.map((componentModelId) => {
                        return recursivelyAddToExpandedModels(componentModelId);
                    })
                );

                return rootModel;
            };

            await recursivelyAddToExpandedModels(modelId);

            return new ExpandedADTModelData({
                expandedModels,
                rootModel: expandedModels[0]
            });
        });
    }

    async updateTwin(twinId: string, patches: Array<AdtPatch>) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResponse = await axios({
                method: 'patch',
                url: `${this.adtProxyServerPath}/digitaltwins/${twinId}`,
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
                url: `${this.adtProxyServerPath}/digitaltwins/${twinId}/relationships/${relationshipId}`,
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
        patches: Array<AdtPatch>
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResponse = await axios({
                method: 'patch',
                url: `${this.adtProxyServerPath}/digitaltwins/${twinId}/relationships/${relationshipId}`,
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
}
