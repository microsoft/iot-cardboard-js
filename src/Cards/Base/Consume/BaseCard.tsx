import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    adapterResult,
    children,
    title,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();

    const { catastrophicError } = adapterResult?.errorInfo || {};
    const noData = adapterResult?.hasNoData();

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                <div className="cb-base-card">
                    <h3 className="cb-base-card-title">{title}</h3>
                    <div className="cb-base-card-content">
                        {catastrophicError ? (
                            <div className="cb-base-catastrophic-error-wrapper">
                                <div className="cb-base-catastrophic-error-box">
                                    <div className="cb-base-catastrophic-error-message">
                                        {catastrophicError.message}
                                    </div>
                                    <div className="cb-base-catastrophic-error-raw">
                                        {catastrophicError?.rawError?.message}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            (isLoading || noData) && (
                                <div className="cb-base-info-wrapper">
                                    <div className="cb-base-info">
                                        {isLoading ? t('loading') : t('noData')}
                                    </div>
                                </div>
                            )
                        )}
                        <>{children}</>
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCard;
