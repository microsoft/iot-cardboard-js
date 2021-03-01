import React from 'react';
import BaseCard from './BaseCard';

export default {
    title: 'BaseCard/Consume'
};

export const BasicCard = (args, { globals: { theme } }) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard
            isLoading={false}
            theme={theme}
            adapterResult={{ data: null, error: null }}
        />
    </div>
);
