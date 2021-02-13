import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Constants/Interfaces';

export default class IoTCentralAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private iotCentralAppId: string;

    constructor(iotCentralAppId: string, authService: IAuthService) {
        this.iotCentralAppId = iotCentralAppId;
        this.authService = authService;
        this.authService.login();
    }
    getLineChartData(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ): Promise<LineChartData> {
        console.log(id + searchSpan + properties);
        throw new Error('Method not implemented.');
    }

    getKeyValuePairs(
        id: string,
        properties: string[]
    ): Promise<Record<string, any>> {
        return new Promise((resolve) => {
            this.authService
                .getToken()
                .then((token) => {
                    const axiosGets = properties.map((prop) => {
                        return axios.get(
                            `https://${this.iotCentralAppId}/api/preview/devices/${id}/telemetry/${prop}`,
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            }
                        );
                    });
                    return axios.all(axiosGets);
                })
                .then((res) => {
                    const data = {};
                    properties.forEach((prop, i) => {
                        data[prop] = res[i].data.value;
                    });
                    resolve(data);
                });
        });
    }
}
