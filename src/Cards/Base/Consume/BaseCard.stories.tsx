import React from 'react';
import AdapterResult from '../../../Models/Classes/AdapterResult';
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
            adapterResult={
                new AdapterResult({
                    result: null,
                    error: null
                })
            }
        />
    </div>
);
