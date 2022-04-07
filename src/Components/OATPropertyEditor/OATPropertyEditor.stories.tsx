import React, { useState } from 'react';
import OATPropertyEditor from './OATPropertyEditor';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = () => {
    const [model, setModel] = useState({
        '@id': 'dtmi:com:adt:model1;',
        '@type': 'Interface',
        '@context': 'dtmi:adt:context;2',
        displayName: 'model1',
        contents: [
            {
                '@id': 'dtmi:com:adt:model1:prop_0',
                '@type': ['Property'],
                name: 'prop_0',
                schema: 'string',
                writable: true,
                comment: 'default comment',
                description: 'default description',
                unit: 'default unit'
            }
        ]
    });
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);

    return (
        <div>
            <OATPropertyEditor
                model={model}
                setModel={setModel}
                currentPropertyIndex={currentPropertyIndex}
                setCurrentPropertyIndex={setCurrentPropertyIndex}
            />
        </div>
    );
};
