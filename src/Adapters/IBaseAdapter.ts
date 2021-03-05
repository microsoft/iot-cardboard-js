import KeyValuePairAdapterData from '../Models/Classes/AdapterDataClasses/KeyValuePairAdapterData';
import TsiClientAdapterData from '../Models/Classes/AdapterDataClasses/TsiclientAdapterData';
import { AdapterReturnType } from '../Models/Constants/Types';

import { IAdapterMethodParams } from '../Models/Constants/Interfaces';

export interface IBaseAdapter {
    getTsiclientChartDataShape(
        params: IAdapterMethodParams
    ): AdapterReturnType<TsiClientAdapterData>;

    getKeyValuePairs(
        params: IAdapterMethodParams
    ): AdapterReturnType<KeyValuePairAdapterData>;
}
