import { SearchSpan } from '../Models/Classes/SearchSpan';
import IBaseAdapter from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { AdapterErrorType } from '../Models/Constants';

export default class IoTCentralAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private iotCentralAppId: string;

    constructor(iotCentralAppId: string, authService: IAuthService) {
        this.iotCentralAppId = iotCentralAppId;
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
        const sandbox = new AdapterMethodSandbox({
            authservice: this.authService
        });

        return await sandbox.safelyFetchData(async (token) => {
            let axiosGets;
            let axiosData;

            try {
                axiosGets = properties.map(async (prop) => {
                    return await axios.get(
                        `https://${this.iotCentralAppId}/api/preview/devices/${id}/telemetry/${prop}`,
                        {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        }
                    );
                });

                axiosData = await axios.all(axiosGets);
            } catch (err) {
                sandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = {};
            properties.forEach((prop, i) => {
                data[prop] = axiosData[i].data.value;
            });

            return new KeyValuePairAdapterData(data);
        });
    }
}
