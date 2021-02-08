import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import { useTranslation } from 'react-i18next';
import './BaseCard.scss';

const BaseCard: React.FC<BaseCardProps> = ({ isLoading, noData }) => {
    const { t } = useTranslation();

    return isLoading || noData ? (
        <div className="cb-loading-wrapper">
            <div className="cb-loading">
                {isLoading ? `${t('loading')}...` : t('noData')}
            </div>
        </div>
    ) : (
        <></>
    );
};

export default BaseCard;
