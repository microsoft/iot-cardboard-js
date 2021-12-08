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
    adapter: IADTAdapter;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    defaultMode?: ADT3DSceneBuilderModes;
    twin?: IADTTwin;
}

export interface ADT3DScenePageState {
    selectedTwin: IADTTwin;
    currentStep: ADT3DScenePageSteps;
}
