import {
    AdapterErrorType,
    AdapterReturnType,
    IAdapterData,
    IAdapterError
} from '../Constants';
import AdapterResult from './AdapterResult';
import { AdapterError } from './Errors';

class AdapterErrorManager {
    private errors: IAdapterError[];
    private catasrophicError: IAdapterError;

    constructor(error?: IAdapterError) {
        if (error) {
            this.errors = [error];
            if (error.isCatastrophic) {
                this.catasrophicError = error;
            }
        } else {
            this.errors = [];
            this.catasrophicError = null;
        }
    }

    pushError({
        rawError = null,
        message = 'Unkown adapter error',
        type = AdapterErrorType.UnknownError,
        isCatastrophic = false
    }: IAdapterError) {
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
            if (err instanceof AdapterError) {
                // Catastrophic error of type known by adapter
                // attach error manager to result object
                return new AdapterResult<T>({
                    error: this,
                    result: null
                });
            } else {
                // Unknown catastrophic error, construct new  catasrophicError error
                // and attach error manager to result object
                this.catasrophicError = new AdapterError({
                    isCatastrophic: true,
                    rawError: err,
                    type: AdapterErrorType.UnknownError,
                    message: 'Unkown adapter error'
                });

                this.errors.push(this.catasrophicError);

                return new AdapterResult<T>({
                    error: this,
                    result: null
                });
            }
        }
    }
}

export default AdapterErrorManager;
