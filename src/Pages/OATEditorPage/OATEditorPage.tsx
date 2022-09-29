import React, { useEffect, useMemo } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import { ErrorBoundary } from 'react-error-boundary';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import i18n from '../../i18n';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import OATConfirmDeleteModal from './Internal/OATConfirmDeleteModal';
import {
    getAvailableLanguages,
    getOntologiesFromStorage,
    saveOntologiesToStorage
} from '../../Models/Services/OatUtils';
import { getDebugLogger } from '../../Models/Services/Utils';
import { IOATEditorPageProps } from './OATEditorPage.types';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATEditorPage', debugLogging);

const OATEditorPage: React.FC<IOATEditorPageProps> = ({ selectedTheme }) => {
    const languages = useMemo(() => {
        const languages = getAvailableLanguages(i18n);
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
        const files = getOntologiesFromStorage();
        if (!files?.length) {
            saveOntologiesToStorage([]);
        }
    }, []);

    const isTemplatesOpen = false;
    return (
        <CommandHistoryContextProvider>
            <ErrorBoundary FallbackComponent={OATErrorPage}>
                <OatPageContextProvider>
                    <div className={editorPageStyles.container}>
                        <OATHeader />
                        <div
                            className={
                                isTemplatesOpen // oatState.templatesActive
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
