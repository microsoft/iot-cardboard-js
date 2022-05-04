import React from 'react';
import OATEditorPage from './OATEditorPage';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

export default {
    title: 'Pages/OATEditorPage',
    component: OATEditorPage,
    parameters: {
        noGlobalWrapper: true
    }
};

export const OATModelEditorPage = (args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OATEditorPage theme={theme} />
        </BaseComponent>
    );
};
