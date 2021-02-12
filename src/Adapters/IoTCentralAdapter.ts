import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import MsalAuthService from '../Helpers/MsalAuthService';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
import axios from 'axios';

export default class IoTCentralAdapter implements IBaseAdapter {
    private authService: MsalAuthService;
    private iotCentralAppId: string;

    constructor(
        iotCentralAppId: string,
        authService: MsalAuthService = new MsalAuthService({
            authority:
                'https://login.microsoftonline.com/e56f6d88-b263-4dae-9ade-5668d4e974fb',
            clientId: '91a64ae0-e4a0-4ea9-864d-275c60afff39',
            scope: 'https://apps.azureiotcentral.com/user_impersonation',
            redirectUri: 'http://localhost:3001'
        })
    ) {
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
