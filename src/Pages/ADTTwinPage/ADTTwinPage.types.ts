import { ADTandADXAdapter } from '../../Adapters';
import { SearchSpan } from '../../Models/Classes';
import {
    IADTTwin,
    IConsumeCompositeCardProps
} from '../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardProps extends IConsumeCompositeCardProps {
    adapter: ADTandADXAdapter;
    lookupTwinId?: string;
    onTwinClick?: (twin: IADTTwin) => void;
    searchSpanForDataHistory?: SearchSpan; // if not provided it pulls data history for the last 7 days
}
