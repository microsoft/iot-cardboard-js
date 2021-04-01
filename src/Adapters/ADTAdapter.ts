import { SearchSpan } from '../Models/Classes/SearchSpan';
import IBaseAdapter from './IBaseAdapter';
import axios from 'axios';
import {
    IAuthService,
    IGetKeyValuePairsAdditionalParameters
} from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import { ADTRelationship } from '../Models/Constants/Types';
import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import ADTRelationshipData from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import { KeyValuePairData } from '../Models/Constants';

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

    async getRelationships(id: string) {
        try {
            const token = await this.authService.getToken();
            const axiosData = await axios({
                method: 'get',
                url: 'http://localhost:3002/api/proxy/adt', // TODO: update this link for production, make sure this points to the right adt proxy server
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                    'x-adt-host': this.adtHostUrl,
                    'x-adt-endpoint': `digitaltwins/${id}/relationships`
                },
                params: {
                    'api-version': '2020-10-31'
                }
            });
            const relationships: ADTRelationship[] = axiosData.data.value.map(
                (rawRelationship) => {
                    // NOTE: the targetModel property is a custom property that needs to be explicitly defined in the DTDL model's definition of that relationship type, and needs to be explicitly provided when creating the twin relationship

                    return {
                        relationshipId: rawRelationship.$relationshipId,
                        relationshipName: rawRelationship.$relationshipName,
                        targetId: rawRelationship.$targetId,
                        targetModel: rawRelationship.targetModel
                            ? rawRelationship.targetModel
                            : ''
                    };
                }
            );
            return new AdapterResult<ADTRelationshipData>({
                result: new ADTRelationshipData(relationships),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTRelationshipData>({
                result: null,
                error: err
            });
        }
    }

    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters: IGetKeyValuePairsAdditionalParameters
    ) {
        try {
            const token = await this.authService.getToken();

            const axiosData = await axios({
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

            const data = [];
            properties.forEach((prop) => {
                const kvp = {} as KeyValuePairData;
                kvp.key = prop;
                kvp.value = axiosData.data[prop];
                if (additionalParameters?.isTimestampIncluded) {
                    kvp.timestamp = new Date(
                        axiosData.data?.$metadata?.[prop]?.lastUpdateTime
                    );
                }
                data.push(kvp);
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
}
