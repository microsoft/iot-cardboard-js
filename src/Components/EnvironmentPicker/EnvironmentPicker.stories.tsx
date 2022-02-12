import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import EnvironmentPicker from './EnvironmentPicker';

export default {
    title: 'Components/EnvironmentPicker'
};

export const MockEnvironmentPicker = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={{ width: 300, height: 400 }}>
        <EnvironmentPicker
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            isLocalStorageEnabled={false}
        />
    </div>
);
