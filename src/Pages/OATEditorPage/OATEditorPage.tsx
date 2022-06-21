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
import { CommandHistoryContext } from './Internal/Context/CommandHistoryContext';
import useCommandHistory from './Internal/Hooks/useCommandHistory';
import {
    getStoredEditorData,
    storeEditorData
} from '../../Models/Services/Utils';

const OATEditorPage = ({ theme }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const { models, projectName, templates, modelPositions, namespace } = state;

    const providerValue = useCommandHistory([]);

    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: i18n.options.resources[language].translation.languageCode,
            text: i18n.options.resources[language].translation.languageName
        };
    });

    const editorPageStyles = getEditorPageStyles();

    useEffect(() => {
        //  Set the OATFilesStorageKey to the localStorage
        const files = loadFiles();
        if (!files) {
            saveFiles([]);
        }
    }, []);

    // Handle models persistence
    useEffect(() => {
        // Update oat-data storage
        const editorData = getStoredEditorData();
        const oatEditorData = {
            ...editorData,
            models,
            modelPositions: modelPositions,
            projectName,
            projectDescription: '',
            templates,
            namespace
        };

        storeEditorData(oatEditorData);
    }, [models, projectName, templates, modelPositions, namespace]);

    return (
        <CommandHistoryContext.Provider value={providerValue}>
            <ErrorBoundary FallbackComponent={OATErrorPage}>
                <div className={editorPageStyles.container}>
                    <OATHeader
                        elements={state.models}
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
                            elements={state.models}
                            dispatch={dispatch}
                            modified={state.modified}
                            state={state}
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
        </CommandHistoryContext.Provider>
    );
};

export default React.memo(OATEditorPage);
