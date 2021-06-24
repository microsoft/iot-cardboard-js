import {
    IADTAdapter,
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter; // for now only ADT adapter
    lookupTwinId?: string;
    onTwinClick?: (twin: IADTTwin) => void;
}
