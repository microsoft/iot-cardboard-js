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
import ADTRelationshipData from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import { ADT_ApiVersion, KeyValuePairData } from '../Models/Constants';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import ADTModelData from '../Models/Classes/AdapterDataClasses/ADTModelData';
import {
    ADTAdapterModelsData,
    ADTAdapterTwinsData
} from '../Models/Classes/AdapterDataClasses/ADTAdapterData';

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
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

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
            ADTRelationshipData,
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
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });
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
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

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

    getADTModels(params: AdapterMethodParamsForGetADTModels = null) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

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

    getADTTwinsByModelId(params: AdapterMethodParamsForGetADTTwinsByModelId) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

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
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

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
                    query: `SELECT * FROM DIGITALTWINS T WHERE STARTSWITH(T.$metadata.$model, '${params.searchTerm}') OR STARTSWITH(T.$dtId, '${params.searchTerm}')`,
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
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        const createKeyValuePairData = (
            axiosData: IADTTwin
        ): KeyValuePairData[] =>
            axiosData
                ? properties.map((prop) => {
                      const kvp = {} as KeyValuePairData;
                      kvp.key = prop;
                      kvp.value = axiosData[prop];
                      if (additionalParameters?.isTimestampIncluded) {
                          kvp.timestamp = new Date(
                              axiosData.$metadata?.[prop]?.lastUpdateTime
                          );
                      }
                      return kvp;
                  })
                : [];

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
}
