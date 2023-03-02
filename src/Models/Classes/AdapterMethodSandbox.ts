import axios from 'axios';
import {
    IComponentError,
    ComponentErrorType,
    AxiosParams,
    IAdapterData,
    IAuthService,
    ICancellablePromise,
    AuthTokenTypes
} from '../Constants';
import AdapterResult from './AdapterResult';
import { ComponentError } from './Errors';

/** Utility class which creates sandbox environment for adapter data fetching.
 *
 * • Manages errors and catasrophicErrors.
 *
 * • Safely fetches auth token and passes token to data fetching callback
 *
 * • Catches, classifies, and aggregates errors
 */
class AdapterMethodSandbox {
    private errors: IComponentError[];
    private catasrophicError: IComponentError;
    private authService: IAuthService;

    constructor(authservice?: IAuthService) {
        this.errors = [];
        this.catasrophicError = null;
        this.authService = authservice;
    }

    /**
     *  Pushes new ComponentError onto errors list.  If error is marked as catastrophic,
     *  execution will halt with catastrophic error attached to result
     */
    pushError({ rawError, message, type, isCatastrophic }: IComponentError) {
        const error = new ComponentError({
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
    private async safelyFetchToken(tokenFor?: AuthTokenTypes) {
        // If adapterMethodSandbox not constructed with authService, skip token fetching
        if (!this.authService) {
            return null;
        }

        let token = '';
        try {
            token = await this.authService.getToken(tokenFor);
            if (!token && token !== '') {
                throw new Error('Token undefined');
            }
        } catch (err) {
            this.pushError({
                isCatastrophic: true,
                type: ComponentErrorType.TokenRetrievalFailed,
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
        fetchDataWithToken: (token?: string) => Promise<T>,
        tokenFor?: AuthTokenTypes
    ) {
        try {
            // Fetch token
            const token = await this.safelyFetchToken(tokenFor);
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
            if (!(err instanceof ComponentError)) {
                // Unknown error, construct new catastrophicError error
                this.catasrophicError = new ComponentError({
                    isCatastrophic: true,
                    rawError: err,
                    type: ComponentErrorType.UnknownError
                });

                this.errors.unshift(this.catasrophicError);
            } else if (!this.catasrophicError) {
                // Uncaught ComponentError thrown explicitly (not pushed to sandbox).  Attach to catastrophicError.
                this.catasrophicError = err;
                this.errors.unshift(this.catasrophicError);
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

    safelyFetchDataCancellableAxiosPromise(
        returnDataClass: { new (data: any) },
        axiosParams: AxiosParams,
        dataTransformFunc?: (data) => any,
        tokenFor?: AuthTokenTypes
    ): ICancellablePromise<AdapterResult<any>> {
        const { headers, ...restOfParams } = axiosParams;
        const cancelTokenSource = axios.CancelToken.source();

        const cancellablePromise = this.safelyFetchData(async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    ...restOfParams,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        ...headers
                    },
                    cancelToken: cancelTokenSource.token
                });
            } catch (err) {
                if (axios.isCancel(err)) {
                    this.pushError({
                        type: ComponentErrorType.DataFetchFailed,
                        isCatastrophic: false,
                        rawError: err
                    });
                } else {
                    this.pushError({
                        type: ComponentErrorType.DataFetchFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                }
            }
            const result = axiosData?.data;
            return new returnDataClass(
                dataTransformFunc ? dataTransformFunc(result) : result
            );
        }, tokenFor) as ICancellablePromise<AdapterResult<any>>;
        cancellablePromise.cancel = cancelTokenSource.cancel;
        return cancellablePromise;
    }
}

export default AdapterMethodSandbox;
