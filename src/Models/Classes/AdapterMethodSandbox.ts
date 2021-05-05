import {
    CardErrorType,
    IAdapterData,
    ICardError,
    IAuthService
} from '../Constants';
import AdapterResult from './AdapterResult';
import { CardError } from './Errors';

interface IAdapterMethodSandbox {
    authservice: IAuthService;
}

/** Utility class which creates sandbox environment for adapter data fetching.
 *
 * • Manages errors and catasrophicErrors.
 *
 * • Safely fetches auth token and passes token to data fetching callback
 *
 * • Catches, classifies, and aggregates errors
 */
class AdapterMethodSandbox {
    private errors: ICardError[];
    private catasrophicError: ICardError;
    private authService: IAuthService;

    constructor({ authservice }: IAdapterMethodSandbox) {
        this.errors = [];
        this.catasrophicError = null;
        this.authService = authservice;
    }

    /**
     *  Pushes new CardError onto errors list.  If error is marked as catastrophic,
     *  execution will halt with catastrophic error attached to result
     */
    pushError({ rawError, message, type, isCatastrophic }: ICardError) {
        const error = new CardError({
            message,
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
     * catastrophic TokenRetrievalFailed error, halting further execution.
     */
    private async safelyFetchToken() {
        // If adapterMethodSandbox not constructed with authService, skip token fetching
        if (!this.authService) {
            return null;
        }

        let token;
        try {
            token = await this.authService.getToken();
            if (!token) {
                throw new Error('Token undefined');
            }
        } catch (err) {
            this.pushError({
                isCatastrophic: true,
                type: CardErrorType.TokenRetrievalFailed,
                rawError: err
            });
        }
        return token;
    }

    /**
     * Wraps adapter data-fetching logic in sandbox which safely fetches an auth token and handles errors consistently.
     *
     * • Any operation that may throw in the callback passed to this method should be wrapped in additional try/catch
     * blocks which push specific error info to the sandbox.
     *
     * • Errors marked isCatastrophic will halt adapter execution.
     *
     * • Uncaught errors will be treated as catastrophic errors with unknown types and will also halt adapter execution.
     *  */
    async safelyFetchData<T extends IAdapterData>(
        fetchDataWithToken: (token?: string) => Promise<T>
    ) {
        try {
            // Fetch token
            const token = await this.safelyFetchToken();
            // Execute data fetching callback
            const data = await fetchDataWithToken(token);

            return new AdapterResult<T>({
                errorInfo: {
                    errors: this.errors,
                    catastrophicError: this.catasrophicError
                },
                result: data
            });
        } catch (err) {
            // Uncaught errors are bubbled up and caught here.
            if (!(err instanceof CardError)) {
                // Unknown error, construct new catastrophicError error
                this.catasrophicError = new CardError({
                    isCatastrophic: true,
                    rawError: err,
                    type: CardErrorType.UnknownError
                });

                this.errors.push(this.catasrophicError);
            } else if (!this.catasrophicError) {
                // Uncaught CardError thrown explicitly (not pushed to sandbox).  Attach to catastrophicError.
                this.catasrophicError = err;
            }
            // Attach errorInfo, nullify result, and return AdapterResult.
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

export default AdapterMethodSandbox;
