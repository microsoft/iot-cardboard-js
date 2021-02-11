import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';

const BaseCard: React.FC<BaseCardProps> = ({ isLoading, noData, children }) => {
    const { t } = useTranslation();

    return (
        <div className="cb-base-card">
            {isLoading || noData ? (
                <div className="cb-loading">
                    {isLoading ? `${t('loading')}...` : t('noData')}
                </div>
            ) : (
                <>{children}</>
            )}
        </div>
    );
};

export default BaseCard;
