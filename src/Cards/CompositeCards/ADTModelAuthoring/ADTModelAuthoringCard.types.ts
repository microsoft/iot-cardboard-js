import { ADTAdapter } from '../../../Adapters';
import { IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

export interface ADTModelAuthoringCardProps extends IConsumeCompositeCardProps {
    adapter: ADTAdapter;
    onCancel: () => void;
    existingModelIds?: Array<string>;
}
