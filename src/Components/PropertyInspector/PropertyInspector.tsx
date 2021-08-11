import React, { useEffect, useState } from 'react';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import {
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
        adapterMethod: (params: { modelId?: string }) =>
            adapter.getExpandedAdtModel(params.modelId), //adapter.getExpandedModels(params.modelId), // TODO update to new ADTAdapter method to resolve all models
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

    if (modelData.isLoading || twinData.isLoading) return <div>Loading...</div>;

    if (!inputData) {
        return <div>No data found</div>;
    }

    return <StandalonePropertyInspector inputData={inputData} />;
};

export default PropertyInspector;
