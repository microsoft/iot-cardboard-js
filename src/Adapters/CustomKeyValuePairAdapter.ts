import {
    AdapterMethodSandbox,
    KeyValuePairAdapterData
} from '../Models/Classes';
import {
    AdapterErrorType,
    IGetKeyValuePairsAdditionalParameters,
    IKeyValuePairAdapter,
    KeyValuePairData
} from '../Models/Constants';

/**
 * Asynchronous method to fetch data.
 *
 * @param params - Parameters passed from the card to the adapter.
 * @returns Promise wrapping data.
 */
type DataFetcher = (params?: KeyValuePairParams) => Promise<any>;

/**
 * Method to transform data returned by DataFetcher into array of KeyValuePairData.
 * The data returned by DataFetcher will be passed into the DataTransformer.
 *
 * @param data - Data returned by DataFetcher
 * @param params - Parameters passed from the card to the adapter.
 * @returns Array of type KeyValuePairData.
 */
type DataTransformer = (
    data: any,
    params: KeyValuePairParams
) => Array<KeyValuePairData>;

type KeyValuePairParams = {
    id: string;
    properties: readonly string[];
    additionalParameters?: IGetKeyValuePairsAdditionalParameters;
};

/**
 * IKeyValuePairAdapter adapter utility.
 * This class simplifies construction of a custom adapter which adheres
 * to the IKeyValuePairAdapter interface.
 */
class CustomKeyValuePairAdapter implements IKeyValuePairAdapter {
    dataFetcher: DataFetcher;
    dataTransformer: DataTransformer;

    constructor(dataFetcher: DataFetcher, dataTransformer: DataTransformer) {
        this.dataFetcher = dataFetcher;
        this.dataTransformer = dataTransformer;
    }

    async getKeyValuePairs(
        id: string,
        properties: readonly string[],
        additionalParameters?: IGetKeyValuePairsAdditionalParameters
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox({
            authservice: null
        });

        const params = {
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
