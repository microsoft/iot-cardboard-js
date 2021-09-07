import { ADTAdapter } from '../../../Adapters';
import {
    IADTModel,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface ADTModelAuthoringCardProps extends IConsumeCompositeCardProps {
    adapter: ADTAdapter;
    onCancel: () => void;
    onPublish: (models: Array<IADTModel>) => void;
    existingModelIds?: Array<string>;
}
