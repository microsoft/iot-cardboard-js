import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLType } from '../../Models/Classes/DTDL';
import { propertyInspectorPatchMode } from '../../Models/Constants/Enums';
import { AdtPatch, IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import { getModelContentType } from '../../Models/Services/Utils';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import {
    OnCommitPatchParams,
    RelationshipParams,
    TwinParams
} from './StandalonePropertyInspector.types';

type TwinPropertyInspectorProps = {
    twinId: string;
    adapter: IADTAdapter;
    relationshipId?: never;
};

type RelationshipPropertyInspectorProps = {
    relationshipId: string;
    adapter: IADTAdapter;
    twinId: string;
};

const isTwin = (
    props: TwinPropertyInspectorProps | RelationshipPropertyInspectorProps
): props is TwinPropertyInspectorProps => {
    return (props as TwinPropertyInspectorProps).relationshipId === undefined;
};

const PropertyInspector: React.FC<
    TwinPropertyInspectorProps | RelationshipPropertyInspectorProps
> = (props) => {
    const { t } = useTranslation();
    const [inputData, setInputData] = useState<TwinParams | RelationshipParams>(
        null
    );

    const twinData = useAdapter({
        adapterMethod: (params: { twinId: string }) =>
            props.adapter.getADTTwin(params.twinId),
        refetchDependencies: [props.twinId],
        isAdapterCalledOnMount: false
    });

    const relationshipData = useAdapter({
        adapterMethod: (params: { twinId: string; relationshipId: string }) =>
            props.adapter.getADTRelationship(
                params.twinId,
                params.relationshipId
            ),
        refetchDependencies: [props.relationshipId, props.twinId],
        isAdapterCalledOnMount: false
    });

    const modelData = useAdapter({
        adapterMethod: (params: { modelId: string }) =>
            props.adapter.getExpandedAdtModel(params.modelId),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const patchTwinData = useAdapter({
        adapterMethod: (params: { twinId: string; patches: Array<AdtPatch> }) =>
            props.adapter.updateTwin(params.twinId, params.patches),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const patchRelationshipData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            relationshipId: string;
            patches: Array<AdtPatch>;
        }) =>
            props.adapter.updateRelationship(
                params.twinId,
                params.relationshipId,
                params.patches
            ),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    // On mount, fetch necessary data for twin | relationship
    useEffect(() => {
        if (isTwin(props)) {
            // Fetch ADT twin data
            twinData.callAdapter({ twinId: props.twinId });
        } else {
            // Fetch ADT relationship data
            relationshipData.callAdapter({
                twinId: props.twinId,
                relationshipId: props.relationshipId
            });
        }
    }, []);

    // Once relationship is resolved, use source twin ID to query twin
    useEffect(() => {
        const relationship = relationshipData.adapterResult.getData();
        if (relationship) {
            const twinId = relationship['$sourceId'];
            twinData.callAdapter({ twinId });
        }
    }, [relationshipData.adapterResult]);

    // Use model ID from twin metadata to fetch target model and
    // flat expanded list of all models referenced
    useEffect(() => {
        const twin = twinData.adapterResult.getData();
        if (twin) {
            const modelId = twin['$metadata']['$model'];
            modelData.callAdapter({ modelId });
        }
    }, [twinData.adapterResult]);

    // Combine twin, target model, and expanded models into input data object
    useEffect(() => {
        const data = modelData.adapterResult.getData();
        if (isTwin(props) && data) {
            setInputData({
                expandedModel: modelData.adapterResult.getData().expandedModels,
                rootModel: modelData.adapterResult.getData().rootModel,
                twin: twinData.adapterResult.getData()
            });
        } else if (data) {
            let relationshipModel = null;
            const relationship = relationshipData.adapterResult.getData();
            const expandedModels = modelData.adapterResult.getData()
                .expandedModels;

            for (const model of expandedModels) {
                if (model.contents) {
                    for (const item of model.contents) {
                        const type = getModelContentType(item['@type']);
                        if (
                            type === DTDLType.Relationship &&
                            relationship['$relationshipName'] === item.name
                        ) {
                            relationshipModel = item;
                            break;
                        }
                    }
                }
                if (relationshipModel) break;
            }

            setInputData({
                relationship: relationship,
                relationshipModel
            });
        }
    }, [modelData.adapterResult]);

    const onCommitChanges = (patchData: OnCommitPatchParams) => {
        if (patchData?.patches && patchData.patches?.length > 0) {
            if (patchData.patchMode === propertyInspectorPatchMode.twin) {
                patchTwinData.callAdapter({
                    twinId: patchData.id,
                    patches: patchData.patches
                });
            } else if (
                patchData.patchMode === propertyInspectorPatchMode.relationship
            ) {
                patchRelationshipData.callAdapter({
                    twinId: patchData.sourceTwinId,
                    relationshipId: patchData.id,
                    patches: patchData.patches
                });
            }
        }
    };

    // Notify when patch data returned
    useEffect(() => {
        if (patchTwinData.adapterResult.getData()) {
            console.log(
                'Twin patched: ',
                patchTwinData.adapterResult.getData()
            );

            // Refetch twin after patch
            twinData.callAdapter({ twinId: props.twinId }); // TODO stop expanded model from refetching
        }

        if (patchRelationshipData.adapterResult.getData()) {
            console.log(
                'Relationship patched: ',
                patchRelationshipData.adapterResult.getData()
            );

            relationshipData.callAdapter({
                twinId: props.twinId,
                relationshipId: props.relationshipId
            });
        }
    }, [patchTwinData.adapterResult, patchRelationshipData.adapterResult]);

    if (modelData.isLoading || twinData.isLoading || relationshipData.isLoading)
        return <div>{t('loading')}</div>;

    if (!inputData) {
        return <div>No data found</div>;
    }

    return (
        <StandalonePropertyInspector
            inputData={inputData}
            onCommitChanges={onCommitChanges}
        />
    );
};

export default PropertyInspector;
