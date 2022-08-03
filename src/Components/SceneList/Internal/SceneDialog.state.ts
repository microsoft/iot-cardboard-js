import produce from 'immer';
import {
    SceneDialogAction,
    SceneDialogState,
    SelectionModeOf3DFile,
    SceneDialogActionType
} from '../SceneList.types';
import { IScene } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const getDefaultSceneDialogState = (
    scene: IScene | undefined
): SceneDialogState => ({
    scene: scene || {
        id: '',
        displayName: '',
        description: '',
        latitude: undefined,
        longitude: undefined,
        elements: [],
        behaviorIDs: [],
        assets: []
    },
    isShowOnGlobeEnabled: Boolean(
        !(isNaN(scene?.latitude) || isNaN(scene?.longitude))
    ),
    isSelectedFileExistInBlob: false,
    isOverwriteFile: false,
    blobsInContainer: [],
    selectedFile: null,
    selected3DFilePivotItem: SelectionModeOf3DFile.FromContainer
});

export const SceneDialogReducer: (
    draft: SceneDialogState,
    action: SceneDialogAction
) => SceneDialogState = produce(
    (draft: SceneDialogState, action: SceneDialogAction) => {
        const defaultState = getDefaultSceneDialogState(undefined);

        switch (action.type) {
            case SceneDialogActionType.SET_SCENE_NAME:
                draft.scene.displayName = action.payload.displayName;
                break;
            case SceneDialogActionType.SET_SCENE_DESCRIPTION:
                draft.scene.description = action.payload.description;
                break;
            case SceneDialogActionType.SET_LATITUDE_VALUE:
                draft.scene.latitude = action.payload.latitude;
                break;
            case SceneDialogActionType.SET_LONGITUDE_VALUE:
                draft.scene.longitude = action.payload.longitude;
                break;
            case SceneDialogActionType.SET_SCENE_BLOB_URL:
                draft.scene.assets = [
                    {
                        type: '3DAsset',
                        url: action.payload.sceneBlobUrl
                    }
                ];
                break;
            case SceneDialogActionType.SET_IS_SELECTED_FILE_EXIST_IN_BLOB:
                draft.isSelectedFileExistInBlob =
                    action.payload.isSelectedFileExistInBlob;
                break;
            case SceneDialogActionType.SET_IS_OVER_WRITE_FILE:
                draft.isOverwriteFile = action.payload.isOverwriteFile;
                break;
            case SceneDialogActionType.SET_BLOBS_IN_CONTAINER:
                draft.blobsInContainer = action.payload.blobsInContainer;
                break;
            case SceneDialogActionType.SET_SELECTED_FILE:
                draft.selectedFile = action.payload.selectedFile;
                break;
            case SceneDialogActionType.SET_SELECTED_3D_FILE_PIVOT_ITEM:
                draft.selected3DFilePivotItem =
                    action.payload.selected3DFilePivotItem;
                break;
            case SceneDialogActionType.RESET_FILE:
                draft.isSelectedFileExistInBlob =
                    defaultState.isSelectedFileExistInBlob;
                draft.isOverwriteFile = defaultState.isOverwriteFile;
                draft.selectedFile = defaultState.selectedFile;
                break;
            case SceneDialogActionType.RESET_SCENE:
                draft = getDefaultSceneDialogState(undefined);
                break;
            case SceneDialogActionType.RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB:
                draft.isSelectedFileExistInBlob =
                    action.payload.isSelectedFileExistInBlob;
                draft.isOverwriteFile = action.payload.isOverwriteFile;
                break;
            case SceneDialogActionType.SET_IS_SHOW_ON_GLOBE_ENABLED:
                draft.isShowOnGlobeEnabled =
                    action.payload.isShowOnGlobeEnabled;
                if (!draft.isShowOnGlobeEnabled) {
                    if (!isNaN(draft.scene.latitude)) {
                        delete draft.scene.latitude;
                    }
                    if (!isNaN(draft.scene.longitude)) {
                        delete draft.scene.longitude;
                    }
                }
                break;
            default:
                break;
        }
    }
);
