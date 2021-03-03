import { AdapterResultParams } from '../Constants/Types';

class AdapterResult<T> {
    data: T | null;
    error: Error | null;

    constructor(params: AdapterResultParams<T>) {
        this.data = params.data;
        this.error = params.error;
    }

    hasNoData() {
        return this.data === null;
    }

    hasError() {
        return this.error !== null;
    }
}

export default AdapterResult;
