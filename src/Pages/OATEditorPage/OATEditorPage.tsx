import React, { useReducer, useEffect, useMemo } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import { ErrorBoundary } from 'react-error-boundary';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import i18n from '../../i18n';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import OATConfirmDeleteModal from './Internal/OATConfirmDeleteModal';
import {
    convertDtdlInterfacesToModels,
    getStoredEditorData,
    loadOatFiles,
    saveOatFiles,
    storeEditorData
} from '../../Models/Services/OatUtils';
import { ProjectData } from './Internal/Classes/ProjectData';
import { getDebugLogger } from '../../Models/Services/Utils';
import { IOATEditorPageProps } from './OATEditorPage.types';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATEditorPage', debugLogging);

const OATEditorPage: React.FC<IOATEditorPageProps> = ({ selectedTheme }) => {
    const [oatState, oatDispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const {
        models,
        projectName,
        templates,
        modelPositions,
        namespace,
        modelsMetadata
    } = oatState;

    const languages = useMemo(() => {
        const languages = Object.keys(i18n.options.resources).map(
            (language) => {
                return {
                    key: (i18n.options.resources[language].translation as any)
                        .languageCode,
                    text: (i18n.options.resources[language].translation as any)
                        .languageName
                };
            }
        );
        logDebugConsole(
            'debug',
            `Generating language keys. Found ${languages.length} languages. {languages}`,
            languages
        );
        return languages;
    }, []);

    const editorPageStyles = getEditorPageStyles();

    useEffect(() => {
        //  Set the OATFilesStorageKey to the localStorage if key doesn't exist
        const files = loadOatFiles();
        if (!files?.length) {
            saveOatFiles([]);
        }
    }, []);

    // Handle models persistence
    useEffect(() => {
        // Update oat-data storage
        const editorData = getStoredEditorData();
        const oatEditorData: ProjectData = {
            ...editorData,
            models: convertDtdlInterfacesToModels(models),
            modelPositions,
            modelsMetadata,
            projectName,
            projectDescription: '',
            templates,
            namespace
        };
        storeEditorData(oatEditorData);
    }, [
        models,
        projectName,
        templates,
        modelPositions,
        namespace,
        modelsMetadata
    ]);

    return (
        <CommandHistoryContextProvider>
            <ErrorBoundary FallbackComponent={OATErrorPage}>
                <OatPageContextProvider>
                    <div className={editorPageStyles.container}>
                        <OATHeader />
                        <div
                            className={
                                oatState.templatesActive
                                    ? editorPageStyles.componentTemplate
                                    : editorPageStyles.component
                            }
                        >
                            <OATModelList />
                            <OATGraphViewer />
                            <OATPropertyEditor
                                theme={selectedTheme}
                                languages={languages}
                            />
                        </div>
                    </div>
                    <OATErrorHandlingModal />
                    <OATConfirmDeleteModal />
                </OatPageContextProvider>
            </ErrorBoundary>
        </CommandHistoryContextProvider>
    );
};

export default React.memo(OATEditorPage);
