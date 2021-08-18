import { ADTAdapter } from '../../../Adapters';
import { IConsumeCompositeCardProps } from '../../../Models/Constants';

export interface BIMUploadCardProps extends IConsumeCompositeCardProps {
    adapter: ADTAdapter;
}
