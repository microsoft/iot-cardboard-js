import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';
import Error from '../../../Components/Error/Error';
import Modal from '../../../Components/Modal/Modal';

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

    const catastrophicError = adapterResult?.getCatastrophicError();
    const noData = adapterResult?.hasNoData();

    const showCatastrophicError = !!catastrophicError;
    const showErrorMessage = cardError && !catastrophicError;
    const showLoading =
        !catastrophicError &&
        !hideInfoBox &&
        !cardError &&
        (isLoading || noData);

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
                            <Error
                                errorTitle={catastrophicError.message}
                                errorContent={
                                    catastrophicError?.rawError?.message
                                }
                            />
                        )}
                        {showErrorMessage && (
                            <Error errorTitle={cardError.message} />
                        )}
                        {showLoading && (
                            <Modal>
                                {isLoading ? t('loading') : t('noData')}
                            </Modal>
                        )}
                        <>{children}</>
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCard;
