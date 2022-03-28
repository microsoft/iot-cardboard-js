import React, { useState } from 'react';
import { default as OATPropertyEditorView } from './OATPropertyEditor';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditorView
};

export const Default = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState([]);

    return (
        <div>
            <OATPropertyEditorView elements={elementHandler} theme={theme} />
        </div>
    );
};
