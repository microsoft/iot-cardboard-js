import React from 'react';
import OATEditorPage from './OATEditorPage';

export default {
    title: 'Pages/OATEditorPage',
    component: OATEditorPage,
    parameters: {
        noGlobalWrapper: true
    }
};

export const OATModelEditorPage = (_args, { globals: { theme } }) => {
    return (
        <div>
            <OATEditorPage theme={theme} />
        </div>
    );
};
