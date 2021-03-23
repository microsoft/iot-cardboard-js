import axios from 'axios';
import {
    IADTAdapter,
    IADTModel,
    IADTwin,
    IAuthService,
    IHierarchyNode
} from '../Models/Constants/Interfaces';
import {
    AdapterResult,
    KeyValuePairAdapterData,
    SearchSpan,
    TsiClientAdapterData
} from '../Models/Classes';
import { ADTModelsData, ADTwinsData } from '../Models/Constants/Types';
import ADTAdapterData from '../Models/Classes/AdapterDataClasses/ADTAdapterData';

export default class ADTAdapter implements IADTAdapter {
    private authService: IAuthService;
    private adtHostUrl: string;

    constructor(adtHostUrl: string, authService: IAuthService) {
        this.adtHostUrl = adtHostUrl;
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
            error: null
        });
    }

    async getAdtModels() {
        try {
            const token = await this.authService.getToken();
            const axiosData = await axios({
                method: 'get',
                url: 'http://localhost:3002/api/proxy/adt', // TODO: update this link for production, make sure this points to the right adt proxy server
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl,
                    'x-adt-endpoint': 'models'
                },
                params: {
                    'api-version': '2020-10-31'
                }
            });
            const data = axiosData.data;

            return new AdapterResult<ADTAdapterData>({
                result: new ADTAdapterData(data as ADTModelsData),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTAdapterData>({
                result: null,
                error: err
            });
        }
    }

    async getAdtTwins(modelId: string) {
        try {
            const token = await this.authService.getToken();
            const axiosData = await axios({
                method: 'post',
                url: 'http://localhost:3002/api/proxy/adt', // TODO: update this link for production, make sure this points to the right adt proxy server
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl,
                    'x-adt-endpoint': 'query'
                },
                params: {
                    'api-version': '2020-10-31'
                },
                data: {
                    query: `SELECT * FROM DIGITALTWINS WHERE $metadata.$model = '${modelId}'`
                }
            });
            const data = axiosData.data;

            return new AdapterResult<ADTAdapterData>({
                result: new ADTAdapterData(data as ADTwinsData),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTAdapterData>({
                result: null,
                error: err
            });
        }
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        try {
            const token = await this.authService.getToken();

            const axiosData = await axios({
                method: 'get',
                url: 'http://localhost:3002/api/proxy/adt', // TODO: update this link for production, make sure this points to the right adt proxy server
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl,
                    'x-adt-endpoint': `digitaltwins/${id}`
                },
                params: {
                    'api-version': '2020-10-31'
                }
            });

            const data = {};
            properties.forEach((prop) => {
                data[prop] = axiosData.data[prop];
            });

            return new AdapterResult<KeyValuePairAdapterData>({
                result: new KeyValuePairAdapterData(data),
                error: null
            });
        } catch (err) {
            return new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                error: err
            });
        }
    }

    public createHierarchyNodesFromADTModels = (models) => {
        return models
            ? models.reduce((p, c: IADTModel) => {
                  p[c.displayName.en] = {
                      name: c.displayName.en,
                      id: c.id,
                      nodeData: c,
                      children: {},
                      isCollapsed: true
                  } as IHierarchyNode;
                  return p;
              }, {})
            : {};
    };

    public createHierarchyNodesFromADTwins = (twins, modelId) => {
        return twins
            ? twins.reduce((p, c: IADTwin) => {
                  p[c.$dtId] = {
                      name: c.$dtId,
                      id: c.$dtId,
                      parentId: modelId,
                      nodeData: c
                  } as IHierarchyNode;
                  return p;
              }, {})
            : {};
    };
}
