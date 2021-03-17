import {
    AdapterErrorType,
    AdapterReturnType,
    IAdapterData,
    IAdapterError,
    IAuthService
} from '../Constants';
import AdapterResult from './AdapterResult';
import i18n from '../../i18n';
import { AdapterError } from './Errors';

const getAdapterErrorMessageFromType = (errorType: AdapterErrorType) => {
    switch (errorType) {
        case AdapterErrorType.TokenRetrievalFailed:
            return i18n.t('adapterErrors.tokenFailed');
        case AdapterErrorType.DataFetchFailed:
            return i18n.t('adapterErrors.dataFetchFailed');
        default:
            return i18n.t('adapterErrors.unkownError');
    }
};

class AdapterErrorManager {
    private errors: IAdapterError[];
    private catasrophicError: IAdapterError;

    constructor() {
        this.errors = [];
        this.catasrophicError = null;
    }

    /** Pushes new error onto errors list.  THROWS if error is marked catastrophic! */
    pushError({
        rawError = null,
        message,
        type = AdapterErrorType.UnknownError,
        isCatastrophic = false
    }: IAdapterError) {
        const error = new AdapterError({
            message: message ? message : getAdapterErrorMessageFromType(type),
            type,
            isCatastrophic,
            rawError
        });

        this.errors.push(error);

        if (error.isCatastrophic) {
            this.catasrophicError = error;
            throw error;
        }
    }

    /**
     * Fetch token wrapped in try / catch block.  If token fetch fails, will attach
     * TokenRetrievalFailed error to error manager.
     */
    async sandboxFetchToken(authService: IAuthService) {
        let token;
        try {
            token = await authService.getToken();
            if (!token) {
                throw new Error('Token undefined');
            }
        } catch (err) {
            this.pushError({
                isCatastrophic: true,
                type: AdapterErrorType.TokenRetrievalFailed,
                rawError: err
            });
        }
        return token;
    }

    /**
     * • Runs adapter logic in sandbox which handles errors consistently.  This will wrap logic in a
     * try/catch block and attach the AdapterErrorManager instance to the AdapterResult.
     *
     * • Error prone operations in the adapter should be wrapped in an additional try/catch which
     * pushes specific errors to the error manager when caught.
     *
     * • Catastrophic errors will halt adapter execution.
     *
     * • Uncaught errors will be treated as catastrophic errors with unknown types and will also halt adapter execution.
     *  */
    async sandboxAdapterExecution<T extends IAdapterData>(
        adapterLogic: () => AdapterReturnType<T>
    ) {
        try {
            return await adapterLogic();
        } catch (err) {
            if (!(err instanceof AdapterError)) {
                // Unknown catastrophic error, construct new catasrophicError error
                this.catasrophicError = new AdapterError({
                    isCatastrophic: true,
                    rawError: err,
                    type: AdapterErrorType.UnknownError,
                    message: 'Unkown adapter error'
                });

                this.errors.push(this.catasrophicError);
            }

            // Attach errorInfo to result object and return
            return new AdapterResult<T>({
                errorInfo: {
                    errors: this.errors,
                    catastrophicError: this.catasrophicError
                },
                result: null
            });
        }
    }
}

export default AdapterErrorManager;
