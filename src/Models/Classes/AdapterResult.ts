import { IAdapterData, IErrorInfo } from '../Constants/Interfaces';
import { AdapterResultParams } from '../Constants/Types';

class AdapterResult<T extends IAdapterData> {
    result: T;
    errorInfo: IErrorInfo;

    constructor(params: AdapterResultParams<T>) {
        this.result = params.result;
        this.errorInfo = params.errorInfo;
    }

    hasNoData() {
        if (this.result && 'hasNoData' in this.result) {
            return this.result.hasNoData();
        } else {
            return this.result === null || this.result?.data === null;
        }
    }

    getData() {
        if (this.hasNoData()) {
            return null;
        }
        return this.result.data;
    }

    hasError() {
        return this.errorInfo !== null;
    }
}

export default AdapterResult;
