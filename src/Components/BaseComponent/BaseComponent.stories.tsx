import React from 'react';
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

export const NestedBaseComponent = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <BaseComponent theme={theme} locale={locale}>
            <BaseComponent>
                <div>Example contents</div>
            </BaseComponent>
        </BaseComponent>
    </div>
);
