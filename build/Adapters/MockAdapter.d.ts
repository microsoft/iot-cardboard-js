import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
export default class MockAdapter implements IBaseAdapter {
    private mockData;
    constructor(mockData?: any);
    static generateMockLineChartData(searchSpan: SearchSpan, properties: string[]): LineChartData;
    getLineChartData(id: string, searchSpan: SearchSpan, properties: string[]): Promise<LineChartData>;
}
