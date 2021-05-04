import axios from 'axios';
import {
    AdapterErrorType,
    AxiosParams,
    IAdapterData,
    IAdapterError,
    IAuthService,
    ICancellablePromise
} from '../Constants';
import AdapterResult from './AdapterResult';
import { AdapterError } from './Errors';

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
    private errors: IAdapterError[];
    private catasrophicError: IAdapterError;
    private authService: IAuthService;

    constructor({ authservice }: IAdapterMethodSandbox) {
        this.errors = [];
        this.catasrophicError = null;
        this.authService = authservice;
    }

    /**
     *  Pushes new AdapterError onto errors list.  If error is marked as catastrophic,
     *  execution will halt with catastrophic error attached to result
     */
    pushError({ rawError, message, type, isCatastrophic }: IAdapterError) {
        const error = new AdapterError({
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
                type: AdapterErrorType.TokenRetrievalFailed,
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
            if (!(err instanceof AdapterError)) {
                // Unknown error, construct new catastrophicError error
                this.catasrophicError = new AdapterError({
                    isCatastrophic: true,
                    rawError: err,
                    type: AdapterErrorType.UnknownError
                });

                this.errors.push(this.catasrophicError);
            } else if (!this.catasrophicError) {
                // Uncaught AdapterError thrown explicitly (not pushed to sandbox).  Attach to catasrophicError.
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

    safelyFetchDataCancellableAxiosPromise(
        returnDataClass: { new (data: any) },
        axiosParams: AxiosParams,
        dataTransformFunc?: (data) => any
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
                        type: AdapterErrorType.DataFetchFailed,
                        isCatastrophic: false,
                        rawError: err
                    });
                } else {
                    this.pushError({
                        type: AdapterErrorType.DataFetchFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                }
            }
            const result = axiosData?.data;
            return new returnDataClass(
                dataTransformFunc ? dataTransformFunc(result) : result
            );
        }) as ICancellablePromise<AdapterResult<any>>;
        cancellablePromise.cancel = cancelTokenSource.cancel;
        return cancellablePromise;
    }
}

export default AdapterMethodSandbox;
