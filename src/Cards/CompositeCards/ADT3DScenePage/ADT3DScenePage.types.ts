import MockAdapter from '../../../Adapters/MockAdapter';
import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import { Scene } from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import {
    IADTAdapter,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter | MockAdapter;
    defaultMode?: ADT3DSceneBuilderModes;
    scene?: Scene;
}

export interface ADT3DScenePageState {
    selectedScene: Scene;
    currentStep: ADT3DScenePageSteps;
}
