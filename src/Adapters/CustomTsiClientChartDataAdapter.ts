import { SearchSpan, TsiClientAdapterData } from '../Models/Classes';
import BaseCustomAdapter from '../Models/Classes/BaseCustomAdapter';
import {
    IBaseCustomAdapterParams,
    ITsiClientChartDataAdapter,
    TsiClientData
} from '../Models/Constants';

interface CustomTsiClientAdapterParams extends IBaseCustomAdapterParams {
    searchSpan: SearchSpan;
}

/**
 * ITsiClientChartDataAdapter adapter utility.
 * This class simplifies construction of a custom adapter which adheres
 * to the ITsiClientChartDataAdapter interface.
 */
class CustomTsiClientChartDataAdapter
    extends BaseCustomAdapter<
        CustomTsiClientAdapterParams,
        TsiClientData,
        TsiClientAdapterData
    >
    implements ITsiClientChartDataAdapter {
    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[],
        additionalParameters?: Record<string, any>
    ) {
        const params: CustomTsiClientAdapterParams = {
            id,
            searchSpan,
            properties,
            ...(additionalParameters && { additionalParameters })
        };

        return await this.executeDataFetch(params, TsiClientAdapterData);
    }
}

export default CustomTsiClientChartDataAdapter;
