import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_NEW_SCENE_NAME,
    SET_NEW_SCENE_DESCRIPTION,
    SET_NEW_LATITUDE_VALUE,
    SET_NEW_LONGITUDE_VALUE,
    SET_NEW_SCENE_BLOB_URL,
    SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
    SET_IS_OVER_WRITE_FILE,
    SET_BLOBS_IN_CONTAINER,
    SET_SELECTED_FILE,
    SET_SELECTED_3D_FILE_PIVOT_ITEM,
    RESET
} from '../../../Models/Constants/ActionTypes';
import { SceneDialogState, SelectionModeOf3DFile } from '../SceneList.types';

export const defaultSceneDialogState: SceneDialogState = {
    newSceneName: '',
    newSceneDescription: '',
    newLatitudeValue: undefined,
    newLongitudeValue: undefined,
    newSceneBlobUrl: '',
    isSelectedFileExistInBlob: false,
    isOverwriteFile: false,
    blobsInContainer: [],
    selectedFile: null,
    selected3DFilePivotItem: SelectionModeOf3DFile.FromContainer
};

export const SceneDialogReducer: (
    draft: SceneDialogState,
    action: IAction
) => SceneDialogState = produce((draft: SceneDialogState, action: IAction) => {
    const payload = action.payload;

    switch (action.type) {
        case SET_NEW_SCENE_NAME:
            draft.newSceneName = payload;
            break;
        case SET_NEW_SCENE_DESCRIPTION:
            draft.newSceneDescription = payload;
            break;
        case SET_NEW_LATITUDE_VALUE:
            draft.newLatitudeValue = payload;
            break;
        case SET_NEW_LONGITUDE_VALUE:
            draft.newLongitudeValue = payload;
            break;
        case SET_NEW_SCENE_BLOB_URL:
            draft.newSceneBlobUrl = payload;
            break;
        case SET_IS_SELECTED_FILE_EXIST_IN_BLOB:
            draft.isSelectedFileExistInBlob = payload;
            break;
        case SET_IS_OVER_WRITE_FILE:
            draft.isOverwriteFile = payload;
            break;
        case SET_BLOBS_IN_CONTAINER:
            draft.blobsInContainer = payload;
            break;
        case SET_SELECTED_FILE:
            draft.selectedFile = payload;
            break;
        case SET_SELECTED_3D_FILE_PIVOT_ITEM:
            draft.selected3DFilePivotItem = payload;
            break;
        case RESET:
            draft = payload;
            break;
        default:
            break;
    }
});
