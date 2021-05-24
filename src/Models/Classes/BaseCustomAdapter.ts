import {
    AdapterErrorType,
    CustomDataFetcher,
    CustomDataTransformer,
    IAdapterData
} from '../Constants';
import AdapterMethodSandbox from './AdapterMethodSandbox';

class BaseCustomAdapter<
    CustomAdapterParams,
    TransformedData,
    AdapterReturnDataClass extends IAdapterData
> {
    dataFetcher: CustomDataFetcher<CustomAdapterParams>;
    dataTransformer: CustomDataTransformer<
        CustomAdapterParams,
        TransformedData
    >;

    constructor(params: {
        dataFetcher: CustomDataFetcher<CustomAdapterParams>;
        dataTransformer: CustomDataTransformer<
            CustomAdapterParams,
            TransformedData
        >;
    }) {
        this.dataFetcher = params.dataFetcher;
        this.dataTransformer = params.dataTransformer;
    }

    async executeDataFetch(
        params: CustomAdapterParams,
        dataClass: new (data: TransformedData) => AdapterReturnDataClass
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: null
        });

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const data = await this.dataFetcher(params);
                const transformedDataArray = this.dataTransformer(data, params);
                return new dataClass(transformedDataArray);
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

export default BaseCustomAdapter;
