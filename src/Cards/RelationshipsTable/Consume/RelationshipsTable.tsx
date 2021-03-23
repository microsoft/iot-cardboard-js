import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import { RelationshipsTableProps } from './RelationshipsTable.types';
import './RelationshipsTable.scss';
import { useAdapter } from '../../../Models/Hooks';
import { ADTRelationship } from '../../../Models/Constants';

const RelationshipsTable: React.FC<RelationshipsTableProps> = ({
    theme,
    id,
    adapter
}) => {
    const cardState = useAdapter({
        adapterMethod: () => adapter.getRelationships(id),
        refetchDependencies: [id]
    });
    return (
        <BaseCard
            adapterResult={cardState.adapterResult}
            isLoading={false}
            theme={theme}
            title={'Relationships'}
        >
            <table className="cb-relationships-table">
                <thead>
                    <tr className="cb-relationships-header-row">
                        <th>TwinID</th>
                        <th>Model</th>
                        <th>Relationship name</th>
                    </tr>
                </thead>
                <tbody>
                    {cardState.adapterResult
                        ?.getData()
                        ?.map(
                            (relationship: ADTRelationship, relationshipI) => (
                                <tr
                                    className="cb-relationships-content-row"
                                    key={relationshipI}
                                >
                                    <td className='cb-relationships-content-cell'>{relationship.targetId}</td>
                                    <td className='cb-relationships-content-cell'>{relationship.targetModel}</td>
                                    <td className='cb-relationships-content-cell'>{relationship.relationshipName}</td>
                                </tr>
                            )
                        )}
                </tbody>
            </table>
        </BaseCard>
    );
};

export default RelationshipsTable;
