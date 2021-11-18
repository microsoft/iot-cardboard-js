import { ADT3DSceneBuilderModes } from '../../../Models/Constants/Enums';
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
