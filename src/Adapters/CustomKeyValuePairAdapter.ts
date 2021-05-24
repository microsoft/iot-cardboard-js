import {
    AdapterMethodSandbox,
    KeyValuePairAdapterData
} from '../Models/Classes';
import {
    AdapterErrorType,
    CustomDataFetcher,
    CustomDataTransformer,
    IBaseCustomAdapterParams,
    IGetKeyValuePairsAdditionalParameters,
    IKeyValuePairAdapter,
    KeyValuePairData
} from '../Models/Constants';

interface CustomKeyValuePairAdapterParams extends IBaseCustomAdapterParams {
    additionalParameters?: IGetKeyValuePairsAdditionalParameters;
}

/**
 * IKeyValuePairAdapter adapter utility.
 * This class simplifies construction of a custom adapter which adheres
 * to the IKeyValuePairAdapter interface.
 */
class CustomKeyValuePairAdapter implements IKeyValuePairAdapter {
    dataFetcher: CustomDataFetcher<CustomKeyValuePairAdapterParams>;
    dataTransformer: CustomDataTransformer<
        CustomKeyValuePairAdapterParams,
        Array<KeyValuePairData>
    >;

    constructor(
        dataFetcher: CustomDataFetcher<CustomKeyValuePairAdapterParams>,
        dataTransformer: CustomDataTransformer<
            CustomKeyValuePairAdapterParams,
            Array<KeyValuePairData>
        >
    ) {
        this.dataFetcher = dataFetcher;
        this.dataTransformer = dataTransformer;
    }

    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters?: IGetKeyValuePairsAdditionalParameters
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: null
        });

        const params: CustomKeyValuePairAdapterParams = {
            id,
            properties,
            ...(additionalParameters && { additionalParameters })
        };

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const data = await this.dataFetcher(params);
                const transformedDataArray = this.dataTransformer(data, params);
                return new KeyValuePairAdapterData(transformedDataArray);
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

export default CustomKeyValuePairAdapter;
