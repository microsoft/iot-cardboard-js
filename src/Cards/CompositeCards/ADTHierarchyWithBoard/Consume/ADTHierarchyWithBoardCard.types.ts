import {
    IADTAdapter,
    IConsumeCompositeCardProps,
} from '../../../../Models/Constants/Interfaces';

export interface ADTHierarchyWithBoardCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter; // for now only ADT adapter
}
