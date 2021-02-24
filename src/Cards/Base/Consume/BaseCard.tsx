import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    noData,
    children,
    title,
    theme
}) => {
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <div className="cb-base-card">
                <h3 className="cb-base-card-title">{title}</h3>
                <div className="cb-base-card-content">
                    {isLoading || noData ? (
                        <div className="cb-loading">
                            {isLoading ? `${t('loading')}...` : t('noData')}
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
