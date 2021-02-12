import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    noData,
    children,
    title
}) => {
    const { t } = useTranslation();

    return (
        <div className="cb-base-card">
            <div className="cb-base-card-title">{title}</div>
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
    );
};

export default BaseCard;
