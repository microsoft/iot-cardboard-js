import { IAdapterData } from '../Constants/Interfaces';
import { AdapterResultParams } from '../Constants/Types';

class AdapterResult<T extends IAdapterData> {
    result: T;
    error: Error | null;

    constructor(params: AdapterResultParams<T>) {
        this.result = params.result;
        this.error = params.error;
    }

    hasNoData() {
        if (this.result && 'hasNoData' in this.result) {
            return this.result.hasNoData();
        } else {
            return this.result === null || this.result?.data === null;
        }
    }

    hasError() {
        return this.error !== null;
    }
}

export default AdapterResult;
