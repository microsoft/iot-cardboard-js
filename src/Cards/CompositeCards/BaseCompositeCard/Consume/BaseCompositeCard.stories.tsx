import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseCompositeCard from './BaseCompositeCard';

export default {
    title: 'CompositeCards/BaseCompositeCard/Consume'
};

export const EmptyCompositeCard = (_args, { globals: { theme, locale } }) => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCompositeCard
                title={t('emptyCompositeCard')}
                theme={theme}
                locale={locale}
            />
        </div>
    );
};
