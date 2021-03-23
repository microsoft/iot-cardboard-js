import React from 'react';
import BaseCard from './BaseCompositeCard';

export default {
    title: 'CompositeCards/BaseCompositeCard/Consume'
};

export const BaseCompositeCard = (args, { globals: { theme, locale } }) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard title="Empty Composite Card" theme={theme} locale={locale} />
    </div>
);
