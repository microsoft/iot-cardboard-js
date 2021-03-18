import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { AdapterError } from '../Models/Classes/Errors';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { AdapterErrorType } from '../Models/Constants';
import { TsiClientData } from '../Models/Constants/Types';
import IBaseAdapter from './IBaseAdapter';

export default class MockAdapter implements IBaseAdapter {
    private mockData = null;
    private mockError = null;
    private networkTimeoutMillis;

    constructor(
        mockData?: any,
        networkTimeoutMillis = 1000,
        mockError?: AdapterErrorType
    ) {
        this.mockData = mockData;
        this.mockError = mockError;
        this.networkTimeoutMillis = networkTimeoutMillis;
    }

    async mockNetwork(timeout = this.networkTimeoutMillis) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, timeout);
        });

        // throw error if mock error type passed into adapter
        if (this.mockError) {
            throw new AdapterError({
                isCatastrophic: true,
                type: this.mockError
            });
        }
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        const manager = new AdapterMethodSandbox({ authservice: null });

        return await sandbox.safelyFetchData(async () => {
            const getKVPData = () => {
                const kvps = {};
                properties.forEach((p) => {
                    kvps[p] = Math.random();
                });
                return kvps;
            };

            await this.mockNetwork();
            return new KeyValuePairAdapterData(getKVPData());
        });
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

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const sandbox = new AdapterMethodSandbox({ authservice: null });
        return await sandbox.safelyFetchData(async () => {
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
            return new TsiClientAdapterData(getData());
        });
    }
}
