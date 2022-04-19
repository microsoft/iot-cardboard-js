import React, { useState } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import { DTDLModel } from '../../Models/Classes/DTDL';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme } }) => {
    const [model, setModel] = useState({
        '@id': 'dtmi:com:adt:model1;',
        '@type': 'Interface',
        '@context': 'dtmi:adt:context;2',
        displayName: 'model1',
        description: '',
        comment: '',
        relationships: null,
        components: null,
        trimmedCopy: null,
        properties: [],
        contents: [
            {
                '@id': 'dtmi:com:adt:model1:New_Property_1',
                '@type': ['Property'],
                name: 'New_Property_1',
                schema: 'string',
                writable: true,
                comment: 'default comment',
                description: 'default description',
                unit: 'default unit'
            }
        ]
    });
    const [templates, setTemplates] = useState([
        {
            '@id': 'dtmi:com:adt:model1:prop_template_0',
            '@type': ['Property'],
            name: 'prop_template_0',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        },
        {
            '@id': 'dtmi:com:adt:model1:prop_template_1',
            '@type': ['Property'],
            name: 'prop_template_1',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        }
    ]);

    return (
        <div>
            <OATPropertyEditor
                model={model}
                setModel={setModel}
                theme={theme}
                templates={templates}
                setTemplates={setTemplates}
            />
        </div>
    );
};
