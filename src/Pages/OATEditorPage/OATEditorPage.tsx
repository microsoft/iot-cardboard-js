import React, { useState, useEffect } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import { CommandHistoryContext } from './context/CommandHistoryContext';
import useCommandHistory from './hooks/useCommandHistory';

const OATEditorPage = ({ theme }) => {
    const [elementHandler, setElementHandler] = useState([]);
    const [templatesActive, setTemplatesActive] = useState(false);
    const EditorPageStyles = getEditorPageStyles();
    const [deletedModel, setDeletedModel] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedId, setEditedId] = useState('');

    const [model, setModel] = useState(null);
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

    const providerValue = useCommandHistory([]);

    return (
        <CommandHistoryContext.Provider value={providerValue}>
            <div className={EditorPageStyles.container}>
                <OATHeader elements={elementHandler.digitalTwinsModels} />
                <div
                    className={
                        templatesActive
                            ? EditorPageStyles.componentTemplate
                            : EditorPageStyles.component
                    }
                >
                    <OATModelList
                        elements={elementHandler.digitalTwinsModels}
                        onDeleteModel={setDeletedModel}
                        onSelectedModel={setSelectedModel}
                        onEditedName={setEditedName}
                        onEditedId={setEditedId}
                    />
                    <OATGraphViewer
                        onElementsUpdate={setElementHandler}
                        model={model}
                        setModel={setModel}
                        deletedModel={deletedModel}
                        selectModel={selectedModel}
                        editedName={editedName}
                        editedId={editedId}
                    />
                    <OATPropertyEditor
                        model={model}
                        setModel={setModel}
                        templates={templates}
                        setTemplates={setTemplates}
                        theme={theme}
                        templatesActive={templatesActive}
                        setTemplatesActive={setTemplatesActive}
                    />
                </div>
            </div>
        </CommandHistoryContext.Provider>
    );
};

export default React.memo(OATEditorPage);
