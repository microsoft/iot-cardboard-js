import { Pivot, PivotItem } from '@fluentui/react';
import React, { useContext, useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode
} from '../../../Models/Constants/Enums';
import ADT3DBuilderCard from '../../ADT3DBuilderCard/ADT3DBuilderCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    OnBehaviorSave,
    SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../../Models/Hooks/useAdapter';
import {
    DatasourceType,
    defaultBehavior,
    IBehavior,
    IScenesConfig,
    ITwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderReducer,
    ADT3DSceneBuilderLeftPanelReducer,
    defaultADT3DSceneBuilderState,
    defaultADT3DSceneBuilderLeftPanelState
} from './ADT3DSceneBuilder.state';
import { IADTAdapter } from '../../../Models/Constants/Interfaces';
import SceneElementForm from './Components/Elements/ElementForm';
import { ColoredMeshItem } from '../../../Models/Classes/SceneView.types';
import SceneBehaviors from './Components/Behaviors/Behaviors';
import SceneBehaviorsForm from './Components/Behaviors/BehaviorsForm';
import SceneElements from './Components/Elements/Elements';

export const SceneBuilderContext = React.createContext<I3DSceneBuilderContext>(
    null
);

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = ({
    sceneId,
    adapter,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    const setSelectedMeshIds = (selectedMeshIds) => {
        dispatch({
            type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
            payload: selectedMeshIds
        });
    };

    const setColoredMeshItems = (coloredMeshItems) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS,
            payload: coloredMeshItems
        });
    };

    const getScenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        if (!getScenesConfig.adapterResult.hasNoData()) {
            const config: IScenesConfig = getScenesConfig.adapterResult.getData();
            dispatch({
                type: SET_ADT_SCENE_CONFIG,
                payload: config
            });
        } else {
            dispatch({
                type: SET_ADT_SCENE_CONFIG,
                payload: null
            });
        }
    }, [getScenesConfig?.adapterResult]);

    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                theme,
                locale,
                localeStrings,
                selectedMeshIds: state.selectedMeshIds,
                coloredMeshItems: state.coloredMeshItems,
                setColoredMeshItems,
                setSelectedMeshIds,
                config: state.config,
                getConfig: getScenesConfig.callAdapter,
                sceneId
            }}
        >
            <div className="cb-scene-builder-card-wrapper">
                <BaseCompositeCard
                    isLoading={!state.config && getScenesConfig.isLoading}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    adapterAdditionalParameters={adapterAdditionalParameters}
                >
                    <div className="cb-scene-builder-left-panel">
                        <BuilderLeftPanel />
                    </div>
                    <div className="cb-scene-builder-canvas">
                        {state.config && (
                            <ADT3DBuilderCard
                                adapter={adapter as IADTAdapter}
                                modelUrl={
                                    state.config.viewerConfiguration?.scenes[
                                        state.config.viewerConfiguration?.scenes.findIndex(
                                            (s) => s.id === sceneId
                                        )
                                    ].assets[0].url
                                }
                                onMeshSelected={(selectedMeshes) =>
                                    setSelectedMeshIds(selectedMeshes)
                                }
                                coloredMeshItems={state.coloredMeshItems}
                                preselectedMeshIds={state.selectedMeshIds}
                            />
                        )}
                    </div>
                </BaseCompositeCard>
            </div>
        </SceneBuilderContext.Provider>
    );
};

const BuilderLeftPanel: React.FC = () => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderLeftPanelReducer,
        defaultADT3DSceneBuilderLeftPanelState
    );

    const {
        config,
        getConfig,
        sceneId,
        setSelectedMeshIds,
        setColoredMeshItems,
        coloredMeshItems,
        theme,
        locale,
        localeStrings,
        adapter
    } = useContext(SceneBuilderContext);

    const addBehaviorAdapterData = useAdapter({
        adapterMethod: (params: { behavior: IBehavior }) =>
            adapter.addBehavior(config, sceneId, params.behavior),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const editBehaviorAdapterData = useAdapter({
        adapterMethod: (params: {
            behavior: IBehavior;
            originalBehaviorId: string;
        }) =>
            adapter.editBehavior(
                config,
                params.behavior,
                params.originalBehaviorId
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // START of scene element related callbacks
    const onCreateElementClick = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
            payload: null
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.CreateElement
        });
        setSelectedMeshIds([]);
    };

    const onRemoveElement = (newElements: Array<ITwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_ELEMENTS,
            payload: newElements
        });
        setSelectedMeshIds([]);
    };

    const onManageElements = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.TargetElements
        });
    };

    const onElementClick = (element: ITwinToObjectMapping) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
            payload: element
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditElement
        });
        setSelectedMeshIds(element.meshIDs);
        setColoredMeshItems([]);
    };

    const updateSelectedElements = (
        updatedElement: ITwinToObjectMapping,
        isSelected
    ) => {
        let selectedElements = state.selectedElements
            ? [...state.selectedElements]
            : [];

        // add element if selected and not in list
        if (
            isSelected &&
            !selectedElements.find((element) => element === updatedElement)
        ) {
            selectedElements.push(updatedElement);
        }

        // remove element if not selected and in list
        if (
            !isSelected &&
            selectedElements.find((element) => element === updatedElement)
        ) {
            selectedElements = selectedElements.filter(
                (element) => element !== updatedElement
            );
        }

        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: selectedElements
        });

        const coloredMeshes: ColoredMeshItem[] = [];
        for (const element of selectedElements) {
            for (const id of element.meshIDs) {
                const coloredMesh: ColoredMeshItem = {
                    meshId: id,
                    color: '#00A8F0'
                };
                coloredMeshes.push(coloredMesh);
            }
        }

        setColoredMeshItems(coloredMeshes);
    };

    const setSelectedElements = (elements: Array<ITwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: elements
        });

        const coloredMeshes: ColoredMeshItem[] = [];
        for (const element of elements) {
            for (const id of element.meshIDs) {
                const coloredMesh: ColoredMeshItem = {
                    meshId: id,
                    color: '#00A8F0'
                };
                coloredMeshes.push(coloredMesh);
            }
        }

        setColoredMeshItems(coloredMeshes);
    };

    const clearSelectedElements = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: null
        });

        setColoredMeshItems([]);
    };

    const onElementEnter = (element: ITwinToObjectMapping) => {
        const meshItems = [...coloredMeshItems];
        if (
            (state.selectedElements &&
                !state.selectedElements.find((item) => item === element)) ||
            !state.selectedElements
        ) {
            for (const id of element.meshIDs) {
                if (!meshItems.find((mesh) => mesh.meshId === id)) {
                    const coloredMesh: ColoredMeshItem = {
                        meshId: id,
                        color: '#00A8F0'
                    };
                    meshItems.push(coloredMesh);
                }
            }
        }
        setColoredMeshItems(meshItems);
    };

    const onElementLeave = (element: ITwinToObjectMapping) => {
        if (state.selectedElements && state.selectedElements.length > 0) {
            let meshItems = [...coloredMeshItems];
            if (!state.selectedElements.find((item) => item === element)) {
                for (const id of element.meshIDs) {
                    meshItems = meshItems.filter((item) => item.meshId !== id);
                }

                setColoredMeshItems(meshItems);
            }
        } else {
            setColoredMeshItems([]);
        }
    };

    const onBackClick = (
        idleMode: ADT3DSceneBuilderMode = ADT3DSceneBuilderMode.ElementsIdle
    ) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: idleMode
        });
        setSelectedMeshIds([]);
    };

    const onElementSave = (newElements: Array<ITwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_ELEMENTS,
            payload: newElements
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.ElementsIdle
        });
        setSelectedMeshIds([]);
    };
    // END of scene element related callbacks

    // START of behavior related callbacks
    const onCreateBehaviorClick = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.CreateBehavior
        });
        setSelectedMeshIds([]);
    };

    const onCreateBehaviorWithElements = async () => {
        const behavior = defaultBehavior;
        const mappingIds = [];
        state.selectedElements.forEach((element) => {
            mappingIds.push(element.id);
        })
        behavior.id = t('3dSceneBuilder.newBehaviorId');
        behavior.datasources[0] = {type: DatasourceType.TwinToObjectMapping, mappingIDs: mappingIds};

        await addBehaviorAdapterData.callAdapter({
            behavior
        });

        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
            payload: behavior
        });

        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditBehavior
        });
        setSelectedMeshIds([]);
    };

    const onBehaviorSave: OnBehaviorSave = async (
        behavior,
        mode,
        originalBehaviorId
    ) => {
        if (mode === ADT3DSceneBuilderMode.CreateBehavior) {
            await addBehaviorAdapterData.callAdapter({
                behavior
            });
        }
        if (mode === ADT3DSceneBuilderMode.EditBehavior) {
            await editBehaviorAdapterData.callAdapter({
                behavior,
                originalBehaviorId
            });
        }
        getConfig();
    };

    const onElementsInBehaviorUpdated = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditBehavior
        });
    }

    const onBehaviorClick = (behavior: IBehavior) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
            payload: behavior
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditBehavior
        });
    };

    const setSelectedBehavior = (behavior: IBehavior) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
            payload: behavior
        });
    };
    // END of behavior related callbacks

    useEffect(() => {
        if (config) {
            const mappings =
                config.viewerConfiguration?.scenes?.find(
                    (s) => s.id === sceneId
                ).twinToObjectMappings || [];
            dispatch({
                type: SET_ADT_SCENE_BUILDER_ELEMENTS,
                payload: mappings
            });
        } else {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_ELEMENTS,
                payload: []
            });
        }
    }, [config]);

    const behaviors = config?.viewerConfiguration?.behaviors || [];

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            {(state.builderMode === ADT3DSceneBuilderMode.ElementsIdle ||
                state.builderMode === ADT3DSceneBuilderMode.BehaviorIdle) && (
                <Pivot
                    aria-label={t('3dScenePage.buildMode')}
                    selectedKey={state.selectedPivotTab}
                    onLinkClick={(item) => {
                        let activePivot = ADT3DSceneBuilderMode.ElementsIdle;
                        switch (item.props.itemKey) {
                            case ADT3DSceneTwinBindingsMode.Elements:
                                activePivot =
                                    ADT3DSceneBuilderMode.ElementsIdle;
                                break;
                            case ADT3DSceneTwinBindingsMode.Behaviors:
                                activePivot =
                                    ADT3DSceneBuilderMode.BehaviorIdle;
                                break;
                            default:
                                break;
                        }
                        dispatch({
                            type: SET_ADT_SCENE_BUILDER_MODE,
                            payload: activePivot
                        });
                    }}
                    className="cb-scene-builder-left-panel-pivot"
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.elements')}
                        itemKey={ADT3DSceneTwinBindingsMode.Elements}
                    >
                        <SceneElements
                            elements={state.elements}
                            selectedElements={state.selectedElements}
                            onCreateElementClick={onCreateElementClick}
                            onRemoveElement={onRemoveElement}
                            onElementClick={onElementClick}
                            onElementEnter={onElementEnter}
                            onElementLeave={onElementLeave}
                            updateSelectedElements={updateSelectedElements}
                            clearSelectedElements={clearSelectedElements}
                            onCreateBehaviorClick={onCreateBehaviorWithElements}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        itemKey={ADT3DSceneTwinBindingsMode.Behaviors}
                    >
                        <SceneBehaviors
                            behaviors={behaviors}
                            onBehaviorClick={onBehaviorClick}
                            onCreateBehaviorClick={onCreateBehaviorClick}
                        />
                    </PivotItem>
                </Pivot>
            )}
            {(state.builderMode === ADT3DSceneBuilderMode.CreateElement ||
                state.builderMode === ADT3DSceneBuilderMode.EditElement) && (
                <SceneElementForm
                    builderMode={state.builderMode}
                    selectedElement={state.selectedElement}
                    onElementBackClick={() =>
                        onBackClick(ADT3DSceneBuilderMode.ElementsIdle)
                    }
                    onElementSave={onElementSave}
                />
            )}
            {(state.builderMode === ADT3DSceneBuilderMode.CreateBehavior ||
                state.builderMode === ADT3DSceneBuilderMode.EditBehavior) && (
                <SceneBehaviorsForm
                    elements={state.elements}
                    builderMode={state.builderMode}
                    onBehaviorBackClick={() =>
                        onBackClick(ADT3DSceneBuilderMode.BehaviorIdle)
                    }
                    // pass in selectedBehavior as standard Object to allow React state usage and deep state updates
                    selectedBehavior={{ ...state.selectedBehavior }}
                    onBehaviorSave={onBehaviorSave}
                    setSelectedBehavior={setSelectedBehavior}
                    onManageElements={onManageElements}
                    setSelectedElements={setSelectedElements}
                />
            )}
            {state.builderMode === ADT3DSceneBuilderMode.TargetElements && (
                    <SceneElements
                        elements={state.elements}
                        selectedBehavior={{ ...state.selectedBehavior }}
                        selectedElements={state.selectedElements}
                        onCreateElementClick={onCreateElementClick}
                        onRemoveElement={onRemoveElement}
                        onElementClick={onElementClick}
                        onElementEnter={onElementEnter}
                        onElementLeave={onElementLeave}
                        updateSelectedElements={updateSelectedElements}
                        clearSelectedElements={clearSelectedElements}
                        isEditBehavior={true}
                        onElementsInBehaviorUpdated={onElementsInBehaviorUpdated}
                />
            )}
        </BaseComponent>
    );
};

export default React.memo(ADT3DSceneBuilder);
