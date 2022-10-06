import React, { useMemo } from 'react';
import i18n from '../../i18n';
import { ErrorBoundary } from 'react-error-boundary';
import { usePrevious } from '@fluentui/react-hooks';

import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import OATConfirmDeleteModal from './Internal/OATConfirmDeleteModal';
import {
    getAvailableLanguages,
    getLastUsedProjectId
} from '../../Models/Services/OatUtils';
import { getDebugLogger } from '../../Models/Services/Utils';
import { IOATEditorPageProps } from './OATEditorPage.types';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import { OAT_NAMESPACE_DEFAULT_VALUE } from '../../Models/Constants';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATEditorPage', debugLogging);

const OATEditorPageContent: React.FC<IOATEditorPageProps> = (props) => {
    const { selectedTheme } = props;

    // hooks

    // context
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // load up the last used project on mount. If we can't find it, go to the first project in the list
    const lastProjectId = getLastUsedProjectId();
    const previousProjectIdValue = usePrevious(lastProjectId);
    if (
        oatPageState.ontologyFiles?.length > 0 &&
        lastProjectId &&
        previousProjectIdValue !== lastProjectId
    ) {
        let projectIdToUse = '';
        if (oatPageState.ontologyFiles?.some((x) => x.id === lastProjectId)) {
            projectIdToUse = lastProjectId;
        } else {
            projectIdToUse = oatPageState.ontologyFiles[0].id;
        }
        logDebugConsole(
            'debug',
            'Bootstrapping OAT context with existing project. ProjectId: ',
            projectIdToUse
        );
        oatPageDispatch({
            type: OatPageContextActionType.SWITCH_CURRENT_PROJECT,
            payload: {
                projectId: projectIdToUse
            }
        });
    } else if (!oatPageState.ontologyFiles?.length || !lastProjectId) {
        logDebugConsole(
            'debug',
            'Did not find existing project. Creating a new one'
        );
        // create a project if none exists
        oatPageDispatch({
            type: OatPageContextActionType.CREATE_PROJECT,
            payload: {
                name: i18n.t('OATCommon.defaultFileName'),
                namespace: OAT_NAMESPACE_DEFAULT_VALUE
            }
        });
    }

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
                <div
                    className={
                        oatPageState.templatesActive
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
        </>
    );
};

const OATEditorPage: React.FC<IOATEditorPageProps> = (props) => {
    return (
        <CommandHistoryContextProvider>
            <ErrorBoundary FallbackComponent={OATErrorPage}>
                <OatPageContextProvider>
                    <OATEditorPageContent {...props} />
                </OatPageContextProvider>
            </ErrorBoundary>
        </CommandHistoryContextProvider>
    );
};

export default React.memo(OATEditorPage);
