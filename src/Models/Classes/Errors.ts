import i18n from '../../i18n';
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

    getAdapterErrorMessageFromType = (errorType: AdapterErrorType) => {
        switch (errorType) {
            case AdapterErrorType.TokenRetrievalFailed:
                return i18n.t('adapterErrors.tokenFailed');
            case AdapterErrorType.DataFetchFailed:
                return i18n.t('adapterErrors.dataFetchFailed');
            default:
                return i18n.t('adapterErrors.unkownError');
        }
    };

    constructor({
        message,
        type = AdapterErrorType.UnknownError,
        isCatastrophic = false,
        rawError = null
    }: IAdapterError) {
        super(message);
        this.message = message
            ? message
            : this.getAdapterErrorMessageFromType(type);
        this.type = type;
        this.isCatastrophic = isCatastrophic;
        this.rawError = rawError;

        Object.setPrototypeOf(this, AdapterError.prototype);
    }
}

export { CancelledPromiseError, AdapterError };
