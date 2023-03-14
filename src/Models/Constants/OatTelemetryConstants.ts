import { OatPageContextActionType } from '../Context/OatPageContext/OatPageContext.types';

/** Common metrics interface */
export interface OatOnMountMetrics extends OatImportExportMetrics {
    projectCount: number;
}

export interface OatImportExportMetrics {
    modelCount: number;
    v2ModelCount: number;
    v3ModelCount: number;
    relationshipCount: number;
    inheritanceCount: number;
    componentCount: number;
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
    import: `${BASE_PATH}.Import`,
    // Export
    export: `${BASE_PATH}.Export`,
    // Command history
    redo: `${BASE_PATH}.Redo.Clicked`,
    undo: `${BASE_PATH}.Undo.Clicked`,
    // Upgrade version
    upgradeModelVersion: `${BASE_PATH}.ModelVersion.Upgrade`,
    // Model field changes
    modelChangePath: `${BASE_PATH}.ModelPath.Update`,
    modelChangeName: `${BASE_PATH}.ModelName.Update`,
    modelChangeVersion: `${BASE_PATH}.ModelVersion.Update`,
    // Dtdl JSON edit
    dtdlJsonSuccess: `${BASE_PATH}.DtdlUpdate.Success`,
    dtdlJsonCancelled: `${BASE_PATH}.DtdlUpdate.Cancelled`,
    // Search
    modelListSearch: `${BASE_PATH}.ModelListSearch`,
    // Auto layout
    autoLayout: `${BASE_PATH}.AutoLayout.Clicked`,
    // Property addition
    propertyAddToModel: `${BASE_PATH}.ModelProperty.Add`,
    propertyAddToReference: `${BASE_PATH}.ReferenceProperty.Add`
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
    [OatPageContextActionType.CREATE_PROJECT]: `${BASE_PATH}.CreateProject`,
    [OatPageContextActionType.EDIT_PROJECT]: `${BASE_PATH}.EditProject`,
    [OatPageContextActionType.DUPLICATE_PROJECT]: `${BASE_PATH}.DuplicateProject`,
    [OatPageContextActionType.SWITCH_CURRENT_PROJECT]: `${BASE_PATH}.SwitchProject`,
    [OatPageContextActionType.DELETE_MODEL]: `${BASE_PATH}.DeleteModel`,
    [OatPageContextActionType.DELETE_REFERENCE]: `${BASE_PATH}.DeleteReference`,
    [OatPageContextActionType.SET_CURRENT_NAMESPACE]: `${BASE_PATH}.SetCurrentNamespace`,
    [OatPageContextActionType.SET_CURRENT_PROJECT_NAME]: `${BASE_PATH}.SetCurrentProjectName`,
    [OatPageContextActionType.UPDATE_MODEL_ID]: `${BASE_PATH}.UpdateModelId`,
    [OatPageContextActionType.ADD_NEW_MODEL]: `${BASE_PATH}.AddNewModel`,
    [OatPageContextActionType.ADD_NEW_RELATIONSHIP]: `${BASE_PATH}.AddNewRelationship`,
    [OatPageContextActionType.ADD_NEW_MODEL_WITH_RELATIONSHIP]: `${BASE_PATH}.AddNewModelWithRelationShip`,
    [OatPageContextActionType.SET_SELECTED_PROPERTY_EDITOR_TAB]: `${BASE_PATH}.SetSelectedPropertyEditorTab`,
    [OatPageContextActionType.SET_OAT_SELECTED_MODEL]: `${BASE_PATH}.SetOatSelectedModel`
};
