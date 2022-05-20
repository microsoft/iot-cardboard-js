import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_SCENE_NAME,
    SET_SCENE_DESCRIPTION,
    SET_LATITUDE_VALUE,
    SET_LONGITUDE_VALUE,
    SET_SCENE_BLOB_URL,
    SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
    SET_IS_OVER_WRITE_FILE,
    SET_BLOBS_IN_CONTAINER,
    SET_SELECTED_FILE,
    SET_SELECTED_3D_FILE_PIVOT_ITEM,
    RESET_FILE,
    RESET_SCENE,
    RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB
} from '../../../Models/Constants/ActionTypes';
import { SceneDialogState, SelectionModeOf3DFile } from '../SceneList.types';

export const defaultSceneDialogState: SceneDialogState = {
    sceneName: '',
    sceneDescription: '',
    latitudeValue: undefined,
    longitudeValue: undefined,
    sceneBlobUrl: '',
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
        case SET_SCENE_NAME:
            draft.sceneName = payload;
            break;
        case SET_SCENE_DESCRIPTION:
            draft.sceneDescription = payload;
            break;
        case SET_LATITUDE_VALUE:
            draft.latitudeValue = payload;
            break;
        case SET_LONGITUDE_VALUE:
            draft.longitudeValue = payload;
            break;
        case SET_SCENE_BLOB_URL:
            draft.sceneBlobUrl = payload;
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
        case RESET_FILE:
            draft.isSelectedFileExistInBlob = payload.isSelectedFileExistInBlob;
            draft.isOverwriteFile = payload.isOverwriteFile;
            draft.selectedFile = payload.selectedFile;
            break;
        case RESET_SCENE:
            draft = defaultSceneDialogState;
            break;
        case RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB:
            draft.isSelectedFileExistInBlob = payload.isSelectedFileExistInBlob;
            draft.isOverwriteFile = payload.isOverwriteFile;
            break;
        default:
            break;
    }
});
