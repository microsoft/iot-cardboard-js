import React, { useEffect, useState } from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';
import { default as ErrorComponent } from '../../../Components/Error/Error';
import Overlay from '../../../Components/Modal/Overlay';
import { useErrorBoundaryContext } from '../../../Models/Context/ErrorBoundary/ErrorBoundary';
import { CardError } from '../../../Models/Classes/Errors';
import { CardErrorType } from '../../../Models/Constants/Enums';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    adapterResult,
    children,
    title,
    theme,
    locale,
    localeStrings,
    cardError,
    hideInfoBox
}) => {
    const { t } = useTranslation();
    const [error, errorInfo, setErrorIsHandled] = useErrorBoundaryContext();
    const [cardErrorState, setCardErrorState] = useState(cardError);

    const catastrophicError = adapterResult?.getCatastrophicError();
    const noData = adapterResult?.hasNoData();

    const showCatastrophicError = !!catastrophicError;
    const showErrorMessage = cardErrorState && !catastrophicError;
    const showLoading =
        !catastrophicError &&
        !hideInfoBox &&
        !cardErrorState &&
        (isLoading || noData);

    useEffect(() => {
        if (error) {
            debugger;
            const newCardError = new CardError({
                isCatastrophic: true,
                type: CardErrorType.ErrorBoundary,
                name: error.name,
                message: error.message,
                rawError: new Error(errorInfo.componentStack)
            });
            setCardErrorState(newCardError);
            setErrorIsHandled(true);
        } else {
            setErrorIsHandled(false);
        }
    }, [error]);

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                <div className="cb-base-card">
                    {title && <h3 className="cb-base-card-title">{title}</h3>}
                    <div className="cb-base-card-content">
                        {showCatastrophicError && (
                            <ErrorComponent
                                errorTitle={catastrophicError.message}
                                errorContent={
                                    catastrophicError?.rawError?.message
                                }
                            />
                        )}
                        {showErrorMessage && (
                            <ErrorComponent
                                errorTitle={cardErrorState.name}
                                errorContent={
                                    cardErrorState.message
                                        ? cardErrorState.message
                                        : cardErrorState.rawError?.toString()
                                }
                            />
                        )}
                        {showLoading && (
                            <Overlay>
                                {isLoading ? t('loading') : t('noData')}
                            </Overlay>
                        )}
                        <>{children}</>
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCard;
