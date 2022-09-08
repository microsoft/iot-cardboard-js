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
            return this.result == null || this.result?.data == null;
        }
    }

    hasError() {
        return this.getErrors()?.length > 0;
    }

    getData() {
        if (this.hasNoData()) {
            return null;
        }
        return this.result.data;
    }

    /** Returns error array if errors are present.  If no errors present, returns null */
    getErrors() {
        if (this.errorInfo?.errors && this.errorInfo?.errors.length > 0) {
            return this.errorInfo.errors;
        }
        return null;
    }

    /** Returns catastrophic error if present, otherwise returns null */
    getCatastrophicError() {
        if (this.errorInfo?.catastrophicError) {
            return this.errorInfo.catastrophicError;
        }
        return null;
    }
}

export default AdapterResult;
