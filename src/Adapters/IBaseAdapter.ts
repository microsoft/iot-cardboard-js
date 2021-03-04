import KeyValuePairAdapterData from '../Models/Classes/AdapterDataClasses/KeyValuePairAdapterData';
import TsiClientAdapterData from '../Models/Classes/AdapterDataClasses/TsiclientAdapterData';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { AdapterReturnType } from '../Models/Constants/Types';

export interface IBaseAdapter {
    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<TsiClientAdapterData>;

    getKeyValuePairs(
        id: string,
        properties: Array<string>,
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<KeyValuePairAdapterData>;
}
