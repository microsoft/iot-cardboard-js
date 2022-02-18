import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import EnvironmentPicker from './EnvironmentPicker';

export default {
    title: 'Components/EnvironmentPicker'
};

export const MockEnvironmentPickerWithLocalStorage = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={{ width: 332 }}>
        <EnvironmentPicker
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            isLocalStorageEnabled={true}
            localStorageKey="adtEnvironmentUrls"
            selectedItemLocalStorageKey="selectedAdtEnvironmentUrl"
            storage={{
                isLocalStorageEnabled: true,
                localStorageKey: 'storageContainerUrls',
                selectedItemLocalStorageKey: 'selectedStorageContainerUrl'
            }}
        />
    </div>
);

export const MockEnvironmentPickerWithoutLocalStorage = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={{ width: 332 }}>
        <EnvironmentPicker
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            isLocalStorageEnabled={false}
            storage={{
                isLocalStorageEnabled: false
            }}
        />
    </div>
);

export const MockEnvironmentPickerWithEnvironmentsFromSubscription = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={{ width: 332 }}>
        <EnvironmentPicker
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            shouldPullFromSubscription
            isLocalStorageEnabled={false}
            storage={{
                isLocalStorageEnabled: false
            }}
        />
    </div>
);
