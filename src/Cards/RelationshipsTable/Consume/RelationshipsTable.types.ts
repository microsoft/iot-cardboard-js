import { ADTAdapter, MockAdapter } from '../../../Adapters';
import { IConsumeCardProps } from '../../../Models/Constants';

export interface RelationshipsTableProps
    extends Omit<IConsumeCardProps, 'properties'> {
    onRelationshipClick?: (
        targetId: string,
        targetModel: string,
        relationshipName: string
    ) => void;
    adapter: ADTAdapter | MockAdapter;
}
