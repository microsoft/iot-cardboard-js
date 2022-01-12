import i18n from '../../i18n';
import { ComponentErrorType, IComponentError } from '../Constants';

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
        messageParams = {}
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

        Object.setPrototypeOf(this, ComponentError.prototype);
    }
}

export { CancelledPromiseError, ComponentError };
