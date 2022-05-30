import { OATDataStorageKey } from '../../../Models/Constants';

// Get stored OAT-data
export const getStoredEditorData = () => {
    return JSON.parse(localStorage.getItem(OATDataStorageKey));
};

// Get stored template OAT-data
export const getStoredEditorTemplateData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.templates ? oatData.templates : [];
};

// Get stored models OAT-data
export const getStoredEditorModelsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.models ? oatData.models : [];
};

// Get stored models' positions OAT-data
export const getStoredEditorModelPositionsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelPositions ? oatData.modelPositions : [];
};
