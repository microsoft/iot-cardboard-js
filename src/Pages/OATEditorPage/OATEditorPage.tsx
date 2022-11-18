import React, { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import OATHeader from '../../Components/OATHeader/OATHeader';
import OATGraphViewerContent from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import OATConfirmDeleteModal from './Internal/OATConfirmDeleteModal';
import { IOATEditorPageProps } from './OATEditorPage.types';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { getTargetFromSelection } from '../../Components/OATPropertyEditor/Utils';

const OATEditorPageContent: React.FC<IOATEditorPageProps> = (props) => {
    const { locale, localeStrings, selectedThemeName } = props;

    // hooks

    // contexts
    const { oatPageState } = useOatPageContext();

    // data
    const selectedItem = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );

    // styles
    const editorPageStyles = getEditorPageStyles();

    return (
        <>
            <BaseComponent
                theme={selectedThemeName}
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
                    {selectedItem && (
                        <div
                            className={editorPageStyles.propertyEditorContainer}
                        >
                            <OATPropertyEditor
                                selectedItem={selectedItem}
                                selectedThemeName={selectedThemeName}
                            />
                        </div>
                    )}
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
