import React, { useEffect, useState } from 'react';
import { DTwinPatch, IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import {
    OnCommitTwinPatchParams,
    RelationshipParams,
    TwinParams
} from './StandalonePropertyInspector.types';

type PropertyInspectorProps = {
    twinId: string;
    adapter: IADTAdapter;
};

// TODO update props and logic to take relationship | twin
const PropertyInspector: React.FC<PropertyInspectorProps> = ({
    twinId,
    adapter
}) => {
    const [inputData, setInputData] = useState<TwinParams | RelationshipParams>(
        null
    );

    // Fetch twin using twinId
    const twinData = useAdapter({
        adapterMethod: () => adapter.getADTTwin(twinId),
        refetchDependencies: [twinId],
        isAdapterCalledOnMount: true
    });

    const modelData = useAdapter({
        adapterMethod: (params: { modelId: string }) =>
            adapter.getExpandedAdtModel(params.modelId),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const patchTwinData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            patches: Array<DTwinPatch>;
        }) => adapter.updateTwin(params.twinId, params.patches),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

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

    const onCommitChanges = (patchData: OnCommitTwinPatchParams) => {
        // TODO - check if patching twin or relationship
        if (patchData?.patches && patchData.patches?.length > 0) {
            patchTwinData.callAdapter({
                twinId: patchData.twinId,
                patches: patchData.patches
            });
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
            twinData.callAdapter(); // TODO stop expanded model from refetching
        }
    }, [patchTwinData.adapterResult]);

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
