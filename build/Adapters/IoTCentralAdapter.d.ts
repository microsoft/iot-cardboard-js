import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import MsalAuthService from '../Helpers/MsalAuthService';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';
export default class IoTCentralAdapter implements IBaseAdapter {
    private authService;
    private iotCentralAppId;
    constructor(iotCentralAppId: string, authService?: MsalAuthService);
    getLineChartData(id: string, searchSpan: SearchSpan, properties: string[]): Promise<LineChartData>;
    getKeyValuePairs(id: string, properties: string[]): Promise<Record<string, any>>;
}
