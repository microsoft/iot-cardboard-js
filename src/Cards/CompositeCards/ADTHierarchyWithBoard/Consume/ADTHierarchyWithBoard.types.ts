import {
    IADTAdapter,
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    lookupTwinId?: string;
    onTwinClick?: (twin: IADTTwin) => void;
}
