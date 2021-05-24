import { KeyValuePairAdapterData } from '../Models/Classes';
import BaseCustomAdapter from '../Models/Classes/BaseCustomAdapter';
import {
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
class CustomKeyValuePairAdapter
    extends BaseCustomAdapter<
        CustomKeyValuePairAdapterParams,
        Array<KeyValuePairData>,
        KeyValuePairAdapterData
    >
    implements IKeyValuePairAdapter {
    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters?: IGetKeyValuePairsAdditionalParameters
    ) {
        const params: CustomKeyValuePairAdapterParams = {
            id,
            properties,
            ...(additionalParameters && { additionalParameters })
        };
        return await this.executeDataFetch(params, KeyValuePairAdapterData);
    }
}

export default CustomKeyValuePairAdapter;
