import { Pivot, PivotItem } from '@fluentui/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode
} from '../../../Models/Constants/Enums';
import {
    OnBehaviorSave,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS
} from '../ADT3DSceneBuilder.types';
import '../ADT3DSceneBuilder.scss';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../../Models/Hooks/useAdapter';
import {
    DatasourceType,
    defaultBehavior,
    IBehavior,
    ITwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import SceneBehaviors from '../Internal/Behaviors/Behaviors';
import SceneBehaviorsForm from '../Internal/Behaviors/BehaviorsForm';
import SceneElementForm from '../Internal/Elements/ElementForm';
import SceneElements from '../Internal/Elements/Elements';
import LeftPanelBuilderBreadcrumb from '../Internal/LeftPanelBuilderBreadcrumb';
import { SceneBuilderContext } from '../ADT3DSceneBuilder';

const BuilderLeftPanel: React.FC = () => {
    const { t } = useTranslation();

    const {
        config,
        getConfig,
        sceneId,
        setSelectedMeshIds,
        theme,
        locale,
        localeStrings,
        adapter,
        state,
        dispatch
    } = useContext(SceneBuilderContext);

    const addBehaviorAdapterData = useAdapter({
        adapterMethod: (params: { behavior: IBehavior }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.addBehavior(
                    config,
                    sceneId,
                    params.behavior
                )
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const addBehaviorToSceneAdapterData = useAdapter({
        adapterMethod: (params: { behavior: IBehavior }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.addBehaviorToScene(
                    config,
                    sceneId,
                    params.behavior
                )
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const editBehaviorAdapterData = useAdapter({
        adapterMethod: (params: {
            behavior: IBehavior;
            originalBehaviorId: string;
        }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.editBehavior(
                    config,
                    params.behavior,
                    params.originalBehaviorId
                )
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const deleteBehaviorAdapterData = useAdapter({
        adapterMethod: (params: {
            behaviorId: string;
            removeFromAllScenes?: boolean;
        }) => {
            return adapter.putScenesConfig(
                ViewerConfigUtility.deleteBehavior(
                    config,
                    sceneId,
                    params.behaviorId,
                    params.removeFromAllScenes
                )
            );
        },
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
            !selectedElements.find(
                (element) => element.id === updatedElement.id
            )
        ) {
            selectedElements.push(updatedElement);
        }

        // remove element if not selected and in list
        if (
            !isSelected &&
            selectedElements.find((element) => element.id === updatedElement.id)
        ) {
            selectedElements = selectedElements.filter(
                (element) => element.id !== updatedElement.id
            );
        }

        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: selectedElements
        });

        const meshIds = [];
        for (const element of selectedElements) {
            for (const id of element.meshIDs) {
                meshIds.push(id);
            }
        }
        setSelectedMeshIds(meshIds);
    };

    const setSelectedElements = (elements: Array<ITwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: elements
        });

        const meshIds = [];
        for (const element of elements) {
            for (const id of element.meshIDs) {
                meshIds.push(id);
            }
        }
        setSelectedMeshIds(meshIds);
    };

    const clearSelectedElements = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: null
        });

        setSelectedMeshIds([]);
    };

    const onElementEnter = (element: ITwinToObjectMapping) => {
        const meshIds = [...state.selectedMeshIds];
        if (
            (state.selectedElements &&
                !state.selectedElements.find(
                    (item) => item.id === element.id
                )) ||
            !state.selectedElements
        ) {
            for (const id of element.meshIDs) {
                if (!meshIds.find((meshId) => meshId === id)) {
                    meshIds.push(id);
                }
            }
        }
        setSelectedMeshIds(meshIds);
    };

    const onElementLeave = (element: ITwinToObjectMapping) => {
        if (state.selectedElements && state.selectedElements.length > 0) {
            let meshIds = [...state.selectedMeshIds];
            if (
                !state.selectedElements.find((item) => item.id === element.id)
            ) {
                for (const id of element.meshIDs) {
                    meshIds = meshIds.filter((meshId) => meshId !== id);
                }

                setSelectedMeshIds(meshIds);
            }
        } else {
            setSelectedMeshIds([]);
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

    const onCreateBehaviorWithElements = () => {
        const behavior = defaultBehavior;
        const mappingIds = [];
        const elementsToAssign =
            state.selectedElements?.length > 0
                ? state.selectedElements
                : [state.selectedElement];
        elementsToAssign.forEach((element) => {
            mappingIds.push(element.id);
        });

        behavior.datasources[0] = {
            type: DatasourceType.TwinToObjectMapping,
            mappingIDs: mappingIds
        };

        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
            payload: behavior
        });

        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.CreateBehavior
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

    const onRemoveBehaviorFromScene = async (
        behaviorId: string,
        removeFromAllScenes?: boolean
    ) => {
        await deleteBehaviorAdapterData.callAdapter({
            behaviorId,
            removeFromAllScenes
        });
        getConfig();
    };

    const onAddBehaviorToScene = async (behavior: IBehavior) => {
        await addBehaviorToSceneAdapterData.callAdapter({
            behavior
        });
        getConfig();
    };

    // END of behavior related callbacks

    useEffect(() => {
        if (config) {
            const mappings =
                config.viewerConfiguration?.scenes?.find(
                    (s) => s.id === sceneId
                )?.twinToObjectMappings || [];
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

    // Get behaviors in active scene
    const behaviors = useMemo(
        () => config?.viewerConfiguration?.behaviors || [],
        [config, sceneId]
    );

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            containerClassName="cb-scene-builder-left-panel"
        >
            <LeftPanelBuilderBreadcrumb
                builderMode={state.builderMode}
                onBehaviorsRootClick={() => {
                    onBackClick(ADT3DSceneBuilderMode.BehaviorIdle);
                    setSelectedElements([]);
                }}
                onElementsRootClick={() =>
                    onBackClick(ADT3DSceneBuilderMode.ElementsIdle)
                }
            />
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
                    styles={{ root: { marginBottom: 16 } }}
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
                        data-testid="3dScene.panelPivot.behaviorsTab"
                    >
                        <SceneBehaviors
                            behaviors={behaviors}
                            onBehaviorClick={onBehaviorClick}
                            onCreateBehaviorClick={onCreateBehaviorClick}
                            onRemoveBehaviorFromScene={
                                onRemoveBehaviorFromScene
                            }
                            onAddBehaviorToScene={onAddBehaviorToScene}
                        />
                    </PivotItem>
                </Pivot>
            )}
            {(state.builderMode === ADT3DSceneBuilderMode.CreateElement ||
                state.builderMode === ADT3DSceneBuilderMode.EditElement) && (
                <SceneElementForm
                    builderMode={state.builderMode}
                    behaviors={behaviors}
                    selectedElement={state.selectedElement}
                    onElementBackClick={() =>
                        onBackClick(ADT3DSceneBuilderMode.ElementsIdle)
                    }
                    onElementSave={onElementSave}
                    onBehaviorSave={onBehaviorSave}
                    onBehaviorClick={onBehaviorClick}
                    onCreateBehaviorWithElements={onCreateBehaviorWithElements}
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
                    selectedBehavior={state.selectedBehavior}
                    onBehaviorSave={onBehaviorSave}
                    selectedElements={state.selectedElements}
                    setSelectedElements={setSelectedElements}
                    onElementEnter={onElementEnter}
                    onElementLeave={onElementLeave}
                    updateSelectedElements={updateSelectedElements}
                />
            )}
        </BaseComponent>
    );
};

export default BuilderLeftPanel;
