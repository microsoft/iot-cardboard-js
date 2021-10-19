import { ADTandADXAdapter } from '../../../../Adapters';
import {
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardProps extends IConsumeCompositeCardProps {
    adapter: ADTandADXAdapter;
    lookupTwinId?: string;
    onTwinClick?: (twin: IADTTwin) => void;
}
