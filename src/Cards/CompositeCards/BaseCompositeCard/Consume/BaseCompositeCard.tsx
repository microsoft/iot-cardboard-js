import React from 'react';
import { BaseCompositeCardProps } from './BaseCompositeCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCompositeCard.scss';
import { ThemeProvider } from '../../../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../../i18n';

const BaseCompositeCard: React.FC<BaseCompositeCardProps> = ({
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
                <div className="cb-base-composite-card-wrapper">
                    <div className="cb-base-composite-card">
                        <h3 className="cb-base-card-title">{title}</h3>
                        <div className="cb-base-card-content">
                            {!children ? (
                                <div className="cb-base-info-wrapper">
                                    <div className="cb-base-info">
                                        {t('empty')}
                                    </div>
                                </div>
                            ) : (
                                <div className="cb-base-composite-card-items">
                                    {React.Children.map(children, (child) => (
                                        <div className="cb-base-composite-card-item">
                                            {child}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default BaseCompositeCard;
