import axios from 'axios';
import {
    IADTAdapter,
    IAuthService,
    IGetKeyValuePairsAdditionalParameters
} from '../Models/Constants/Interfaces';
import {
    AdapterMethodParamsForGetADTModels,
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins,
    ADTRelationship
} from '../Models/Constants/Types';
import {
    AdapterResult,
    KeyValuePairAdapterData,
    SearchSpan,
    TsiClientAdapterData
} from '../Models/Classes';
import { AdapterErrorType } from '../Models/Constants';
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
    private adtProxyServerURL: string;

    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        adtProxyServerURL = 'http://localhost:3002/api/proxy/adt' // TODO: update this link for production, make sure this points to the right adt proxy server
    ) {
        this.adtHostUrl = adtHostUrl;
        this.adtProxyServerURL = adtProxyServerURL;
        this.authService = authService;
        this.authService.login();
    }

    async getTsiclientChartDataShape(
        _id: string,
        _searchSpan: SearchSpan,
        _properties: string[]
    ) {
        throw new Error('Method not implemented.');
        return new AdapterResult<TsiClientAdapterData>({
            result: null,
            errorInfo: null
        });
    }

    async getRelationships(id: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'get',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': `digitaltwins/${id}/relationships`
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            /*
                NOTE: the targetModel property is a custom property that needs to be explicitly 
                defined in the DTDL model's definition of that relationship type, and needs to 
                be explicitly provided when creating the twin relationship
            */
            const relationships: ADTRelationship[] = axiosData.data.value.map(
                (rawRelationship) => {
                    return {
                        relationshipId: rawRelationship.$relationshipId,
                        relationshipName: rawRelationship.$relationshipName,
                        targetId: rawRelationship.$targetId,
                        targetModel: rawRelationship.targetModel
                            ? rawRelationship.targetModel
                            : ''
                    };
                }
            );

            return new ADTRelationshipData(relationships);
        });
    }

    async getADTTwin(twinId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'get',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': `digitaltwins/${twinId}`
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
            const data = axiosData.data;
            return new ADTTwinData(data);
        });
    }

    async getADTModel(modelId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'get',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': `models/${modelId}`
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
            const data = axiosData.data;
            return new ADTModelData(data);
        });
    }

    async getADTModels(params: AdapterMethodParamsForGetADTModels = null) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'get',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        ...(params?.nextLink && {
                            'x-adt-url': params?.nextLink
                        }),
                        ...(!params?.nextLink && {
                            'x-adt-host': this.adtHostUrl,
                            'x-adt-endpoint': 'models'
                        })
                    },
                    params: {
                        ...(!params?.nextLink && {
                            'api-version': ADT_ApiVersion
                        })
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
            const data = axiosData.data;
            return new ADTAdapterModelsData(data);
        });
    }

    async getADTTwinsByModelId(
        params: AdapterMethodParamsForGetADTTwinsByModelId
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'post',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': 'query'
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    },
                    data: {
                        query: `SELECT * FROM DIGITALTWINS WHERE $metadata.$model = '${params.modelId}'`,
                        continuationToken: params.continuationToken
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = axiosData.data;
            return new ADTAdapterTwinsData(data);
        });
    }

    async searchADTTwins(params: AdapterMethodParamsForSearchADTTwins) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'post',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': 'query'
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    },
                    data: {
                        query: `SELECT * FROM DIGITALTWINS T WHERE STARTSWITH(T.$metadata.$model, '${params.searchTerm}') OR STARTSWITH(T.$dtId, '${params.searchTerm}')`,
                        continuationToken: params.continuationToken
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = axiosData.data;
            return new ADTAdapterTwinsData(data);
        });
    }

    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters: IGetKeyValuePairsAdditionalParameters
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: 'get',
                    url: this.adtProxyServerURL,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        'x-adt-host': this.adtHostUrl,
                        'x-adt-endpoint': `digitaltwins/${id}`
                    },
                    params: {
                        'api-version': ADT_ApiVersion
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = [];
            properties.forEach((prop) => {
                const kvp = {} as KeyValuePairData;
                kvp.key = prop;
                kvp.value = axiosData.data[prop];
                if (additionalParameters?.isTimestampIncluded) {
                    kvp.timestamp = new Date(
                        axiosData.data?.$metadata?.[prop]?.lastUpdateTime
                    );
                }
                data.push(kvp);
            });

            return new KeyValuePairAdapterData(data);
        });
    }
}
