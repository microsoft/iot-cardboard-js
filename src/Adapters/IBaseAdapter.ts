import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/SearchSpan';

export interface IBaseAdapter {
    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): Promise<LineChartData>;

    getKeyValuePairs(
        id: string,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): Promise<Record<string, any>>;
}
