import { ADTAdapter } from '../../../Adapters';
import { IConsumeCardProps } from '../../../Models/Constants';

export interface RelationshipsTableProps extends IConsumeCardProps {
    relationshipOnClick?: any;
    adapter: ADTAdapter;
}
