import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import AdapterResult from '../Models/Classes/AdapterResult';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { KeyValuePairData } from '../Models/Constants/Types';
import { IBaseAdapter } from './IBaseAdapter';

export default class MockAdapter implements IBaseAdapter {
    private mockData;

    constructor(mockData?: any) {
        this.mockData = mockData;
    }

    async mockNetwork(timeout) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(null), timeout);
        });
    }

    async getKeyValuePairs(id: string, properties: string[]) {
        try {
            const getKVPData = () => {
                const kvps = {};
                properties.forEach((p) => {
                    kvps[p] = Math.random();
                });
                return kvps;
            };

            await this.mockNetwork(1000);
            return new AdapterResult<KeyValuePairData>({
                data: getKVPData(),
                error: null
            });
        } catch (err) {
            return new AdapterResult<KeyValuePairData>({
                data: null,
                error: err
            });
        }
    }

    static generateMockLineChartData(
        searchSpan: SearchSpan,
        properties: string[]
    ): LineChartData {
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
        return { data: data };
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        try {
            const getData = (): LineChartData => {
                if (this.mockData) {
                    return this.mockData;
                } else {
                    return MockAdapter.generateMockLineChartData(
                        searchSpan,
                        properties
                    );
                }
            };

            await this.mockNetwork(1000);

            return new AdapterResult<LineChartData>({
                ...getData(),
                error: null
            });
        } catch (err) {
            return new AdapterResult<LineChartData>({
                data: null,
                error: err
            });
        }
    }
}
