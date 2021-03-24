import { ADTAdapter } from '../../../Adapters';
import { IConsumeCardProps } from '../../../Models/Constants';

export interface RelationshipsTableProps extends IConsumeCardProps {
    relationshipOnClick?: (
        targetId: string,
        targetModel: string,
        relationshipName: string
    ) => void;
    adapter: ADTAdapter;
}
