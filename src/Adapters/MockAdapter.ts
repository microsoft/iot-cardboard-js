import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';

export default class MockAdapter implements IBaseAdapter {
    private mockData;

    constructor(mockData?: any) {
        this.mockData = mockData;
    }
    getKeyValuePairs(
        id: string,
        properties: string[]
    ): Promise<Record<string, any>> {
        const getKVPData = () => {
            const kvps = {};
            properties.forEach((p) => {
                kvps[p] = Math.random();
            });
            return kvps;
        };
        const returnPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve(getKVPData());
            }, 1000);
        });
        return returnPromise;
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
        console.log(data);
        return { data: data };
    }

    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ): Promise<LineChartData> {
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

        const returnPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve(getData());
            }, 1000);
        }) as Promise<LineChartData>;
        return returnPromise;
    }
}
