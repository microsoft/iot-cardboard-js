import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import { RelationshipsTableProps } from './RelationshipsTable.types';
import './RelationshipsTable.scss';
import { useAdapter } from '../../../Models/Hooks';
import { ADTRelationship } from '../../../Models/Constants';
import { useTranslation } from 'react-i18next';

const RelationshipsTable: React.FC<RelationshipsTableProps> = ({
    theme,
    id,
    adapter,
    title,
    localeStrings,
    onRelationshipClick
}) => {
    const cardState = useAdapter({
        adapterMethod: () => adapter.getRelationships(id),
        refetchDependencies: [id]
    });
    const { t } = useTranslation();
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
                            <th>{t('relationshipsTable.twinID')}</th>
                            <th>{t('relationshipsTable.model')}</th>
                            <th>{t('relationshipsTable.relationshipName')}</th>
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
                                        className={`cb-relationships-content-row${
                                            onRelationshipClick
                                                ? ' cb-row-is-clickable'
                                                : ''
                                        }`}
                                        key={relationshipI}
                                        onClick={() =>
                                            onRelationshipClick &&
                                            onRelationshipClick(
                                                relationship.targetId,
                                                relationship.targetModel,
                                                relationship.relationshipName
                                            )
                                        }
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
