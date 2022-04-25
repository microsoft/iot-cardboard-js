import React from 'react';
import BaseCard from '../BaseCard/BaseCard';
import { RelationshipsTableProps } from './RelationshipsTable.types';
import './RelationshipsTable.scss';
import { useAdapter } from '../../Models/Hooks';
import {
    ADTRelationship,
    IResolvedRelationshipClickErrors
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import ADTTwinData from '../../Models/Classes/AdapterDataClasses/ADTTwinData';
import { AdapterResult } from '../../Models/Classes';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

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

    const wrappedOnClick = async (id: string) => {
        const resolvedTwin: AdapterResult<ADTTwinData> = await adapter.getADTTwin(
            id
        );
        let resolvedModel = null;
        if (resolvedTwin.result?.data?.$metadata?.$model) {
            resolvedModel = await adapter.getADTModel(
                resolvedTwin.result.data.$metadata.$model
            );
        }

        const errors: IResolvedRelationshipClickErrors = {};
        if (resolvedTwin.getErrors()) {
            errors.twinErrors = resolvedTwin.getErrors();
        }
        if (resolvedModel?.getErrors()) {
            errors.modelErrors = resolvedModel.getErrors();
        }

        onRelationshipClick(
            resolvedTwin.getData(),
            resolvedModel?.getData(),
            errors
        );
    };
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
                            <th>{t('twinId')}</th>
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
                                        onClick={async () =>
                                            onRelationshipClick &&
                                            wrappedOnClick(
                                                relationship.targetId
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

export default withErrorBoundary(RelationshipsTable);
