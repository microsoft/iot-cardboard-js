import {
    IADTandADXAdapter,
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardProps extends IConsumeCompositeCardProps {
    adapter: IADTandADXAdapter;
    lookupTwinId?: string;
    onTwinClick?: (twin: IADTTwin) => void;
}
