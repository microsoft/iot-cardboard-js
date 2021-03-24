import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import { RelationshipsTableProps } from './RelationshipsTable.types';
import './RelationshipsTable.scss';
import { useAdapter } from '../../../Models/Hooks';
import { ADTRelationship } from '../../../Models/Constants';

const RelationshipsTable: React.FC<RelationshipsTableProps> = ({
    theme,
    id,
    adapter,
    title,
    localeStrings
}) => {
    const cardState = useAdapter({
        adapterMethod: () => adapter.getRelationships(id),
        refetchDependencies: [id]
    });
    return (
        <BaseCard
            adapterResult={cardState.adapterResult}
            isLoading={cardState.isLoading}
            theme={theme}
            title={title}
            localeStrings={localeStrings}
        >
            <div className={'cb-relationships-table-wrapper'}>
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
                                (
                                    relationship: ADTRelationship,
                                    relationshipI
                                ) => (
                                    <tr
                                        className="cb-relationships-content-row"
                                        key={relationshipI}
                                    >
                                        <td className="cb-relationships-content-cell">
                                            {relationship.targetId}
                                        </td>
                                        <td className="cb-relationships-content-cell">
                                            {relationship.targetModel}
                                        </td>
                                        <td className="cb-relationships-content-cell">
                                            {relationship.relationshipName}
                                        </td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
            </div>
        </BaseCard>
    );
};

export default RelationshipsTable;
