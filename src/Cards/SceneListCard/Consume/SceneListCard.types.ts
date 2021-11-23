import { FormMode } from '../../../Models/Constants/Enums';
import {
    IADTAdapter,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    formControlMode?: FormMode;
}
