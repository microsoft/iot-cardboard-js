import axios from 'axios';
import { IAuthService } from '../Models/Constants/Interfaces';
import { KeyValuePairAdapterData } from '../Models/Classes';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { IKeyValuePairAdapter } from '../Models/Constants';
import { ComponentErrorType } from '../Models/Constants';
import { KeyValuePairData } from '../Models/Constants/Types';

export default class IoTCentralAdapter implements IKeyValuePairAdapter {
    private authService: IAuthService;
    private iotCentralAppId: string;

    constructor(iotCentralAppId: string, authService: IAuthService) {
        this.iotCentralAppId = iotCentralAppId;
        this.authService = authService;
        this.authService.login();
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
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
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const data = [];
            properties.forEach((prop, i) => {
                const kvp = {} as KeyValuePairData;
                kvp.key = prop;
                kvp.value = axiosData[i].data.value;
                data.push(kvp);
            });

            return new KeyValuePairAdapterData(data);
        });
    }
}
