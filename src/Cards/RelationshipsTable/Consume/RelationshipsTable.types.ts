import { ADTAdapter, MockAdapter } from '../../../Adapters';
import {
    IADTModel,
    IADTTwin,
    IConsumeCardProps,
    IResolvedRelationshipClickErrors
} from '../../../Models/Constants';

export interface RelationshipsTableProps
    extends Omit<IConsumeCardProps, 'properties'> {
    onRelationshipClick?: (
        twin: IADTTwin,
        model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => void;
    adapter: ADTAdapter | MockAdapter;
}
