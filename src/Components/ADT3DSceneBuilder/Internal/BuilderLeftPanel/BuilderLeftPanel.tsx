import {
    classNamesFunction,
    Pivot,
    PivotItem,
    styled,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode
} from '../../../../Models/Constants/Enums';
import {
    OnBehaviorSave,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS,
    SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS
} from '../../ADT3DSceneBuilder.types';
import '../../ADT3DSceneBuilder.scss';
import BaseComponent from '../../../BaseComponent/BaseComponent';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import {
    DatasourceType,
    defaultBehavior,
    getDefaultElement
} from '../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import SceneBehaviors from '../Behaviors/Behaviors';
import BehaviorsForm from '../Behaviors/BehaviorsForm';
import ElementForm from '../Elements/ElementForm';
import SceneElements from '../Elements/Elements';
import SceneBreadcrumbFactory from '../../../SceneBreadcrumb/SceneBreadcrumbFactory';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { createCustomMeshItems } from '../../../3DV/SceneView.Utils';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    createGUID,
    deepCopy,
    getDebugLogger
} from '../../../../Models/Services/Utils';
import { ElementModes } from '../../../../Models/Constants/Breadcrumb';
import {
    IBuilderLeftPanelProps,
    IBuilderLeftPanelStyleProps,
    IBuilderLeftPanelStyles
} from './BuilderLeftPanel.types';
import { getStyles } from './BuilderLeftPanel.styles';
import { BreadcrumbAction } from '../../../SceneBreadcrumb/SceneBreadcrumb.types';
import UnsavedChangesDialog from '../UnsavedChangesDialog/UnsavedChangesDialog';

const debugLogging = false;
const logDebugConsole = getDebugLogger('BuilderLeftPanel', debugLogging);

const getClassNames = classNamesFunction<
    IBuilderLeftPanelStyleProps,
    IBuilderLeftPanelStyles
>();

const BuilderLeftPanel: React.FC<IBuilderLeftPanelProps> = ({ styles }) => {
    const { t } = useTranslation();

    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const {
        adapter,
        config,
        dispatch,
        getConfig,
        locale,
        localeStrings,
        objectColor,
        sceneId,
        setColoredMeshItems,
        setOutlinedMeshItems,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction,
        state,
        theme
    } = useContext(SceneBuilderContext);

    const isIdleMode =
        state.builderMode === ADT3DSceneBuilderMode.ElementsIdle ||
        state.builderMode === ADT3DSceneBuilderMode.BehaviorIdle;
    const isBehaviorFormMode =
        state.builderMode === ADT3DSceneBuilderMode.CreateBehavior ||
        state.builderMode === ADT3DSceneBuilderMode.EditBehavior;
    const isElementFormMode =
        state.builderMode === ADT3DSceneBuilderMode.CreateElement ||
        state.builderMode === ADT3DSceneBuilderMode.EditElement;

    const sceneName = ViewerConfigUtility.getSceneById(config, sceneId)
        ?.displayName;

    const addBehaviorToSceneAdapterData = useAdapter({
        adapterMethod: (params: { behavior: IBehavior }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.addBehaviorToScene(
                    config,
                    sceneId,
                    params.behavior,
                    false
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

    const updateBehaviorAndElementsAdapterData = useAdapter({
        adapterMethod: (params: {
            config: I3DScenesConfig;
            mode: ADT3DSceneBuilderMode;
            behavior: IBehavior;
            selectedLayerIds: string[];
            selectedElements: Array<ITwinToObjectMapping>; // update selected elements for behavior (e.g. in case twin aliases are changed)
            removedElements: Array<ITwinToObjectMapping>;
        }) => {
            let updatedConfigWithBehavior: I3DScenesConfig;
            if (params.mode === ADT3DSceneBuilderMode.CreateBehavior) {
                updatedConfigWithBehavior = ViewerConfigUtility.addBehavior(
                    params.config,
                    sceneId,
                    params.behavior,
                    params.selectedLayerIds
                );
            } else if (params.mode === ADT3DSceneBuilderMode.EditBehavior) {
                updatedConfigWithBehavior = ViewerConfigUtility.editBehavior(
                    params.config,
                    params.behavior,
                    params.selectedLayerIds,
                    params.removedElements
                );
            } else {
                updatedConfigWithBehavior = params.config;
            }
            updatedConfigWithBehavior = ViewerConfigUtility.updateElementsInScene(
                updatedConfigWithBehavior,
                sceneId,
                params.selectedElements
            );
            return adapter.putScenesConfig(updatedConfigWithBehavior);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const setSceneMode = useCallback(
        (mode: ADT3DSceneBuilderMode) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_MODE,
                payload: mode
            });
        },
        [dispatch]
    );

    // START of scene element related callbacks
    const setSelectedElement = useCallback(
        (element: ITwinToObjectMapping) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
                payload: element
            });
        },
        [dispatch]
    );

    const onCreateElementClick = useCallback(() => {
        setSelectedElement(getDefaultElement({ id: createGUID() }));
        setSceneMode(ADT3DSceneBuilderMode.CreateElement);
        setColoredMeshItems([]);
    }, [setColoredMeshItems, setSceneMode, setSelectedElement]);

    const onRemoveElement = useCallback(
        (newElements: Array<ITwinToObjectMapping>) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_ELEMENTS,
                payload: newElements
            });
            setColoredMeshItems([]);
            getConfig();
        },
        [dispatch, getConfig, setColoredMeshItems]
    );

    const onElementClick = useCallback(
        (element: ITwinToObjectMapping) => {
            setSelectedElement(element);
            setSceneMode(ADT3DSceneBuilderMode.EditElement);

            setColoredMeshItems(createCustomMeshItems(element.objectIDs, null));
        },
        [setColoredMeshItems, setSceneMode, setSelectedElement]
    );

    const updateSelectedElements = useCallback(
        (updatedElement: ITwinToObjectMapping, isSelected: boolean) => {
            let selectedElements = state.selectedElements
                ? deepCopy(state.selectedElements)
                : [];
            let removedElements = state.removedElements
                ? deepCopy(state.removedElements)
                : [];

            // add element if selected and not in list
            if (
                isSelected &&
                !selectedElements.find(
                    (element) => element.id === updatedElement.id
                )
            ) {
                selectedElements.push(updatedElement);
                // Filter out from removed elements if re-selected
                removedElements = removedElements.filter(
                    (element) => element.id !== updatedElement.id
                );
            }

            // remove element if not selected and in list
            if (
                !isSelected &&
                selectedElements.find(
                    (element) => element.id === updatedElement.id
                )
            ) {
                removedElements.push(updatedElement);
                selectedElements = selectedElements.filter(
                    (element) => element.id !== updatedElement.id
                );
            }

            dispatch({
                type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
                payload: selectedElements
            });

            dispatch({
                type: SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS,
                payload: removedElements
            });

            const meshIds = [];
            for (const element of selectedElements) {
                for (const id of element.objectIDs) {
                    meshIds.push(id);
                }
            }

            setOutlinedMeshItems(
                createCustomMeshItems(
                    meshIds,
                    objectColor.outlinedMeshSelectedColor
                )
            );
        },
        [
            dispatch,
            objectColor.outlinedMeshSelectedColor,
            setOutlinedMeshItems,
            state.removedElements,
            state.selectedElements
        ]
    );

    const setSelectedElements = useCallback(
        (elements: Array<ITwinToObjectMapping>) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
                payload: elements
            });

            const meshIds = [];
            for (const element of elements) {
                for (const id of element.objectIDs) {
                    meshIds.push(id);
                }
            }
        },
        [dispatch]
    );

    const clearSelectedElements = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
            payload: null
        });

        setOutlinedMeshItems([]);
    };

    const onBackClick = useCallback(
        (
            idleMode: ADT3DSceneBuilderMode = ADT3DSceneBuilderMode.ElementsIdle
        ) => {
            setSceneMode(idleMode);
            setColoredMeshItems([]);
        },
        [setColoredMeshItems, setSceneMode]
    );

    const onElementSave = async (newElements: Array<ITwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_ELEMENTS,
            payload: newElements
        });
        setSceneMode(ADT3DSceneBuilderMode.ElementsIdle);
        setColoredMeshItems([]);
    };
    // END of scene element related callbacks

    // START of behavior related callbacks

    const setSelectedBehavior = useCallback(
        (behavior: IBehavior) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
                payload: behavior
            });
        },
        [dispatch]
    );

    const onCreateBehaviorClick = () => {
        setSceneMode(ADT3DSceneBuilderMode.CreateBehavior);
        setColoredMeshItems([]);
        setSelectedBehavior({ ...defaultBehavior, id: createGUID() });
    };

    const onCreateBehaviorWithElements = (
        preSearchedBehaviorName: string,
        newElement?: ITwinToObjectMapping
    ) => {
        const behavior = {
            ...defaultBehavior,
            id: createGUID(),
            ...(preSearchedBehaviorName && {
                displayName: preSearchedBehaviorName
            })
        };
        const mappingIds = [];

        // Update selected elements with new element
        if (newElement) {
            updateSelectedElements(newElement, true);
        }

        const elementsToAssign = newElement
            ? [newElement]
            : state.selectedElements?.length > 0
            ? state.selectedElements
            : [state.selectedElement];
        elementsToAssign.forEach((element) => {
            mappingIds.push(element.id);
        });

        behavior.datasources[0] = {
            type: DatasourceType.ElementTwinToObjectMappingDataSource,
            elementIDs: mappingIds
        };

        setSelectedBehavior(behavior);
        setSceneMode(ADT3DSceneBuilderMode.CreateBehavior);
        setColoredMeshItems([]);
    };

    const onBehaviorSave: OnBehaviorSave = async (
        config,
        behavior,
        mode,
        selectedLayerIds,
        selectedElements, // passing this in case there is updated twin aliases in behavior
        removedElements
    ) => {
        await updateBehaviorAndElementsAdapterData.callAdapter({
            config,
            mode,
            behavior,
            selectedLayerIds,
            selectedElements,
            removedElements
        });
        getConfig();
    };

    const onBehaviorClick = (behavior: IBehavior) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
            payload: behavior
        });
        setSceneMode(ADT3DSceneBuilderMode.EditBehavior);
        setSelectedBehavior(behavior);
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

    const setPivotItem = (item: PivotItem) => {
        let activePivot = ADT3DSceneBuilderMode.ElementsIdle;
        switch (item.props.itemKey) {
            case ADT3DSceneTwinBindingsMode.Elements:
                activePivot = ADT3DSceneBuilderMode.ElementsIdle;
                break;
            case ADT3DSceneTwinBindingsMode.Behaviors:
                activePivot = ADT3DSceneBuilderMode.BehaviorIdle;
                break;
            default:
                break;
        }
        setSceneMode(activePivot);
    };

    // END of behavior related callbacks

    useEffect(() => {
        if (config) {
            const mappings =
                config.configuration?.scenes?.find((s) => s.id === sceneId)
                    ?.elements || [];
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
    }, [config, dispatch, sceneId]);

    // Get behaviors in active scene
    const behaviors = config?.configuration?.behaviors || [];

    // Callback for breadcrumb depending if builder is in behavior or element mode
    const onSceneClick = useCallback(() => {
        if (ElementModes.includes(state.builderMode)) {
            onBackClick(ADT3DSceneBuilderMode.ElementsIdle);
            setSelectedElements([]);
        } else {
            onBackClick(ADT3DSceneBuilderMode.BehaviorIdle);
        }
    }, [onBackClick, setSelectedElements, state.builderMode]);

    const onBehaviorBackClick = useCallback(
        () => onBackClick(ADT3DSceneBuilderMode.BehaviorIdle),
        [onBackClick]
    );

    const onDiscardChangesClick = useCallback(() => {
        setUnsavedBehaviorChangesDialogOpen(false);
        if (state.unsavedChangesDialogDiscardAction) {
            state.unsavedChangesDialogDiscardAction();
        }
    }, [setUnsavedBehaviorChangesDialogOpen, state]);

    const onBreadcrumbNavigate = useCallback(
        (action: BreadcrumbAction, navigate: () => void) => {
            logDebugConsole(
                'debug',
                `[START] pre-breadcrumb navigation of action ${action}`
            );
            // check if we should interupt the navigation flow
            let shouldNavigate = true;
            const actions: BreadcrumbAction[] = ['goToHome', 'goToScene'];
            if (actions.includes(action)) {
                if (isBehaviorFormMode) {
                    const isDirty = state.formDirtyState.get('behavior');
                    if (isDirty) {
                        logDebugConsole(
                            'debug',
                            'Behavior form is dirty. Showing confirmation dialog.'
                        );
                        setUnsavedBehaviorChangesDialogOpen(true);
                        setUnsavedChangesDialogDiscardAction(() => {
                            navigate();
                        });
                        shouldNavigate = false;
                    }
                } else if (isElementFormMode) {
                    const isDirty = state.formDirtyState.get('element');
                    if (isDirty) {
                        logDebugConsole(
                            'debug',
                            'Element form is dirty. Showing confirmation dialog.'
                        );
                        setUnsavedBehaviorChangesDialogOpen(true);
                        setUnsavedChangesDialogDiscardAction(() => {
                            navigate();
                        });
                        shouldNavigate = false;
                    }
                }
            }
            logDebugConsole(
                'debug',
                `[END] pre-breadcrumb navigation of action ${action}. {ShouldNavigate}.`,
                shouldNavigate
            );
            if (shouldNavigate) {
                navigate();
            }
        },
        [
            isBehaviorFormMode,
            isElementFormMode,
            setUnsavedBehaviorChangesDialogOpen,
            setUnsavedChangesDialogDiscardAction,
            state.formDirtyState
        ]
    );

    // clear the dialog state when switching to the forms
    useEffect(() => {
        if (isElementFormMode || isBehaviorFormMode) {
            setUnsavedBehaviorChangesDialogOpen(false);
            setUnsavedChangesDialogDiscardAction(undefined);
        }
    }, [
        isElementFormMode,
        isBehaviorFormMode,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction
    ]);

    logDebugConsole('debug', 'Render');
    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            containerClassName={classNames.root}
            disableDefaultStyles
        >
            <SceneBreadcrumbFactory
                sceneName={sceneName}
                sceneId={sceneId}
                builderMode={state.builderMode}
                onSceneClick={onSceneClick}
                onNavigate={onBreadcrumbNavigate}
            />
            {isIdleMode && (
                <Pivot
                    aria-label={t('3dScenePage.buildMode')}
                    selectedKey={state.selectedPivotTab}
                    onLinkClick={setPivotItem}
                    className="cb-scene-builder-left-panel-pivot"
                    styles={{ root: { marginBottom: 16, padding: '0px 16px' } }}
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.elements')}
                        itemKey={ADT3DSceneTwinBindingsMode.Elements}
                        style={{ width: '100%' }}
                    >
                        <SceneElements
                            elements={state.elements}
                            selectedElements={state.selectedElements}
                            onCreateElementClick={onCreateElementClick}
                            onRemoveElement={onRemoveElement}
                            onElementClick={onElementClick}
                            updateSelectedElements={updateSelectedElements}
                            clearSelectedElements={clearSelectedElements}
                            onCreateBehaviorClick={onCreateBehaviorWithElements}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        itemKey={ADT3DSceneTwinBindingsMode.Behaviors}
                        data-testid="3dScene.panelPivot.behaviorsTab"
                        style={{ width: '100%' }}
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
            {isElementFormMode && (
                <ElementForm
                    builderMode={state.builderMode}
                    onElementBackClick={() =>
                        onBackClick(ADT3DSceneBuilderMode.ElementsIdle)
                    }
                    onElementSave={onElementSave}
                    onBehaviorClick={onBehaviorClick}
                    onCreateBehaviorWithElements={onCreateBehaviorWithElements}
                />
            )}
            {isBehaviorFormMode && (
                <BehaviorsForm
                    behaviors={behaviors}
                    builderMode={state.builderMode}
                    elements={state.elements}
                    onBehaviorBackClick={onBehaviorBackClick}
                    onBehaviorSave={onBehaviorSave}
                    onElementClick={onElementClick}
                    onRemoveElement={onRemoveElement}
                    removedElements={state.removedElements}
                    selectedElements={state.selectedElements}
                    setSelectedElements={setSelectedElements}
                    updateSelectedElements={updateSelectedElements}
                />
            )}
            <UnsavedChangesDialog
                isOpen={state.unsavedBehaviorDialogOpen}
                onConfirmDiscard={onDiscardChangesClick}
                onClose={() => setUnsavedBehaviorChangesDialogOpen(false)}
            />
        </BaseComponent>
    );
};

export default styled<
    IBuilderLeftPanelProps,
    IBuilderLeftPanelStyleProps,
    IBuilderLeftPanelStyles
>(BuilderLeftPanel, getStyles);
