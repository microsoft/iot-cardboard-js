import React from 'react';
import BaseCard from './BaseCard';

export default {
    title: 'BaseCard/Consume'
};

export const BasicCard = () => (
    <div
        style={{
            height: '400px',
            border: '1px solid grey',
            position: 'relative'
        }}
    >
        <BaseCard noData={true} isLoading={false} />
    </div>
);
