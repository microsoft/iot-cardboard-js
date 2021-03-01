import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { AdapterReturnType } from '../Models/Constants/Types';

export interface IBaseAdapter {
    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<LineChartData>;

    getKeyValuePairs(
        id: string,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<Record<string, any>>;
}
