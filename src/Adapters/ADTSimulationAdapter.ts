import axios from 'axios';
import {
    AdapterMethodSandbox,
    DTModel,
    DTwin,
    DTwinRelationship,
    DTwinUpdateEvent,
    IAuthService,
    ISimulationAdapter
} from '..';
import { SimulationAdapterData } from '../Models/Classes/AdapterDataClasses/SimulationAdapterData';

export default class ADTSimulationAdapter implements ISimulationAdapter {
    private authService: IAuthService;
    public adtHostUrl = '';
    private adtProxyServerPath: string;
    public packetNumber: number;

    constructor(authService: IAuthService, adtProxyServerPath = '/api/proxy') {
        this.authService = authService;
        this.adtProxyServerPath = adtProxyServerPath;
        this.packetNumber = 0;
        this.authService.login();
    }

    async createModels(models: DTModel[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const data = await axios({
                method: 'post',
                url: this.adtProxyServerPath,
                data: models,
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
            return new SimulationAdapterData(data);
        });
    }

    async createTwins(twins: DTwin[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const data = await axios.all(
                twins.map((twin) => {
                    const twinCopy = JSON.parse(JSON.stringify(twin));
                    delete twinCopy['$dtId'];
                    return axios({
                        method: 'put',
                        url: this.adtProxyServerPath,
                        data: twinCopy,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl,
                            'x-adt-endpoint': `digitaltwins/${twin.$dtId}`
                        },
                        params: {
                            'api-version': '2020-10-31'
                        }
                    }).catch((err) => {
                        return err.response.data;
                    });
                })
            );

            return new SimulationAdapterData(data);
        });
    }

    async updateTwins(events: Array<DTwinUpdateEvent>) {
        this.packetNumber++;
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const data = await axios.all(
                events.map((event) => {
                    const id = event.dtId;
                    return axios({
                        method: 'patch',
                        url: this.adtProxyServerPath,
                        data: event.patchJSON,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl,
                            'x-adt-endpoint': `digitaltwins/${id}`
                        },
                        params: {
                            'api-version': '2020-10-31'
                        }
                    }).catch((err) => {
                        return err.response.data;
                    });
                })
            );
            return new SimulationAdapterData(data);
        });
    }

    async createRelationships(relationships: DTwinRelationship[]) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const data = await axios.all(
                relationships.map((relationship: DTwinRelationship) => {
                    const payload: any = {
                        $targetId: relationship.$targetId,
                        $relationshipName: relationship.$name
                    };
                    if (relationship.targetModel) {
                        payload.targetModel = relationship.targetModel;
                    }
                    return axios({
                        method: 'put',
                        url: this.adtProxyServerPath,
                        data: payload,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token,
                            'x-adt-host': this.adtHostUrl,
                            'x-adt-endpoint': `digitaltwins/${relationship.$dtId}/relationships/${relationship.$relId}`
                        },
                        params: {
                            'api-version': '2020-10-31'
                        }
                    }).catch((err) => {
                        return err.response.data;
                    });
                })
            );

            return new SimulationAdapterData(data);
        });
    }
}
