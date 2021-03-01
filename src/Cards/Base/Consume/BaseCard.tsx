import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    adapterResult,
    children,
    title,
    theme
}) => {
    const { t } = useTranslation();

    const hasError = adapterResult && adapterResult.error !== null;
    const noData = adapterResult && adapterResult.data === null;

    return (
        <ThemeProvider theme={theme}>
            <div className="cb-base-card">
                <h3 className="cb-base-card-title">{title}</h3>
                <div className="cb-base-card-content">
                    {isLoading || noData || hasError ? (
                        <div className="cb-loading">
                            {isLoading
                                ? t('loading')
                                : hasError
                                ? t('error')
                                : t('noData')}
                        </div>
                    ) : (
                        <>{children}</>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default BaseCard;
