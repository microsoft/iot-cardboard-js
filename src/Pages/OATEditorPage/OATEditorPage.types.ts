import { IOATNodePosition, Locale, Theme } from '../../Models/Constants';
import {
    DtdlInterface,
    DtdlProperty
} from '../../Models/Constants/dtdlInterfaces';

export interface IOATEditorPageProps {
    disableStorage?: boolean;
    locale: Locale;
    localeStrings?: Record<string, any>;
    selectedThemeName: Theme;
}

export interface IOATError {
    callback?: () => void;
    message?: string;
    title?: string;
    type?: string;
}

export interface IOATConfirmDialogProps {
    /** callback to fire onConfirm */
    callback?: () => void;
    /** message body to show in the dialog */
    message?: string;
    /** whether the dialog is open */
    open: boolean;
    /** title for the dialog */
    title?: string;
    /** button text for the primary action */
    primaryButtonText?: string;
}

export interface IOATModelPosition {
    '@id': string;
    position: IOATNodePosition;
}
export interface IOATModelsMetadata {
    '@id': string;
    fileName?: string;
    directoryPath?: string;
}

export interface IOATSelection {
    modelId: string;
    contentId?: string;
}

export interface IOATEditorState {
    selection?: IOATSelection;
    models?: DtdlInterface[];
    templatesActive?: boolean;
    importModels?: [];
    isJsonUploaderOpen?: boolean;
    templates?: DtdlProperty[];
    projectName?: string;
    modified?: boolean;
    error?: IOATError;
    modelPositions: IOATModelPosition[];
    namespace?: string;
    confirmDeleteOpen?: IOATConfirmDialogProps;
    modelsMetadata?: IOATModelsMetadata[];
}
