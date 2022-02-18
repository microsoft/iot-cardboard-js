import {
    IADTAdapter,
    IADTModel,
    IConsumeCompositeCardProps
} from '../../../../Models/Constants/Interfaces';

export interface ADTModelAuthoringCardProps extends IConsumeCompositeCardProps {
    adapter: IADTAdapter;
    onCancel: () => void;
    onPublish: (models: Array<IADTModel>) => void;
    existingModelIds?: Array<string>;
}
