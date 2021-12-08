import React from 'react';
import { BaseCompositeCardProps } from './BaseCompositeCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCompositeCard.scss';
import Overlay from '../../../../Components/Modal/Overlay';
import BaseComponent from '../../../../Components/BaseComponent/BaseComponent';

const BaseCompositeCard: React.FC<BaseCompositeCardProps> = ({
    adapterResults,
    isLoading,
    children,
    title,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterResults={adapterResults}
        >
            <div className="cb-base-composite-card-wrapper">
                <div className="cb-base-composite-card">
                    {title && (
                        <h3 className="cb-base-composite-card-title">
                            {title}
                        </h3>
                    )}
                    <div className="cb-base-composite-card-content">
                        {isLoading && <Overlay>{t('loading')}</Overlay>}
                        {!children ? (
                            <Overlay>{t('empty')}</Overlay>
                        ) : (
                            <div className="cb-base-composite-card-items">
                                {React.Children.map(
                                    children,
                                    (child) =>
                                        child && (
                                            <div className="cb-base-composite-card-item">
                                                {child}
                                            </div>
                                        )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseComponent>
    );
};

export default BaseCompositeCard;
