import MockAdapter from '../../../Adapters/MockAdapter';
import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import { Scene, ScenesConfig } from '../../../Models/Classes/3DVConfig';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import { IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    defaultMode?: ADT3DScenePageModes;
    scene: Scene;
    scenesConfig: ScenesConfig;
}

export interface ADT3DScenePageState {
    scenesConfig: ScenesConfig;
    selectedBlobContainerURL: string;
    blobContainerURLs: Array<string>;
    selectedScene: Scene;
    currentStep: ADT3DScenePageSteps;
}
