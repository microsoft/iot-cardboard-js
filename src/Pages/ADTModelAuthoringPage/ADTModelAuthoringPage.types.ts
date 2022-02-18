import {
    IADTAdapter,
    IConsumeCompositeCardProps
} from '../../Models/Constants/Interfaces';

export interface ADTModelAuthoringPageProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    onAuthoringOpen?: () => void;
    onAuthoringClose?: () => void;
}
