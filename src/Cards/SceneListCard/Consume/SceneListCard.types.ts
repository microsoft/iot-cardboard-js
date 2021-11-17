import { FormMode } from '../../../Models/Constants/Enums';
import {
    IADTAdapter,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    addNewSceneListCardClick?: () => void;
    deleteSceneListCardClick?: (index: number) => void;
    editSceneListCardClick: (
        element: any,
        index: number,
        formControlMode?: FormMode
    ) => void;
    formControlMode?: FormMode;
}
