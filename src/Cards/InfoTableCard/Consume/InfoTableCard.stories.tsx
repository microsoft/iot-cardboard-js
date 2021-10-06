import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoTableCard from './InfoTableCard';

export default {
    title: 'InfoTableCard/Consume',
    component: InfoTableCard // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

export const Mock = (_args, { globals: { theme, locale } }) => (
    <InfoTableCard
        theme={theme}
        locale={locale}
        headers={['Twin Name', 'Model ID']}
        tableRows={[
            [
                'sub_wind_gen',
                'dtmi:example:grid:transmission:generatorSubStation;1'
            ]
        ]}
    />
);

export const MockTwinEdit = (_args, { globals: { theme, locale } }) => {
    const { t } = useTranslation();
    return (
        <InfoTableCard
            theme={theme}
            locale={locale}
            headers={['Twin Name', 'Model ID']}
            tableRows={[['LeoTheDog', 'dtmi:com:cocrowle:teslamodely;1']]}
            infoTableActionButtonProps={{
                label: t('editTwin'),
                onClick: () => console.log('edit twin clicked')
            }}
        />
    );
};
