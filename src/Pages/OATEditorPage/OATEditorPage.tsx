import React, { useMemo } from 'react';
import i18n from '../../i18n';
import { ErrorBoundary } from 'react-error-boundary';

import OATHeader from '../../Components/OATHeader/OATHeader';
import OATGraphViewerContent from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import OATConfirmDeleteModal from './Internal/OATConfirmDeleteModal';
import { getAvailableLanguages } from '../../Models/Services/OatUtils';
import { getDebugLogger } from '../../Models/Services/Utils';
import { IOATEditorPageProps } from './OATEditorPage.types';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { Stack } from '@fluentui/react';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATEditorPage', debugLogging);

const OATEditorPageContent: React.FC<IOATEditorPageProps> = (props) => {
    const { selectedTheme } = props;

    // hooks

    // context

    // data
    const languages = useMemo(() => {
        const languages = getAvailableLanguages(i18n);
        logDebugConsole(
            'debug',
            `Generating language keys. Found ${languages?.length} languages. {languages}`,
            languages
        );
        return languages;
    }, []);

    // styles
    const editorPageStyles = getEditorPageStyles();

    return (
        <>
            <div className={editorPageStyles.container}>
                <OATHeader />
                <Stack horizontal className={editorPageStyles.component}>
                    <div className={editorPageStyles.viewerContainer}>
                        <OATGraphViewerContent />
                    </div>
                    <div className={editorPageStyles.propertyEditorContainer}>
                        <OATPropertyEditor
                            theme={selectedTheme}
                            languages={languages}
                        />
                    </div>
                </Stack>
            </div>
            <OATErrorHandlingModal />
            <OATConfirmDeleteModal />
        </>
    );
};

const OATEditorPage: React.FC<IOATEditorPageProps> = (props) => {
    return (
        <ErrorBoundary FallbackComponent={OATErrorPage}>
            <OatPageContextProvider disableLocalStorage={props.disableStorage}>
                <CommandHistoryContextProvider>
                    <OATEditorPageContent {...props} />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </ErrorBoundary>
    );
};

export default React.memo(OATEditorPage);
