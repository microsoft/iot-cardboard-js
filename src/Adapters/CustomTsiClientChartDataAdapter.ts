import {
    AdapterMethodSandbox,
    SearchSpan,
    TsiClientAdapterData
} from '../Models/Classes';
import {
    AdapterErrorType,
    CustomDataFetcher,
    CustomDataTransformer,
    IBaseCustomAdapterParams,
    ITsiClientChartDataAdapter,
    TsiClientData
} from '../Models/Constants';

interface CustomTsiClientAdapterParams extends IBaseCustomAdapterParams {
    searchSpan: SearchSpan;
}

/**
 * IKeyValuePairAdapter adapter utility.
 * This class simplifies construction of a custom adapter which adheres
 * to the IKeyValuePairAdapter interface.
 */
class CustomTsiClientChartDataAdapter implements ITsiClientChartDataAdapter {
    dataFetcher: CustomDataFetcher<CustomTsiClientAdapterParams>;
    dataTransformer: CustomDataTransformer<
        CustomTsiClientAdapterParams,
        TsiClientData
    >;

    constructor(
        dataFetcher: CustomDataFetcher<CustomTsiClientAdapterParams>,
        dataTransformer: CustomDataTransformer<
            CustomTsiClientAdapterParams,
            TsiClientData
        >
    ) {
        this.dataFetcher = dataFetcher;
        this.dataTransformer = dataTransformer;
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[],
        additionalParameters: Record<string, any>
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: null
        });

        const params: CustomTsiClientAdapterParams = {
            id,
            properties,
            searchSpan,
            ...(additionalParameters && { additionalParameters })
        };

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const data = await this.dataFetcher(params);
                const transformedDataArray = this.dataTransformer(data, params);
                return new TsiClientAdapterData(transformedDataArray);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        });
    }
}

export default CustomTsiClientChartDataAdapter;
