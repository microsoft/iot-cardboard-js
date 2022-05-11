import React, { useReducer } from 'react';
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
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const EditorPageStyles = getEditorPageStyles();

    const handleImportClick = () => {
        dispatch({
            type: SET_OAT_IS_JSON_UPLOADER_OPEN,
            payload: !state.isJsonUploaderOpen
        });
    };

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader
                elements={state.elements.digitalTwinsModels}
                onImportClick={handleImportClick}
            />
            <OATImport
                isJsonUploaderOpen={state.isJsonUploaderOpen}
                dispatch={dispatch}
            />
            <div
                className={
                    state.templatesActive
                        ? EditorPageStyles.componentTemplate
                        : EditorPageStyles.component
                }
            >
                <OATModelList
                    elements={state.elements.digitalTwinsModels}
                    dispatch={dispatch}
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
