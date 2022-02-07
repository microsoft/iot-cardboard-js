import MockAdapter from '../../../Adapters/MockAdapter';
import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import { IScene, IScenesConfig } from '../../../Models/Classes/3DVConfig';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import { IComponentError, IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    existingBlobContainerUrls?: Array<string>;
    onBlobContainerUrlChange?: (
        selectedBlobContainerUrl: string,
        blobContainerUrls: Array<string>
    ) => void;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    defaultMode?: ADT3DScenePageModes;
    scene: IScene;
    scenesConfig: IScenesConfig;
    refetchConfig?: () => any;
}

export interface ADT3DScenePageState {
    scenesConfig: IScenesConfig;
    selectedBlobContainerURL: string;
    blobContainerURLs: Array<string>;
    selectedScene: IScene;
    scene?: IScene;
    errors?: Array<IComponentError>;
}

export interface ADT3DScenePageState {
    selectedScene: IScene;
    currentStep: ADT3DScenePageSteps;
}
