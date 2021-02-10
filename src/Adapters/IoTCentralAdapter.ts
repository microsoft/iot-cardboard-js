import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import MsalAuthService from '../Helpers/MsalAuthService';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';

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
        properties: string[],
        additionalProperties: any
    ): Promise<LineChartData> {
        return new Promise((resolve) => {
            this.authService.getToken().then((token) => {
                alert(token);
                console.log(id + searchSpan + properties);
                debugger;
                if (additionalProperties.isLkv) {
                    // make an ajax request to this.iotCentralAppId
                    // using id and properties to get LKV
                    resolve({ data: null });
                } else {
                    // make an ajax request to this.iotCentralAppId
                    // using id searchspan and properties to get time series
                    resolve({ data: null });
                }
            });
        });
    }
}
