import React, { useEffect, useState } from 'react';
import { propertyInspectorPatchMode } from '../../Models/Constants/Enums';
import { AdtPatch, IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
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
    twinId?: never;
};

const isTwin = (
    props: TwinPropertyInspectorProps | RelationshipPropertyInspectorProps
): props is TwinPropertyInspectorProps => {
    return (props as TwinPropertyInspectorProps).twinId !== undefined;
};

const PropertyInspector: React.FC<
    TwinPropertyInspectorProps | RelationshipPropertyInspectorProps
> = (props) => {
    const [inputData, setInputData] = useState<TwinParams | RelationshipParams>(
        null
    );

    // Fetch twin using twinId
    const twinData = useAdapter({
        adapterMethod: (params: { twinId: string }) =>
            props.adapter.getADTTwin(params.twinId),
        refetchDependencies: [props.twinId],
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
            twinData.callAdapter({ twinId: props.twinId });
        } else {
            // TODO fetch initial relationship
        }
    }, []);

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
        if (modelData.adapterResult.getData()) {
            setInputData({
                expandedModel: modelData.adapterResult.getData().expandedModels,
                rootModel: modelData.adapterResult.getData().rootModel,
                twin: twinData.adapterResult.getData()
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

            // TODO refetch relationship after patch
        }
    }, [patchTwinData.adapterResult, patchRelationshipData.adapterResult]);

    if (modelData.isLoading || twinData.isLoading) return <div>Loading...</div>;

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
