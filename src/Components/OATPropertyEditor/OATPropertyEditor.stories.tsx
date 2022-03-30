import React from 'react';
import { default as OATPropertyEditorView } from './OATPropertyEditor';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditorView
};

export const Default = (_args) => {

    return (
        <div>
            <OATPropertyEditorView/>
        </div>
    );
};
