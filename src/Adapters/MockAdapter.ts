import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import ADTModelData from '../Models/Classes/AdapterDataClasses/ADTModelData';
import ADTRelationshipData from '../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import ADTTwinData from '../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterResult from '../Models/Classes/AdapterResult';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IGetKeyValuePairsAdditionalParameters } from '../Models/Constants';
import {
    ADTRelationship,
    KeyValuePairData,
    TsiClientData
} from '../Models/Constants/Types';
import IBaseAdapter from './IBaseAdapter';

export default class MockAdapter implements IBaseAdapter {
    private mockData = null;
    private networkTimeoutMillis;

    constructor(mockData?: any, networkTimeoutMillis = 1000) {
        this.mockData = mockData;
        this.networkTimeoutMillis = networkTimeoutMillis;
    }

    async mockNetwork(timeout = this.networkTimeoutMillis) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(null), timeout);
        });
    }

    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters: IGetKeyValuePairsAdditionalParameters
    ) {
        try {
            const getKVPData = () => {
                const kvps = [];
                properties.forEach((p) => {
                    const kvp = {} as KeyValuePairData;
                    kvp.key = p;
                    kvp.value = Math.random();
                    if (additionalParameters?.isTimestampIncluded) {
                        kvp.timestamp = new Date();
                    }
                    kvps.push(kvp);
                });
                return kvps;
            };

            await this.mockNetwork();

            return new AdapterResult<KeyValuePairAdapterData>({
                result: new KeyValuePairAdapterData(getKVPData()),
                error: null
            });
        } catch (err) {
            return new AdapterResult<KeyValuePairAdapterData>({
                result: null,
                error: err
            });
        }
    }

    static generateMockLineChartData(
        searchSpan: SearchSpan,
        properties: string[]
    ): TsiClientData {
        const data = [];
        const from = searchSpan.from;
        const to = searchSpan.to;
        const bucketSizeMillis =
            searchSpan.bucketSizeMillis ||
            Math.ceil((to.valueOf() - from.valueOf()) / 100);
        for (let i = 0; i < properties.length; i++) {
            const lines = {};
            data.push({ [properties[i]]: lines });
            for (let j = 0; j < 1; j++) {
                const values = {};
                lines[''] = values;
                for (let k = 0; k < 60; k++) {
                    if (!(k % 2 && k % 3)) {
                        // if check is to create some sparseness in the data
                        const to = new Date(
                            from.valueOf() + bucketSizeMillis * k
                        );
                        const val = Math.random();
                        values[to.toISOString()] = { avg: val };
                    }
                }
            }
        }
        return data;
    }

    async getRelationships(id: string) {
        try {
            const getRelationshipsData = () => {
                const relationships: ADTRelationship[] = [];
                for (let i = 1; i <= 5; i++) {
                    relationships.push({
                        relationshipId: `relationship ${id}`,
                        relationshipName: `relationship ${i}`,
                        targetId: `target twin ${i}`,
                        targetModel: `target model ${i}`
                    });
                }
                return relationships;
            };

            await this.mockNetwork();

            return new AdapterResult<ADTRelationshipData>({
                result: new ADTRelationshipData(getRelationshipsData()),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTRelationshipData>({
                result: null,
                error: err
            });
        }
    }

    async getModel(modelId: string) {
        try {
            const getModelData = () => {
                return new ADTModelData({
                    id: modelId,
                    description: {},
                    displayName: null,
                    decommissioned: false,
                    uploadTime: '2021-1-1'
                });
            };

            await this.mockNetwork();

            return new AdapterResult<ADTModelData>({
                result: getModelData(),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTModelData>({
                result: null,
                error: err
            });
        }
    }

    async getTwin(twinId: string) {
        try {
            const getTwinData = () => {
                return new ADTTwinData({
                    $dtId: twinId,
                    $etag: `${twinId}Tag`,
                    $metadata: {
                        $model: `${twinId}Model`
                    }
                });
            };

            await this.mockNetwork();

            return new AdapterResult<ADTTwinData>({
                result: getTwinData(),
                error: null
            });
        } catch (err) {
            return new AdapterResult<ADTTwinData>({
                result: null,
                error: err
            });
        }
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        try {
            const getData = (): TsiClientData => {
                if (this.mockData !== undefined) {
                    return this.mockData;
                } else {
                    return MockAdapter.generateMockLineChartData(
                        searchSpan,
                        properties
                    );
                }
            };

            await this.mockNetwork();

            return new AdapterResult<TsiClientAdapterData>({
                result: new TsiClientAdapterData(getData()),
                error: null
            });
        } catch (err) {
            return new AdapterResult<TsiClientAdapterData>({
                result: null,
                error: err
            });
        }
    }
}
