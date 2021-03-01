import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';

export default class IoTCentralAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private iotCentralAppId: string;

    constructor(iotCentralAppId: string, authService: IAuthService) {
        this.iotCentralAppId = iotCentralAppId;
        this.authService = authService;
        this.authService.login();
    }
    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        console.log(id + searchSpan + properties);
        throw new Error('Method not implemented.');
        return {
            data: null,
            error: null
        };
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        try {
            const token = await this.authService.getToken();

            const axiosGets = properties.map(async (prop) => {
                return await axios.get(
                    `https://${this.iotCentralAppId}/api/preview/devices/${id}/telemetry/${prop}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                );
            });

            const axiosData = await axios.all(axiosGets);
            const data = {};
            properties.forEach((prop, i) => {
                data[prop] = axiosData[i].data.value;
            });

            return {
                data,
                error: null
            };
        } catch (err) {
            return {
                data: null,
                error: err
            };
        }
    }
}
