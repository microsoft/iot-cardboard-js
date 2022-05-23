import React, { useReducer, useEffect } from 'react';
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
import { OATFilesStorageKey } from '../../Models/Constants/Constants';
import i18n from '../../i18n';

const OATEditorPage = ({ theme }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const EditorPageStyles = getEditorPageStyles();

    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: i18n.options.resources[language].translation.languageCode,
            text: i18n.options.resources[language].translation.languageName
        };
    });

    const handleImportClick = () => {
        dispatch({
            type: SET_OAT_IS_JSON_UPLOADER_OPEN,
            payload: !state.isJsonUploaderOpen
        });
    };

    useEffect(() => {
        //  Set the OATFilesStorageKey to the localStorage
        const files = JSON.parse(localStorage.getItem(OATFilesStorageKey));
        if (!files) {
            localStorage.setItem(OATFilesStorageKey, JSON.stringify([]));
        }
    }, []);

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader
                elements={state.elements.digitalTwinsModels}
                onImportClick={handleImportClick}
                state={state}
                dispatch={dispatch}
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
                    languages={languages}
                />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
