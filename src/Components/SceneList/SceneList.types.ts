import { IButtonProps } from '@fluentui/react';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IBlobAdapter,
    IStorageBlob,
    IStandaloneConsumeCardProps
} from '../../Models/Constants/Interfaces';
import { IScene } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface SceneListProps extends IStandaloneConsumeCardProps {
    adapter: IBlobAdapter | MockAdapter;
    additionalActions?: Array<IButtonProps>;
    onSceneClick?: (scene: IScene) => void;
}

export interface ISceneDialogProps {
    adapter: IBlobAdapter | MockAdapter;
    isOpen: boolean;
    onClose: () => void;
    sceneToEdit: IScene;
    onAddScene: (newScene: IScene) => void;
    onEditScene: (updatedScene: IScene) => void;
    renderBlobDropdown: (
        onChange?: (blobUrl: string) => void,
        onLoad?: (blobs: Array<IStorageBlob>) => void
    ) => JSX.Element;
}

export enum SelectionModeOf3DFile {
    FromContainer = 'fromContainer',
    FromComputer = 'fromComputer'
}

export interface SceneDialogState {
    scene: IScene;
    sceneBlobUrl: string;
    isSelectedFileExistInBlob: boolean;
    isOverwriteFile: boolean;
    blobsInContainer: IStorageBlob[];
    selectedFile: File;
    selected3DFilePivotItem: SelectionModeOf3DFile;
    isShowOnGlobeEnabled: boolean;
}

export enum SceneDialogActionType {
    SET_SCENE_NAME = 'SET_SCENE_NAME',
    SET_SCENE_DESCRIPTION = 'SET_SCENE_DESCRIPTION',
    SET_LATITUDE_VALUE = 'SET_LATITUDE_VALUE',
    SET_LONGITUDE_VALUE = 'SET_LONGITUDE_VALUE',
    SET_IS_SHOW_ON_GLOBE_ENABLED = 'SET_IS_SHOW_ON_GLOBE_ENABLED',
    SET_SCENE_BLOB_URL = 'SET_SCENE_BLOB_URL',
    SET_IS_SELECTED_FILE_EXIST_IN_BLOB = 'SET_IS_SELECTED_FILE_EXIST_IN_BLOB',
    SET_IS_OVER_WRITE_FILE = 'SET_IS_OVER_WRITE_FILE',
    SET_BLOBS_IN_CONTAINER = 'SET_BLOBS_IN_CONTAINER',
    SET_SELECTED_FILE = 'SET_SELECTED_FILE',
    SET_SELECTED_3D_FILE_PIVOT_ITEM = 'SET_SELECTED_3D_FILE_PIVOT_ITEM',
    RESET_SCENE = 'RESET_SCENE',
    RESET_FILE = 'RESET_FILE',
    RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB = 'RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB',
    SET_IS_GLOBE_ENABLED = 'SET_IS_GLOBE_ENABLED'
}
/** The actions to update the SceneDialogState */
export type SceneDialogAction =
    | {
          type: SceneDialogActionType.SET_SCENE_NAME;
          payload: { displayName: string };
      }
    | {
          type: SceneDialogActionType.SET_SCENE_DESCRIPTION;
          payload: { description: string };
      }
    | {
          type: SceneDialogActionType.SET_LATITUDE_VALUE;
          payload: { latitude: number };
      }
    | {
          type: SceneDialogActionType.SET_LONGITUDE_VALUE;
          payload: { longitude: number };
      }
    | {
          type: SceneDialogActionType.SET_SCENE_BLOB_URL;
          payload: { sceneBlobUrl: string };
      }
    | {
          type: SceneDialogActionType.SET_IS_SELECTED_FILE_EXIST_IN_BLOB;
          payload: { isSelectedFileExistInBlob: boolean };
      }
    | {
          type: SceneDialogActionType.SET_IS_OVER_WRITE_FILE;
          payload: { isOverwriteFile: boolean };
      }
    | {
          type: SceneDialogActionType.SET_BLOBS_IN_CONTAINER;
          payload: { blobsInContainer: Array<IStorageBlob> };
      }
    | {
          type: SceneDialogActionType.SET_SELECTED_FILE;
          payload: { selectedFile: File };
      }
    | {
          type: SceneDialogActionType.SET_SELECTED_3D_FILE_PIVOT_ITEM;
          payload: { selected3DFilePivotItem: SelectionModeOf3DFile };
      }
    | {
          type: SceneDialogActionType.RESET_FILE;
          payload?: {
              /**does nothing */
          };
      }
    | {
          type: SceneDialogActionType.RESET_SCENE;
          payload?: {
              /**does nothing */
          };
      }
    | {
          type: SceneDialogActionType.RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB;
          payload: {
              isSelectedFileExistInBlob: boolean;
              isOverwriteFile: boolean;
          };
      }
    | {
          type: SceneDialogActionType.SET_IS_SHOW_ON_GLOBE_ENABLED;
          payload: {
              isShowOnGlobeEnabled: boolean;
          };
      };
