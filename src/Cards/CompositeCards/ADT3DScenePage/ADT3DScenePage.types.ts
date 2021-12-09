import { MockAdapter } from '../../..';
import {
    ADT3DSceneBuilderModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import {
    IADTAdapter,
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: MockAdapter;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: MockAdapter;
    defaultMode?: ADT3DSceneBuilderModes;
    twin?: IADTTwin;
}

export interface ADT3DScenePageState {
    selectedTwin: IADTTwin;
    currentStep: ADT3DScenePageSteps;
}
