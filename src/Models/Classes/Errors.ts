import i18n from '../../i18n';
import { CardErrorType, ICardError } from '../Constants';

class CancelledPromiseError extends Error {
    constructor(m = 'Promise cancelled.') {
        super(m);
        this.name = 'Promise cancelled error';

        // Set error prototype to allow for 'instanceof' CancelledPromiseError
        Object.setPrototypeOf(this, CancelledPromiseError.prototype);
    }
}

class CardError extends Error {
    public type;
    public isCatastrophic;
    public rawError;
    public messageParams: { [key: string]: string };

    private getCardErrorNameFromType = (errorType: CardErrorType) => {
        switch (errorType) {
            case CardErrorType.TokenRetrievalFailed:
                return i18n.t('adapterErrors.tokenFailed');
            case CardErrorType.DataFetchFailed:
                return i18n.t('adapterErrors.dataFetchFailed');
            case CardErrorType.InvalidCardType:
                return i18n.t('boardErrors.invalidCardType');
            case CardErrorType.ErrorBoundary:
                return i18n.t('errors.errorBoundary');
            default:
                return i18n.t('errors.unkownError');
        }
    };

    private getCardErrorMessageFromType = (
        errorType: CardErrorType,
        messageParams: { [key: string]: string }
    ) => {
        switch (errorType) {
            case CardErrorType.InvalidCardType:
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
        type = CardErrorType.UnknownError,
        isCatastrophic = false,
        rawError = null,
        messageParams = {}
    }: ICardError) {
        super(message);
        this.name = name ? name : this.getCardErrorNameFromType(type);
        this.message = message
            ? message
            : this.getCardErrorMessageFromType(type, messageParams);
        this.type = type;
        this.isCatastrophic = isCatastrophic;
        this.rawError = rawError;
        this.messageParams = messageParams;

        Object.setPrototypeOf(this, CardError.prototype);
    }
}

export { CancelledPromiseError, CardError };
