import React, { useReducer, useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../Components/JsonUploader/JsonUploader';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../Models/Constants';
import {
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN
} from '../../Models/Constants/ActionTypes';

const OATEditorPage = ({ theme }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const existingFilesRef = useRef([]);
    const jsonUploaderComponentRef = useRef();

    const EditorPageStyles = getEditorPageStyles();

    const handleImportClick = () => {
        existingFilesRef.current = [];
        dispatch({
            type: SET_OAT_IS_JSON_UPLOADER_OPEN,
            payload: !state.isJsonUploaderOpen
        });
    };

    const onFileListChanged = async (files: Array<File>) => {
        existingFilesRef.current = files;
        let items = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const newItem = {
                    name: existingFilesRef.current[i].name,
                    size: prettyBytes(existingFilesRef.current[i].size),
                    status: FileUploadStatus.Uploading
                } as IFileItem;
                try {
                    const content = await existingFilesRef.current[i].text();
                    newItem.content = JSON.parse(content);
                } catch (error) {
                    console.log(Error(error));
                }
                items = [...items, newItem.content];
            }

            dispatch({
                type: SET_OAT_IMPORT_MODELS,
                payload: items
            });

            dispatch({
                type: SET_OAT_IS_JSON_UPLOADER_OPEN,
                payload: !state.isJsonUploaderOpen
            });
        }
    };

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader
                elements={state.elementHandler.digitalTwinsModels}
                handleImportClick={handleImportClick}
            />
            {state.isJsonUploaderOpen && (
                <JsonUploader
                    onFileListChanged={onFileListChanged}
                    ref={jsonUploaderComponentRef}
                    existingFiles={existingFilesRef.current}
                />
            )}
            <div
                className={
                    state.templatesActive
                        ? EditorPageStyles.componentTemplate
                        : EditorPageStyles.component
                }
            >
                <OATModelList
                    elements={state.elementHandler.digitalTwinsModels}
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
