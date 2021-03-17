import { AdapterErrorType, IAdapterError } from '../Constants';

class CancelledPromiseError extends Error {
    constructor(m = 'Promise cancelled.') {
        super(m);
        this.name = 'Promise cancelled error';

        // Set error prototype to allow for 'instanceof' CancelledPromiseError
        Object.setPrototypeOf(this, CancelledPromiseError.prototype);
    }
}

class AdapterError extends Error {
    public type;
    public isCatastrophic;
    public rawError;

    constructor({
        message = 'Unkown adapter error',
        type = AdapterErrorType.UnknownError,
        isCatastrophic = false,
        rawError = null
    }: IAdapterError) {
        super(message);
        this.type = type;
        this.isCatastrophic = isCatastrophic;
        this.rawError = rawError;

        Object.setPrototypeOf(this, AdapterError.prototype);
    }
}

export { CancelledPromiseError, AdapterError };
