import React, { useState } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';

const OATEditorPage = ({ theme }) => {
    const [elementHandler, setElementHandler] = useState([]);
    const EditorPageStyles = getEditorPageStyles();

    const [model, setModel] = useState({
        '@id': 'dtmi:com:adt:model1;',
        '@type': 'Interface',
        '@context': 'dtmi:adt:context;2',
        displayName: 'model1',
        description: 'default description',
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
        <div className={EditorPageStyles.container}>
            <OATHeader elements={elementHandler} />
            <div className={EditorPageStyles.component}>
                <OATModelList />
                <OATGraphViewer onElementsUpdate={setElementHandler} />
                <OATPropertyEditor
                    model={model}
                    setModel={setModel}
                    templates={templates}
                    setTemplates={setTemplates}
                    theme={theme}
                />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
