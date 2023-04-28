import React, { useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import OATHeader from '../../Components/OATHeader/OATHeader';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.styles';
import OATErrorHandlingModal from './Internal/OATErrorHandlingModal';
import OATErrorPage from './Internal/OATErrorPage';
import { CommandHistoryContextProvider } from './Internal/Context/CommandHistoryContext';
import { IOATEditorPageProps } from './OATEditorPage.types';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { getTargetFromSelection } from '../../Components/OATPropertyEditor/Utils';
import { isDTDLReference } from '../../Models/Services/DtdlUtils';
import OATImportProgressDialog from '../../Components/OATImportProgressDialog/OATImportProgressDialog';
import useTelemetry from '../../Models/Hooks/useTelemetry';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents
} from '../../Models/Constants/OatTelemetryConstants';
import { TelemetryTrigger } from '../../Models/Constants/TelemetryConstants';
import { getOatGlobalMetrics } from '../../Models/Services/OatTelemetryUtils';

const OATEditorPageContent: React.FC<IOATEditorPageProps> = (props) => {
    const { locale, localeStrings, selectedThemeName } = props;
    const isMounted = useRef(false);

    // contexts
    const { oatPageState } = useOatPageContext();

    // hooks
    const { sendEventTelemetry } = useTelemetry();
    useEffect(() => {
        try {
            if (!isMounted.current) {
                isMounted.current = true;
                sendEventTelemetry({
                    name: TelemetryEvents.init,
                    triggerType: TelemetryTrigger.SystemAction,
                    appRegion: AppRegion.OAT,
                    componentName: ComponentName.OAT,
                    customProperties: getOatGlobalMetrics(
                        oatPageState.ontologyFiles
                    )
                });
            }
        } catch (e) {
            console.warn('OAT telemetry error', e);
        }
    }, [oatPageState.ontologyFiles, sendEventTelemetry]);

    // data
    const selectedItem = useMemo(() => {
        return (
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            )
        );
    }, [oatPageState.currentOntologyModels, oatPageState.selection]);
    const isPropertyEditorVisible =
        oatPageState.currentOntologyModels?.length !== 0;

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
                        <OATGraphViewer />
                    </div>
                    {isPropertyEditorVisible && (
                        <div
                            className={editorPageStyles.propertyEditorContainer}
                        >
                            <OATPropertyEditor
                                selectedItem={selectedItem}
                                selectedThemeName={selectedThemeName}
                                parentModelId={
                                    isDTDLReference(selectedItem)
                                        ? oatPageState.selection.modelId
                                        : undefined
                                }
                            />
                        </div>
                    )}
                </div>
                <OATImportProgressDialog />
                <OATErrorHandlingModal />
            </BaseComponent>
        </>
    );
};

const OatEditorPage: React.FC<IOATEditorPageProps> = (props) => {
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

export default React.memo(OatEditorPage);
