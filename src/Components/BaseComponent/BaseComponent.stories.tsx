import React from 'react';
import AdapterResult from '../../Models/Classes/AdapterResult';
import { ComponentError } from '../../Models/Classes/Errors';
import BaseComponent from './BaseComponent';

export default {
    title: 'Components/Base Component'
};

export const NoData = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent theme={theme} locale={locale} isDataEmpty={true}>
            <div>Example contents</div>
        </BaseComponent>
    </div>
);

export const Loading = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent theme={theme} locale={locale} isLoading={true}>
            <div>Example contents</div>
        </BaseComponent>
    </div>
);

export const HardWiredComponentError = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent
            theme={theme}
            locale={locale}
            componentError={
                new ComponentError({
                    isCatastrophic: true,
                    message: 'This is a test hard wired error',
                    rawError: new Error('This is a test error'),
                    name: 'Test error'
                })
            }
        >
            <div>Example contents</div>
        </BaseComponent>
    </div>
);

export const CatastrophicAdapterError = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent
            theme={theme}
            locale={locale}
            adapterResults={[
                new AdapterResult({
                    errorInfo: {
                        catastrophicError: new ComponentError({
                            isCatastrophic: true,
                            message:
                                'This is catastrophic adapter result error',
                            rawError: new Error('This is a test error'),
                            name: 'Test error'
                        }),
                        errors: []
                    },
                    result: null
                })
            ]}
        >
            <div>Example contents</div>
        </BaseComponent>
    </div>
);

export const NestedBaseComponent = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent theme={theme} locale={locale}>
            <div style={{ padding: 20, color: 'red' }}>
                Top level BaseComponent
                <BaseComponent>
                    <div style={{ padding: 20, color: 'blue' }}>
                        Nested BaseComponent
                    </div>
                </BaseComponent>
            </div>
        </BaseComponent>
    </div>
);
