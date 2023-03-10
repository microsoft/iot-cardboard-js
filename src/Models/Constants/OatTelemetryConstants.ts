import { OatPageContextActionType } from '../Context/OatPageContext/OatPageContext.types';

/** Common metrics interface */
export interface OatGlobalMetrics extends OatMetrics {
    projectCount: number;
}

export interface OatMetrics {
    modelCount: number;
    v2ModelCount: number;
    v3ModelCount: number;
    relationshipCount: number;
    inheritanceCount: number;
    componentCount: number;
    propertyCount: number;
}

/** Highest level sections of the app */
export enum AppRegion {
    OAT = 'OAT'
}

/**
 * The high level component emitting the event
 * Keep it at the general level, no need to get overly specific.
 * Ex: OAT
 */
export enum ComponentName {
    OAT = 'OAT'
}

const BASE_PATH = 'OAT';

export const TelemetryEvents = {
    // Initialize
    init: `${BASE_PATH}.Initialize`,
    // Import
    importFailLimit: `${BASE_PATH}.Import.Failure.LimitExceeded`,
    importFailException: `${BASE_PATH}.Import.Failure.UnhandledException`,
    importSuccess: `${BASE_PATH}.Import.Success`,
    // Export
    exportFail: `${BASE_PATH}.Export.Success`,
    exportSuccess: `${BASE_PATH}.Export.Failure`,
    // Command history
    redo: `${BASE_PATH}.Redo.Clicked`,
    undo: `${BASE_PATH}.Undo.Clicked`,
    // Upgrade version
    upgradeVersion: `${BASE_PATH}.ModelVersion.Upgrade`,
    // Modal path change
    modalChangePath: `${BASE_PATH}.ModalPath.Update`,
    // Dtdl JSON edit
    dtdlJsonSuccess: `${BASE_PATH}.DtdlUpdate.Success`,
    dtdlJsonCancelled: `${BASE_PATH}.DtdlUpdate.Cancelled`,
    dtdlJsonUndo: `${BASE_PATH}.DtdlUpdate.Undo`,
    // Search
    modelSearch: `${BASE_PATH}.ModelSearch`,
    // Auto layout
    autoLayout: `${BASE_PATH}.AutoLayout.Clicked`,
    // Property addition
    propertyModelAddSuccess: `${BASE_PATH}.ModelProperty.Add`,
    propertyModelAddUndo: `${BASE_PATH}.ModelProperty.Undo`,
    propertyReferenceAddSuccess: `${BASE_PATH}.ReferenceProperty.Add`,
    propertyReferenceAddUndo: `${BASE_PATH}.ReferenceProperty.Undo`
};

export const OatIncludedEvents = [
    OatPageContextActionType.CREATE_PROJECT,
    OatPageContextActionType.EDIT_PROJECT,
    OatPageContextActionType.DUPLICATE_PROJECT,
    OatPageContextActionType.SWITCH_CURRENT_PROJECT,
    OatPageContextActionType.DELETE_MODEL,
    OatPageContextActionType.DELETE_REFERENCE,
    OatPageContextActionType.SET_CURRENT_NAMESPACE,
    OatPageContextActionType.SET_CURRENT_PROJECT_NAME,
    OatPageContextActionType.UPDATE_MODEL_ID,
    OatPageContextActionType.ADD_NEW_MODEL,
    OatPageContextActionType.ADD_NEW_RELATIONSHIP,
    OatPageContextActionType.ADD_NEW_MODEL_WITH_RELATIONSHIP,
    OatPageContextActionType.SET_SELECTED_PROPERTY_EDITOR_TAB,
    OatPageContextActionType.SET_OAT_SELECTED_MODEL
];

export const ActionToEventMapping = {
    CREATE_PROJECT: `${BASE_PATH}.CreateProject`,
    EDIT_PROJECT: `${BASE_PATH}.EditProject`,
    DUPLICATE_PROJECT: `${BASE_PATH}.DuplicateProject`,
    SWITCH_CURRENT_PROJECT: `${BASE_PATH}.SwitchProject`,
    DELETE_MODEL: `${BASE_PATH}.DeleteModel`,
    DELETE_REFERENCE: `${BASE_PATH}.DeleteReference`,
    SET_CURRENT_NAMESPACE: `${BASE_PATH}.SetCurrentNamespace`,
    SET_CURRENT_PROJECT_NAME: `${BASE_PATH}.SetCurrentProjectName`,
    UPDATE_MODEL_ID: `${BASE_PATH}.UpdateModelId`,
    ADD_NEW_MODEL: `${BASE_PATH}.AddNewModel`,
    ADD_NEW_RELATIONSHIP: `${BASE_PATH}.AddNewRelationship`,
    ADD_NEW_MODEL_WITH_RELATIONSHIP: `${BASE_PATH}.AddNewModelWithRelationShip`,
    SET_SELECTED_PROPERTY_EDITOR_TAB: `${BASE_PATH}.SetSelectedPropertyEditorTab`,
    SET_OAT_SELECTED_MODEL: `${BASE_PATH}.SetOatSelectedModel`
};
