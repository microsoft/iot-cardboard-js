import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import './BaseCard.scss';

const BaseCard: React.FC<BaseCardProps> = ({ isLoading, noData, children }) => {
    return <div className='base-card'>
        {(isLoading || noData) ? (
            <div className="loading">
                <div>{isLoading ? 'Loading...' : 'No Data'}</div>
            </div>
        ) : <>{children}</>}
    </div>
};

export default BaseCard;
