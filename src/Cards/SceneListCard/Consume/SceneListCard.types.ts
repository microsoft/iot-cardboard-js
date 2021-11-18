import { FormMode } from '../../../Models/Constants/Enums';
import {
    IADTAdapter,
    IConsumeCompositeCardProps,
    IHierarchyNode
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    addNewSceneListCardClick?: () => void;
    deleteSceneListCardClick?: () => void;
    editSceneListCardClick: (element: any, index: number) => void;
    formControlMode?: FormMode;
}
