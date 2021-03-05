import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import TsiClientAdapterData from '../Models/Classes/AdapterDataClasses/TsiclientAdapterData';
import KeyValuePairAdapterData from '../Models/Classes/AdapterDataClasses/KeyValuePairAdapterData';
import { adtAPIProxyServerUrl } from '../Models/Constants/Constants';

export default class ADTAdapter implements IBaseAdapter {
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

    async getKeyValuePairs(id: string, properties: string[]) {
        try {
            const token = await this.authService.getToken();

            const axiosData = await axios({
                method: 'get',
                url: adtAPIProxyServerUrl,
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
    // private authService: IAuthService;
    // private adtHostUrl: string;

    // constructor(adtHostUrl: string, authService: IAuthService) {
    //     this.adtHostUrl = adtHostUrl;
    //     this.authService = authService;
    //     this.authService.login();
    // }

    // getTsiclientChartDataShape(
    //     id: string,
    //     searchSpan: SearchSpan,
    //     properties: string[]
    // ): Promise<LineChartData> {
    //     console.log(id + searchSpan + properties);
    //     throw new Error('Method not implemented.');
    // }

    // getKeyValuePairs(
    //     id: string,
    //     properties: string[]
    // ): Promise<Record<string, any>> {
    //     return new Promise((resolve) => {
    //         this.authService
    //             .getToken()
    //             .then((token) => {
    //                 return axios.get(`http://localhost:3001`, {
    //                     headers: {
    //                         Authorization: 'Bearer ' + token,
    //                         'Target-URL': `https://${this.adtHostUrl}/digitaltwins/${id}`
    //                     },
    //                     params: {
    //                         'api-version': '2020-10-31'
    //                     }
    //                 });
    //             })
    //             .then((res) => {
    //                 const data = {};
    //                 properties.forEach((prop) => {
    //                     data[prop] = res.data[prop];
    //                 });
    //                 resolve(data);
    //             });
    //     });
    // }
}
