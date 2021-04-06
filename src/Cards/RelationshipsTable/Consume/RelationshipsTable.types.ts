import { ADTAdapter, MockAdapter } from '../../../Adapters';
import { IConsumeCardProps } from '../../../Models/Constants';

export interface RelationshipsTableProps
    extends Omit<IConsumeCardProps, 'properties'> {
    onRelationshipClick?: (twin: any, model: any, errors?: any) => void;
    adapter: ADTAdapter | MockAdapter;
}
