import i18n from '../../i18n';
import { ComponentErrorType, IComponentError } from '../Constants';
import { ErrorObject } from 'ajv';

class CancelledPromiseError extends Error {
    constructor(m = 'Promise cancelled.') {
        super(m);
        this.name = 'Promise cancelled error';

        // Set error prototype to allow for 'instanceof' CancelledPromiseError
        Object.setPrototypeOf(this, CancelledPromiseError.prototype);
    }
}

class ComponentError extends Error implements IComponentError {
    public type;
    public isCatastrophic;
    public rawError;
    public messageParams: { [key: string]: string };
    public jsonSchemaErrors?: ErrorObject[];

    private getComponentErrorNameFromType = (errorType: ComponentErrorType) => {
        switch (errorType) {
            case ComponentErrorType.TokenRetrievalFailed:
                return i18n.t('adapterErrors.tokenFailed');
            case ComponentErrorType.DataFetchFailed:
                return i18n.t('adapterErrors.dataFetchFailed');
            case ComponentErrorType.DataUploadFailed:
                return i18n.t('adapterErrors.dataUploadFailed');
            case ComponentErrorType.InvalidCardType:
                return i18n.t('boardErrors.invalidCardType');
            case ComponentErrorType.ErrorBoundary:
                return i18n.t('errors.errorBoundary');
            case ComponentErrorType.JsonSchemaError:
                return i18n.t('errors.schemaValidationFailed.type');
            case ComponentErrorType.TimeSeriesDatabaseConnectionFetchFailed:
                return i18n.t(
                    'errors.timeSeriesDatabaseConnectionFetchFailed.type'
                );
            default:
                return i18n.t('errors.unkownError');
        }
    };

    private getComponentErrorMessageFromType = (
        errorType: ComponentErrorType,
        messageParams: { [key: string]: string }
    ) => {
        switch (errorType) {
            case ComponentErrorType.InvalidCardType:
                return i18n.t(
                    'boardErrors.invalidCardTypeMessage',
                    messageParams
                );
            case ComponentErrorType.JsonSchemaError:
                return i18n.t('errors.schemaValidationFailed.message');
            case ComponentErrorType.TimeSeriesDatabaseConnectionFetchFailed:
                return i18n.t(
                    'errors.timeSeriesDatabaseConnectionFetchFailed.message'
                );
            default:
                return i18n.t('errors.unkownError');
        }
    };

    constructor({
        name,
        message,
        type = ComponentErrorType.UnknownError,
        isCatastrophic = false,
        rawError = null,
        messageParams = {},
        jsonSchemaErrors = null
    }: IComponentError) {
        super(message);
        this.name = name ? name : this.getComponentErrorNameFromType(type);
        this.message = message
            ? message
            : this.getComponentErrorMessageFromType(type, messageParams);
        this.type = type;
        this.isCatastrophic = isCatastrophic;
        this.rawError = rawError;
        this.messageParams = messageParams;
        this.jsonSchemaErrors = jsonSchemaErrors;

        Object.setPrototypeOf(this, ComponentError.prototype);
    }
}

export { CancelledPromiseError, ComponentError };
