import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IGetKeyValuePairsAdditionalParameters } from '../Models/Constants/Interfaces';
import { AdapterReturnType } from '../Models/Constants/Types';

export default interface IBaseAdapter {
    getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: readonly string[],
        additionalParameters?: Record<string, any>
    ): AdapterReturnType<TsiClientAdapterData>;

    getKeyValuePairs(
        id: string,
        properties: readonly string[],
        additionalParameters?: IGetKeyValuePairsAdditionalParameters
    ): AdapterReturnType<KeyValuePairAdapterData>;
}
