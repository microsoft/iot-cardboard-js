import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';

export default class ADTAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private adtHostUrl: string;

    constructor(adtHostUrl: string, authService: IAuthService) {
        this.adtHostUrl = adtHostUrl;
        this.authService = authService;
        this.authService.login();
    }

    getTsiclientChartDataShape(
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
                    return axios.get(`http://localhost:3001`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            'Target-URL': `https://${this.adtHostUrl}/digitaltwins/${id}`
                        },
                        params: {
                            'api-version': '2020-10-31'
                        }
                    });
                })
                .then((res) => {
                    const data = {};
                    properties.forEach((prop) => {
                        data[prop] = res.data[prop];
                    });
                    resolve(data);
                });
        });
    }
}
