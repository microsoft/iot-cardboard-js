import React, { useReducer, useEffect } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import { ErrorBoundary } from 'react-error-boundary';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';
import OATErrorHandlingWrapper from './Internal/OATErrorHandlingWrapper';
import i18n from '../../i18n';
import {
    loadFiles,
    saveFiles
} from '../../Components/OATHeader/internal/Utils';
import OATErrorPage from './Internal/OATErrorPage';

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
    const editorPageStyles = getEditorPageStyles();

    useEffect(() => {
        //  Set the OATFilesStorageKey to the localStorage
        const files = loadFiles();
        if (!files) {
            saveFiles([]);
        }
    }, []);

    return (
        <ErrorBoundary FallbackComponent={OATErrorPage}>
            <div className={editorPageStyles.container}>
                <OATHeader
                    elements={state.elements.digitalTwinsModels}
                    dispatch={dispatch}
                    state={state}
                />
                <div
                    className={
                        state.templatesActive
                            ? editorPageStyles.componentTemplate
                            : editorPageStyles.component
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
            <OATErrorHandlingWrapper state={state} dispatch={dispatch} />
        </ErrorBoundary>
    );
};

export default React.memo(OATEditorPage);
