import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';

const BaseCard: React.FC<BaseCardProps> = ({
    children,
    title,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();

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
                        {!children ? (
                            <div className="cb-base-info-wrapper">
                                <div className="cb-base-info">{t('empty')}</div>
                            </div>
                        ) : (
                            React.Children.map(children, (child) => (
                                <div className="cb-compositecard-item">
                                    {child}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCard;
