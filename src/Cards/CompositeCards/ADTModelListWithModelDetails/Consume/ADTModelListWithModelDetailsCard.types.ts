import {
    IADTAdapter,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTModelListWithModelDetailsCardProps
    extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
}
