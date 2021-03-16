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
    locale
}) => {
    const { t } = useTranslation();

    const hasError = adapterResult?.hasError();
    const noData = adapterResult?.hasNoData();

    return (
        <I18nProviderWrapper locale={locale} i18n={i18n}>
            <ThemeProvider theme={theme}>
                <div className="cb-base-card">
                    <h3 className="cb-base-card-title">{title}</h3>
                    <div className="cb-base-card-content">
                        {(isLoading || noData || hasError) && (
                            <div className="cb-base-info-wrapper">
                                <div className="cb-base-info">
                                    {isLoading
                                        ? t('loading')
                                        : hasError
                                        ? t('error')
                                        : t('noData')}
                                </div>
                            </div>
                        )}
                        <>{children}</>
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCard;
