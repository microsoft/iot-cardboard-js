import { SearchSpan } from '../Models/Classes/SearchSpan';
import IBaseAdapter from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import { AdapterErrorType } from '../Models/Constants';
import AdapterErrorManager from '../Models/Classes/AdapterErrorManager';

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
            errorInfo: null
        });
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        const errorManager = new AdapterErrorManager();

        return await errorManager.sandboxAdapterExecution(async () => {
            const token = await errorManager.sandboxFetchToken(
                this.authService
            );

            let axiosData;
            try {
                axiosData = await axios({
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
            } catch (err) {
                errorManager.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = {};
            properties.forEach((prop) => {
                data[prop] = axiosData.data[prop];
            });

            return new AdapterResult<KeyValuePairAdapterData>({
                result: new KeyValuePairAdapterData(data),
                errorInfo: null
            });
        });
    }
}
