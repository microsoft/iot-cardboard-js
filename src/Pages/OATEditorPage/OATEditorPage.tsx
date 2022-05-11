<<<<<<< HEAD
import React, { useReducer } from 'react';
=======
import React, { useState, useRef } from 'react';
>>>>>>> origin/zarmada/oat-development
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import OATImport from './Internal/OATImport';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';
import { SET_OAT_IS_JSON_UPLOADER_OPEN } from '../../Models/Constants/ActionTypes';

const OATEditorPage = ({ theme }) => {
<<<<<<< HEAD
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const EditorPageStyles = getEditorPageStyles();
=======
    const [elements, setElements] = useState([]);
    const [importModels, setImportModels] = useState([]);
    const [templatesActive, setTemplatesActive] = useState(false);
    const EditorPageStyles = getEditorPageStyles();
    const [deletedModel, setDeletedModel] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedId, setEditedId] = useState('');
    const [isJsonUploaderOpen, setIsJsonUploaderOpen] = useState(false);
>>>>>>> origin/zarmada/oat-development

    const handleImportClick = () => {
        dispatch({
            type: SET_OAT_IS_JSON_UPLOADER_OPEN,
            payload: !state.isJsonUploaderOpen
        });
    };

    const handleImportClick = () => {
        setIsJsonUploaderOpen((prev) => !prev);
    };

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader
<<<<<<< HEAD
                elements={state.elements.digitalTwinsModels}
                onImportClick={handleImportClick}
            />
            <OATImport
                isJsonUploaderOpen={state.isJsonUploaderOpen}
                dispatch={dispatch}
=======
                elements={elements.digitalTwinsModels}
                onImportClick={handleImportClick}
            />
            <OATImport
                isJsonUploaderOpen={isJsonUploaderOpen}
                setIsJsonUploaderOpen={setIsJsonUploaderOpen}
                setImportModels={setImportModels}
>>>>>>> origin/zarmada/oat-development
            />
            <div
                className={
                    state.templatesActive
                        ? EditorPageStyles.componentTemplate
                        : EditorPageStyles.component
                }
            >
                <OATModelList
<<<<<<< HEAD
                    elements={state.elements.digitalTwinsModels}
                    dispatch={dispatch}
=======
                    elements={elements.digitalTwinsModels}
                    onDeleteModel={setDeletedModel}
                    onSelectedModel={setSelectedModel}
                    onEditedName={setEditedName}
                    onEditedId={setEditedId}
                />
                <OATGraphViewer
                    onElementsUpdate={setElements}
                    importModels={importModels}
                    model={model}
                    setModel={setModel}
                    deletedModel={deletedModel}
                    selectModel={selectedModel}
                    editedName={editedName}
                    editedId={editedId}
>>>>>>> origin/zarmada/oat-development
                />
                <OATGraphViewer state={state} dispatch={dispatch} />
                <OATPropertyEditor
                    theme={theme}
                    state={state}
                    dispatch={dispatch}
                />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
