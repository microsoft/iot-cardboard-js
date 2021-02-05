import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import './BaseCard.scss';

const BaseCard: React.FC<BaseCardProps> = ({ isLoading, noData }) => {
    return isLoading || noData ? (
        <div className="loading">
            <div>{isLoading ? 'Loading...' : 'No Data'}</div>
        </div>
    ) : (
        <></>
    );
};

export default BaseCard;
