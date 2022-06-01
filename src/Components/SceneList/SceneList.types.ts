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
    sceneName: string;
    sceneDescription: string;
    latitudeValue: any;
    longitudeValue: any;
    sceneBlobUrl: string;
    isSelectedFileExistInBlob: boolean;
    isOverwriteFile: boolean;
    blobsInContainer: IStorageBlob[];
    selectedFile: File;
    selected3DFilePivotItem: SelectionModeOf3DFile;
}
