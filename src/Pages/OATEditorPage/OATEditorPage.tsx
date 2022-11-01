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
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATEditorPage', debugLogging);

const OATEditorPageContent: React.FC<IOATEditorPageProps> = (props) => {
    const { locale, localeStrings, theme } = props;

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
            <BaseComponent
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                containerClassName={editorPageStyles.container}
                disableDefaultStyles={true}
            >
                <OATHeader />
                <div className={editorPageStyles.component}>
                    <div className={editorPageStyles.viewerContainer}>
                        <OATGraphViewerContent />
                    </div>
                    <div className={editorPageStyles.propertyEditorContainer}>
                        <OATPropertyEditor
                            theme={theme}
                            languages={languages}
                        />
                    </div>
                </div>
                <OATErrorHandlingModal />
                <OATConfirmDeleteModal />
            </BaseComponent>
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
