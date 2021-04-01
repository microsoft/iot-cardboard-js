import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseCard from './BaseCompositeCard';

export default {
    title: 'CompositeCards/BaseCompositeCard/Consume'
};

export const BaseCompositeCard = (args, { globals: { theme, locale } }) => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                title={t('emptyCompositeCard')}
                theme={theme}
                locale={locale}
            />
        </div>
    );
};
