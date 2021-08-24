import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADTRelationshipData } from '../../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import ADTTwinData from '../../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import { DTDLType } from '../../Models/Classes/DTDL';
import { propertyInspectorPatchMode } from '../../Models/Constants/Enums';
import {
    AdtPatch,
    IADTAdapter,
    IADTRelationship,
    IADTTwin
} from '../../Models/Constants/Interfaces';
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
    resolvedTwin?: IADTTwin;
};

type RelationshipPropertyInspectorProps = {
    relationshipId: string;
    adapter: IADTAdapter;
    twinId: string;
    resolvedRelationship?: IADTRelationship;
};

type PropertyInspectorProps = {
    isPropertyInspectorLoading?: boolean;
    rootAndBaseModelIdsToFlatten?: {
        rootModelId: string;
        baseModelIds: string[];
    };
} & (TwinPropertyInspectorProps | RelationshipPropertyInspectorProps);

/** Utility method for checking PropertyInspectorProps type -- twin or relationship*/
const isTwin = (
    props: PropertyInspectorProps
): props is TwinPropertyInspectorProps => {
    return (props as TwinPropertyInspectorProps).relationshipId === undefined;
};

/** Cardboard data layer wrapper component around StandalonePropertyInspector */
const PropertyInspector: React.FC<PropertyInspectorProps> = (props) => {
    const { t } = useTranslation();
    const [inputData, setInputData] = useState<TwinParams | RelationshipParams>(
        null
    );
    const [refetchTrigger, setRefetchTrigger] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const twinData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            isBeingRefreshedAfterPatch?: boolean;
        }) => {
            // Bypass twin network request if resolved twin passed into component
            if (
                isTwin(props) &&
                props.resolvedTwin &&
                !params.isBeingRefreshedAfterPatch
            ) {
                return Promise.resolve(
                    new AdapterResult<ADTTwinData>({
                        result: new ADTTwinData(props.resolvedTwin),
                        errorInfo: null
                    })
                );
            } else {
                return props.adapter.getADTTwin(params.twinId);
            }
        },
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const relationshipData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            relationshipId: string;
            isBeingRefreshedAfterPatch?: boolean;
        }) => {
            // Bypass relationship network request if resolved relationship passed into component
            if (
                !isTwin(props) &&
                props.resolvedRelationship &&
                !params.isBeingRefreshedAfterPatch
            ) {
                return Promise.resolve(
                    new AdapterResult<ADTRelationshipData>({
                        result: new ADTRelationshipData(
                            props.resolvedRelationship
                        ),
                        errorInfo: null
                    })
                );
            } else {
                return props.adapter.getADTRelationship(
                    params.twinId,
                    params.relationshipId
                );
            }
        },
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const modelData = useAdapter({
        adapterMethod: (params: { modelId: string }) => {
            if (props.rootAndBaseModelIdsToFlatten) {
                return props.adapter.getExpandedAdtModel(
                    params.modelId,
                    props.rootAndBaseModelIdsToFlatten.baseModelIds
                );
            } else {
                return props.adapter.getExpandedAdtModel(params.modelId);
            }
        },
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
        // Reset input data
        setInputData(null);
        twinData.cancelAdapter();
        modelData.cancelAdapter();
        relationshipData.cancelAdapter();

        if (isTwin(props)) {
            twinData.callAdapter({ twinId: props.twinId });
        } else {
            relationshipData.callAdapter({
                twinId: props.twinId,
                relationshipId: props.relationshipId
            });
        }
    }, [props.twinId, props.relationshipId]);

    // Once relationship is resolved, use source twin ID to query twin
    useEffect(() => {
        const relationship = relationshipData.adapterResult.getData();
        if (relationship) {
            const twinId = relationship['$sourceId'];
            twinData.callAdapter({ twinId });
        }
    }, [relationshipData.adapterResult]);

    // Once twin data is resolved, use model ID from twin metadata
    // to fetch target model and flat expanded list of all models referenced
    useEffect(() => {
        const twin = twinData.adapterResult.getData();
        if (twin && !modelData.adapterResult.getData()) {
            const modelId = twin['$metadata']['$model'];
            modelData.callAdapter({ modelId });
        } else {
            setRefetchTrigger((prev) => !prev);
        }
    }, [twinData.adapterResult]);

    // Combine twin or relationship and model data into input data object
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
        setIsInitialLoad(false);
    }, [modelData.adapterResult, refetchTrigger]);

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

    // Actions upon patch completion
    useEffect(() => {
        if (patchTwinData.adapterResult.getData()) {
            twinData.callAdapter({
                twinId: props.twinId,
                isBeingRefreshedAfterPatch: true
            }); // refetch twin after patch
        }

        if (patchRelationshipData.adapterResult.getData()) {
            relationshipData.callAdapter({
                // refetch relationship after patch
                twinId: props.twinId,
                relationshipId: props.relationshipId,
                isBeingRefreshedAfterPatch: true
            });
        }
    }, [patchTwinData.adapterResult, patchRelationshipData.adapterResult]);

    if (
        modelData.isLoading ||
        twinData.isLoading ||
        relationshipData.isLoading ||
        props.isPropertyInspectorLoading ||
        isInitialLoad
    )
        return <div>{t('loading')}</div>;

    if (!inputData) {
        return (
            <div className="cb-property-inspector-no-data">
                {isTwin(props)
                    ? t('propertyInspector.noTwinFound')
                    : t('propertyInspector.noRelationshipFound')}
            </div>
        );
    }

    return (
        <StandalonePropertyInspector
            inputData={inputData}
            onCommitChanges={onCommitChanges}
        />
    );
};

export default PropertyInspector;
