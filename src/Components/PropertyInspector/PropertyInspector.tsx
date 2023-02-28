import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADTRelationshipData } from '../../Models/Classes/AdapterDataClasses/ADTRelationshipsData';
import ADTTwinData from '../../Models/Classes/AdapterDataClasses/ADTTwinData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import { DTDLType } from '../../Models/Classes/DTDL';
import {
    Locale,
    PropertyInspectorPatchMode,
    Theme
} from '../../Models/Constants/Enums';
import {
    ADTPatch,
    IADTDataHistoryAdapter,
    IADTRelationship,
    IADTTwin,
    IPropertyInspectorAdapter
} from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import { getModelContentType } from '../../Models/Services/Utils';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import {
    OnCommitPatchParams,
    RelationshipParams,
    TwinParams
} from './StandalonePropertyInspector.types';
import './PropertyInspector.scss';
import { Spinner } from '@fluentui/react';

type TwinPropertyInspectorProps = {
    twinId: string;
    adapter: IPropertyInspectorAdapter | IADTDataHistoryAdapter;
    relationshipId?: never;
    resolvedTwin?: IADTTwin;
    resolvedRelationship?: never;
};

type RelationshipPropertyInspectorProps = {
    relationshipId: string;
    adapter: IPropertyInspectorAdapter;
    twinId: string;
    resolvedRelationship?: IADTRelationship;
    resolvedTwin?: IADTTwin;
};

export type DataHistoryControl =
    | boolean
    | {
          isEnabled: boolean; // to force control if the button is enabled in UI without relying on adapter's timeSeriesConnection information
      };

type PropertyInspectorProps = {
    isPropertyInspectorLoading?: boolean;
    onPatch?: (patchData: OnCommitPatchParams) => any;
    parentHandlesScroll?: boolean;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    rootAndBaseModelIdsToFlatten?: {
        rootModelId: string;
        baseModelIds: string[];
    };
    readonly?: boolean;
    customCommandBarTitleSpan?: React.ReactNode;
    hasDataHistoryControl?: DataHistoryControl;
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
    const [missingModelIds, setMissingModelIds] = useState([]);

    const twinData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            shouldRefreshAfterPatch?: boolean;
            resolvedTwin?: IADTTwin;
        }) => {
            // Bypass twin network request if resolved twin passed into component
            if (params.resolvedTwin && !params.shouldRefreshAfterPatch) {
                return Promise.resolve(
                    new AdapterResult<ADTTwinData>({
                        result: new ADTTwinData(params.resolvedTwin),
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
            shouldRefreshAfterPatch?: boolean;
            resolvedRelationship?: IADTRelationship;
        }) => {
            // Bypass relationship network request if resolved relationship passed into component
            if (
                !isTwin(props) &&
                params.resolvedRelationship &&
                !params.shouldRefreshAfterPatch
            ) {
                return Promise.resolve(
                    new AdapterResult<ADTRelationshipData>({
                        result: new ADTRelationshipData(
                            params.resolvedRelationship
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
        adapterMethod: (params: { twinId: string; patches: Array<ADTPatch> }) =>
            props.adapter.updateTwin(params.twinId, params.patches),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const patchRelationshipData = useAdapter({
        adapterMethod: (params: {
            twinId: string;
            relationshipId: string;
            patches: Array<ADTPatch>;
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
        setMissingModelIds([]);
        twinData.cancelAdapter();
        modelData.cancelAdapter();
        relationshipData.cancelAdapter();

        if (isTwin(props)) {
            twinData.callAdapter({ twinId: props.twinId });
        } else {
            relationshipData.callAdapter({
                twinId: props.twinId,
                relationshipId: props.relationshipId,
                resolvedRelationship: props.resolvedRelationship
            });
        }
    }, [props.twinId, props.relationshipId]);

    // Once relationship is resolved, use source twin ID to query twin
    useEffect(() => {
        const relationship = relationshipData.adapterResult.getData();
        if (relationship) {
            const twinId = relationship['$sourceId'];
            twinData.callAdapter({ twinId, resolvedTwin: props.resolvedTwin });
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
        if (modelData.adapterResult?.errorInfo?.errors) {
            setMissingModelIds(
                modelData.adapterResult.errorInfo.errors
                    .slice()
                    .map((e) => e.message)
            );
        }
        if (isTwin(props) && data) {
            setInputData({
                expandedModels: modelData.adapterResult.getData()
                    .expandedModels,
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
                            relationshipModel = model;
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
            if (patchData.patchMode === PropertyInspectorPatchMode.twin) {
                patchTwinData.callAdapter({
                    twinId: patchData.id,
                    patches: patchData.patches
                });
            } else if (
                patchData.patchMode === PropertyInspectorPatchMode.relationship
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
                shouldRefreshAfterPatch: true,
                resolvedTwin: props.resolvedTwin
            }); // refetch twin after patch

            props.onPatch &&
                props.onPatch(patchTwinData.adapterResult.getData());
        } else if (patchTwinData.adapterResult.errorInfo?.catastrophicError) {
            const error = (patchTwinData.adapterResult.errorInfo
                .catastrophicError.rawError as any)?.response?.data?.error;
            props.onPatch && props.onPatch(error);
        }

        if (patchRelationshipData.adapterResult.getData()) {
            relationshipData.callAdapter({
                // refetch relationship after patch
                twinId: props.twinId,
                relationshipId: props.relationshipId,
                shouldRefreshAfterPatch: true,
                resolvedRelationship: props.resolvedRelationship
            });

            props.onPatch &&
                props.onPatch(patchRelationshipData.adapterResult.getData());
        } else if (
            patchRelationshipData.adapterResult.errorInfo?.catastrophicError
        ) {
            const error = (patchRelationshipData.adapterResult.errorInfo
                .catastrophicError.rawError as any)?.response?.data?.error;
            props.onPatch && props.onPatch(error);
        }
    }, [patchTwinData.adapterResult, patchRelationshipData.adapterResult]);

    if (
        modelData.isLoading ||
        twinData.isLoading ||
        relationshipData.isLoading ||
        props.isPropertyInspectorLoading ||
        isInitialLoad
    )
        return (
            <div className="cb-property-inspector-loading">
                <Spinner label={t('loading')} />
            </div>
        );

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
        <div className="cb-property-inspector-container">
            <StandalonePropertyInspector
                inputData={inputData}
                onCommitChanges={onCommitChanges}
                theme={props.theme}
                locale={props.locale}
                localeStrings={props.localeStrings}
                missingModelIds={missingModelIds}
                parentHandlesScroll={props.parentHandlesScroll}
                readonly={props.readonly}
                customCommandBarTitleSpan={props.customCommandBarTitleSpan}
                onRefresh={() => {
                    if (isTwin(props)) {
                        // Refresh twin data
                        twinData.callAdapter({
                            twinId: props.twinId,
                            shouldRefreshAfterPatch: true,
                            resolvedTwin: props.resolvedTwin
                        });
                    } else {
                        // Refresh relationship data
                        relationshipData.callAdapter({
                            twinId: props.twinId,
                            relationshipId: props.relationshipId,
                            shouldRefreshAfterPatch: true,
                            resolvedRelationship: props.resolvedRelationship
                        });
                    }
                }}
                dataHistoryControlProps={
                    isTwin(props) &&
                    hasDataHistoryAdapter(props.adapter) &&
                    props.hasDataHistoryControl
                        ? {
                              isEnabled:
                                  typeof props.hasDataHistoryControl ===
                                  'boolean'
                                      ? undefined
                                      : props.hasDataHistoryControl.isEnabled,
                              initialTwinId: props.twinId,
                              adapter: props.adapter
                          }
                        : undefined
                }
            />
        </div>
    );
};

const hasDataHistoryAdapter = (
    adapter: IPropertyInspectorAdapter | IADTDataHistoryAdapter
): adapter is IADTDataHistoryAdapter =>
    !!(adapter as IADTDataHistoryAdapter).updateADXConnectionInformation;

export default React.memo(PropertyInspector);
