import React, { useState, useEffect, useReducer } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';

const OATEditorPage = ({ theme }) => {
    const [elementHandler, setElementHandler] = useState([]);
    const [templatesActive, setTemplatesActive] = useState(false);
    const [deletedModel, setDeletedModel] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedId, setEditedId] = useState('');
    const EditorPageStyles = getEditorPageStyles();

    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    const [model, setModel] = useState(null);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        console.log('state on root!', state);
    }, [state]);

    return (
        <div className={EditorPageStyles.container}>
            <div
                style={{ width: '100px', height: '100px', background: 'green' }}
                onClick={() => console.log('state on root', state)}
            >
                log state
            </div>
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
                    deletedModelId={deletedModel}
                    selectedModel={selectedModel}
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
                    dispatch={dispatch}
                />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
