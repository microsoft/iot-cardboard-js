import React from 'react';
import BaseCard from './BaseCard';

export default {
    title: 'CompositeCards/BaseCard/Consume'
};

export const BasicCard = (args, { globals: { theme, locale } }) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard title="Empty Composite Card" theme={theme} locale={locale} />
    </div>
);
