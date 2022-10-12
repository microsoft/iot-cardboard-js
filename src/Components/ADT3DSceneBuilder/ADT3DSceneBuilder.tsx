import {
    classNamesFunction,
    ContextualMenu,
    ContextualMenuItemType,
    css,
    IContextualMenuItem,
    mergeStyleSets,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';
import {
    ADT3DSceneBuilderMode,
    ADT3DScenePageModes,
    BehaviorModalMode,
    VisualRuleFormMode
} from '../../Models/Constants/Enums';
import ADT3DBuilder from '../ADT3DBuilder/ADT3DBuilder';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    IContextMenuProps,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
    SET_ADT_SCENE_OBJECT_COLOR,
    SET_IS_LAYER_BUILDER_DIALOG_OPEN,
    SET_REVERT_TO_HOVER_COLOR,
    SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO,
    SET_ELEMENT_TWIN_ALIAS_FORM_INFO,
    SET_WIDGET_FORM_INFO,
    BehaviorTwinAliasFormInfo,
    WidgetFormInfo,
    ElementTwinAliasFormInfo,
    IADT3DSceneBuilderStyleProps,
    IADT3DSceneBuilderStyles,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION,
    SET_GIZMO_ELEMENT_ITEM,
    SET_GIZMO_TRANSFORM_ITEM,
    SET_VISUAL_RULE_ACTIVE_MODE
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    ADT3DSceneBuilderReducer,
    defaultADT3DSceneBuilderState
} from './ADT3DSceneBuilder.state';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BuilderLeftPanel from './Internal/BuilderLeftPanel/BuilderLeftPanel';
import { useTranslation } from 'react-i18next';
import { AbstractMesh } from '@babylonjs/core';
import {
    CustomMeshItem,
    TransformedElementItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { createCustomMeshItems } from '../3DV/SceneView.Utils';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    createGUID,
    deepCopy,
    getDebugLogger
} from '../../Models/Services/Utils';
import {
    DatasourceType,
    defaultBehavior,
    getDefaultElement
} from '../../Models/Classes/3DVConfig';
import { IADTObjectColor } from '../../Models/Constants';
import { getLeftPanelStyles } from './Internal/Shared/LeftPanel.styles';
import BehaviorsModal from '../BehaviorsModal/BehaviorsModal';
import FloatingScenePageModeToggle from '../../Pages/ADT3DScenePage/Internal/FloatingScenePageModeToggle';
import {
    DeeplinkContextProvider,
    useDeeplinkContext
} from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import { getStyles } from './ADT3DSceneBuilder.styles';
import SceneLayers from './Internal/SceneLayers/SceneLayers';
import { SceneThemeContextProvider } from '../../Models/Context';
import {
    SceneViewContextProvider,
    useSceneViewContext
} from '../../Models/Context/SceneViewContext/SceneViewContext';
import { SceneViewContextActionType } from '../../Models/Context/SceneViewContext/SceneViewContext.types';
import SceneThemePicker from '../ModelViewerModePicker/SceneThemePicker';
import SceneRefreshConfigurator from '../SceneRefreshConfigurator/SceneRefreshConfigurator';

const contextMenuStyles = mergeStyleSets({
    header: {
        marginLeft: -25,
        marginTop: -4,
        marginBottom: -4
    }
});

export const SceneBuilderContext = React.createContext<I3DSceneBuilderContext>(
    null
);

const getClassNames = classNamesFunction<
    IADT3DSceneBuilderStyleProps,
    IADT3DSceneBuilderStyles
>();

const debugLogging = false;
const logDebugConsole = getDebugLogger('ADT3DSceneBuilder', debugLogging);

const ADT3DSceneBuilderBase: React.FC<IADT3DSceneBuilderCardProps> = (
    props
) => {
    const {
        adapter,
        locale,
        localeStrings,
        sceneId,
        sceneViewProps,
        showModeToggle = false,
        styles,
        theme
    } = props;

    // hooks
    const { t } = useTranslation();
    const { deeplinkState, deeplinkDispatch } = useDeeplinkContext();
    const { sceneViewDispatch } = useSceneViewContext();
    const fluentTheme = useTheme();
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    // styles
    const classNames = getClassNames(styles, { theme: fluentTheme });

    // state
    const previouslyColoredMeshItems = useRef([]);
    const elementContextualMenuItems = useRef([]);
    const behaviorContextualMenuItems = useRef<IContextualMenuItem[]>([]);

    const [
        contextualMenuProps,
        setContextualMenuProps
    ] = useState<IContextMenuProps>({
        isVisible: false,
        x: 0,
        y: 0,
        items: elementContextualMenuItems.current
    });

    useEffect(() => {
        elementContextualMenuItems.current = [
            {
                key: t('3dSceneBuilder.elementActions'),
                itemType: ContextualMenuItemType.Header,
                text: t('3dSceneBuilder.elementActions'),
                className: contextMenuStyles.header
            },
            {
                key: t('3dSceneBuilder.elements'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: true,
                    bottomDivider: false,
                    items: []
                }
            },
            {
                key: t('3dSceneBuilder.actions'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: true,
                    bottomDivider: false,
                    items: [
                        {
                            key: t('3dSceneBuilder.createNewElementKey'),
                            text: t('3dSceneBuilder.createNewElement'),
                            iconProps: {
                                iconName: 'Add',
                                style: {
                                    fontSize: '14px',
                                    color: fluentTheme.semanticColors.bodyText
                                }
                            },
                            onClick: () => {
                                elementContextualMenuItems.current[1].sectionProps.items = [];
                                dispatch({
                                    type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
                                    payload: getDefaultElement({
                                        id: createGUID()
                                    })
                                });
                                dispatch({
                                    type: SET_ADT_SCENE_BUILDER_MODE,
                                    payload: ADT3DSceneBuilderMode.CreateElement
                                });
                            }
                        }
                    ]
                }
            }
        ];

        behaviorContextualMenuItems.current = [
            {
                key: t('3dSceneBuilder.behaviorActions'),
                itemType: ContextualMenuItemType.Header,
                text: t('3dSceneBuilder.behaviorActions'),
                className: contextMenuStyles.header
            },
            {
                key: t('3dSceneBuilder.behaviors'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: true,
                    bottomDivider: false,
                    items: []
                }
            },
            {
                key: t('3dSceneBuilder.actions'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: true,
                    bottomDivider: false,
                    items: []
                }
            }
        ];
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (state.builderMode === ADT3DSceneBuilderMode.ElementsIdle) {
            dispatch({
                type: SET_REVERT_TO_HOVER_COLOR,
                payload: false
            });
        } else {
            dispatch({
                type: SET_REVERT_TO_HOVER_COLOR,
                payload: true
            });
        }
    }, [state.builderMode]);

    const setUnsavedChangesDialogDiscardAction = useCallback(
        (action: VoidFunction) => {
            dispatch({
                type: SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION,
                payload: action
            });
        },
        []
    );

    const setUnsavedBehaviorChangesDialogOpen = useCallback(
        (isOpen: boolean) => {
            dispatch({
                type: SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN,
                payload: isOpen
            });
        },
        []
    );

    const setColoredMeshItems = useCallback(
        (coloredMeshItems: Array<CustomMeshItem>) => {
            dispatch({
                type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
                payload: coloredMeshItems
            });
        },
        []
    );

    const setGizmoElementItem = useCallback(
        (gizmoElementItem: TransformedElementItem) => {
            dispatch({
                type: SET_GIZMO_ELEMENT_ITEM,
                payload: gizmoElementItem
            });
        },
        []
    );

    const setGizmoTransformItem = useCallback(
        (gizmoTransformItem: TransformInfo) => {
            dispatch({
                type: SET_GIZMO_TRANSFORM_ITEM,
                payload: gizmoTransformItem
            });
        },
        []
    );

    const setWidgetFormInfo = useCallback((widgetFormInfo: WidgetFormInfo) => {
        dispatch({
            type: SET_WIDGET_FORM_INFO,
            payload: widgetFormInfo
        });
    }, []);

    const setVisualRuleFormMode = useCallback(
        (visualRuleMode: VisualRuleFormMode) => {
            dispatch({
                type: SET_VISUAL_RULE_ACTIVE_MODE,
                payload: visualRuleMode
            });
        },
        []
    );

    const setBehaviorTwinAliasFormInfo = useCallback(
        (behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo) => {
            dispatch({
                type: SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO,
                payload: behaviorTwinAliasFormInfo
            });
        },
        []
    );

    const setElementTwinAliasFormInfo = useCallback(
        (elementTwinAliasFormInfo: ElementTwinAliasFormInfo) => {
            dispatch({
                type: SET_ELEMENT_TWIN_ALIAS_FORM_INFO,
                payload: elementTwinAliasFormInfo
            });
        },
        []
    );

    const setIsLayerBuilderDialogOpen = useCallback(
        (
            isOpen: boolean,
            behaviorId?: string,
            onFocusDismiss?: (layerId: string) => void
        ) => {
            dispatch({
                type: SET_IS_LAYER_BUILDER_DIALOG_OPEN,
                payload: {
                    isOpen,
                    behaviorId: behaviorId,
                    onFocusDismiss
                }
            });
        },
        []
    );

    const getScenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        if (!getScenesConfig.adapterResult.hasNoData()) {
            const config: I3DScenesConfig = getScenesConfig.adapterResult.getData();
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

    // viewer callbacks
    const meshHoverOnBehaviorsIdle = (mesh: AbstractMesh) => {
        if (!contextualMenuProps.isVisible) {
            if (mesh) {
                sceneViewDispatch({
                    type: SceneViewContextActionType.OUTLINE_ELEMENT_MESHES,
                    payload: {
                        elements: state.elements,
                        meshId: mesh.id,
                        color: state.objectColor.outlinedMeshHoverColor
                    }
                });
            } else {
                sceneViewDispatch({
                    type: SceneViewContextActionType.RESET_OUTLINED_MESHES
                });
            }
        }
    };

    const meshHoverOnElementsIdle = (mesh: AbstractMesh) => {
        let coloredMeshes = [];
        const meshIds = [];
        if (mesh && !contextualMenuProps.isVisible) {
            if (state?.elements?.length > 0) {
                for (const element of state.elements) {
                    // find elements that contain this mesh
                    if (element.objectIDs.includes(mesh.id)) {
                        for (const id of element.objectIDs) {
                            // set mesh color for mesh that is hovered
                            if (
                                id === mesh.id &&
                                !coloredMeshes.find((m) => m.meshId === mesh.id)
                            ) {
                                coloredMeshes.push({
                                    meshId: id,
                                    color: state.objectColor.meshHoverColor
                                });
                            }
                            // add all element meshes to highlight
                            meshIds.push(id);
                        }
                    } else {
                        if (!coloredMeshes.find((m) => m.meshId === mesh.id)) {
                            // if mesh is not in an element just color it
                            coloredMeshes.push({
                                meshId: mesh.id,
                                color: state.objectColor.meshHoverColor
                            });
                        }
                    }
                }
            } else {
                coloredMeshes.push({
                    meshId: mesh.id,
                    color: state.objectColor.meshHoverColor
                });
            }
        } else if (contextualMenuProps.isVisible) {
            coloredMeshes = previouslyColoredMeshItems.current;
        }

        sceneViewDispatch({
            type: SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES,
            payload: {
                meshIds: meshIds,
                color: state.objectColor.outlinedMeshHoverColor
            }
        });
        setColoredMeshItems(coloredMeshes);
    };

    const meshClickOnBehaviorsIdle = useCallback(
        (mesh: AbstractMesh, e: PointerEvent) => {
            let outlinedElements = [];
            const elements: ITwinToObjectMapping[] = [];
            // clear context menu
            behaviorContextualMenuItems.current[1].sectionProps.items = [];
            behaviorContextualMenuItems.current[2].sectionProps.items = [];
            for (const element of state.elements) {
                // find elements that contain this mesh
                if (element.objectIDs.includes(mesh.id)) {
                    elements.push(element);
                    // color any meshes that are in the elements
                    outlinedElements = outlinedElements.concat(
                        createCustomMeshItems(
                            element.objectIDs,
                            state.objectColor.outlinedMeshSelectedColor
                        )
                    );
                }
            }

            if (outlinedElements.length > 0) {
                // See if this makes sense or if it is better to have a setter
                sceneViewDispatch({
                    type: SceneViewContextActionType.RESET_OUTLINED_MESHES,
                    payload: {
                        outlinedMeshItems: outlinedElements
                    }
                });
                previouslyColoredMeshItems.current = outlinedElements;
            } else {
                sceneViewDispatch({
                    type: SceneViewContextActionType.RESET_OUTLINED_MESHES
                });
            }

            let behaviors: IBehavior[] = [];
            // get behaviors that contain any of the elements
            for (const element of elements) {
                const behavior = ViewerConfigUtility.getBehaviorsOnElement(
                    element?.id,
                    state.config?.configuration?.behaviors
                );
                if (behavior) {
                    behaviors = behaviors.concat(behavior);
                }
            }

            // create edit behavior items for the context menu
            for (const behavior of behaviors) {
                const item: IContextualMenuItem = {
                    key: behavior.id,
                    text: t('3dSceneBuilder.edit', {
                        elementDisplayName: behavior.displayName
                    }),
                    iconProps: {
                        iconName: 'Edit',
                        style: {
                            fontSize: '14px',
                            color: fluentTheme.semanticColors.bodyText
                        }
                    },
                    onClick: () => {
                        behaviorContextualMenuItems.current[1].sectionProps.items = [];
                        behaviorContextualMenuItems.current[2].sectionProps.items = [];
                        dispatch({
                            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
                            payload: behavior
                        });
                        dispatch({
                            type: SET_ADT_SCENE_BUILDER_MODE,
                            payload: ADT3DSceneBuilderMode.EditBehavior
                        });
                    },
                    onMouseOver: () => {
                        // Grab the selected elements from behavior and outline the meshes from them
                        sceneViewDispatch({
                            type:
                                SceneViewContextActionType.OUTLINE_BEHAVIOR_MESHES,
                            payload: {
                                behavior: behavior,
                                elements: state.elements,
                                color:
                                    state.objectColor.outlinedMeshSelectedColor
                            }
                        });
                    },
                    onMouseOut: () => {
                        // rest highlight and mesh colorings
                        sceneViewDispatch({
                            type:
                                SceneViewContextActionType.RESET_OUTLINED_MESHES,
                            payload: {
                                outlinedMeshItems:
                                    previouslyColoredMeshItems.current
                            }
                        });
                    }
                };

                // add edit behavior context menu items to the correct section
                addContextualMenuItems(
                    item,
                    behaviorContextualMenuItems.current[1]
                );
            }

            // loop through elements that contain the clicked mesh to create context menu items
            for (const element of elements) {
                const item = {
                    key: element.id,
                    text: t('3dSceneBuilder.createWithElement', {
                        element: element.displayName
                    }),
                    iconProps: {
                        iconName: 'Add',
                        style: {
                            fontSize: '14px',
                            color: fluentTheme.semanticColors.bodyText
                        }
                    },
                    onClick: () => {
                        behaviorContextualMenuItems.current[1].sectionProps.items = [];
                        behaviorContextualMenuItems.current[2].sectionProps.items = [];
                        sceneViewDispatch({
                            type:
                                SceneViewContextActionType.RESET_OUTLINED_MESHES
                        });
                        // create new behavior and set data scource to the selected element (need to clone if not the defualt behavior in
                        // memory is updated which causes bugs when creating new behaviors)
                        const newBehavior: IBehavior = {
                            ...deepCopy(defaultBehavior),
                            id: createGUID()
                        };
                        newBehavior.datasources[0] = {
                            type:
                                DatasourceType.ElementTwinToObjectMappingDataSource,
                            elementIDs: [element.id]
                        };
                        dispatch({
                            type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
                            payload: newBehavior
                        });
                        dispatch({
                            type: SET_ADT_SCENE_BUILDER_MODE,
                            payload: ADT3DSceneBuilderMode.CreateBehavior
                        });
                    },
                    onMouseOver: () => {
                        // highlight the hovered element
                        sceneViewDispatch({
                            type:
                                SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES,
                            payload: {
                                meshIds: element.objectIDs,
                                color: state.objectColor.outlinedMeshHoverColor
                            }
                        });
                    },
                    onMouseOut: () => {
                        sceneViewDispatch({
                            type:
                                SceneViewContextActionType.RESET_OUTLINED_MESHES,
                            payload: {
                                outlinedMeshItems:
                                    previouslyColoredMeshItems.current
                            }
                        });
                    }
                };

                // add create new behavior items to the context menu in the correct position
                addContextualMenuItems(
                    item,
                    behaviorContextualMenuItems.current[2]
                );
            }

            // only show the context menu on click if an element has been clicked
            if (elements.length > 0) {
                setContextualMenuProps({
                    isVisible: true,
                    x: e.offsetX,
                    y: e.offsetY,
                    items: behaviorContextualMenuItems.current
                });
            }
        },
        [
            fluentTheme.semanticColors.bodyText,
            sceneViewDispatch,
            state.config?.configuration?.behaviors,
            state.elements,
            state.objectColor.outlinedMeshHoverColor,
            state.objectColor.outlinedMeshSelectedColor,
            t
        ]
    );

    const meshClickOnElementsIdle = useCallback(
        (mesh: AbstractMesh, e: PointerEvent) => {
            elementContextualMenuItems.current[1].sectionProps.items = [];
            // find elements which contian the clicked mesh
            for (const element of state.elements) {
                if (element.objectIDs.includes(mesh.id)) {
                    // create context menu items for each element
                    const item = {
                        key: element.id,
                        text: t('3dSceneBuilder.edit', {
                            elementDisplayName: element.displayName
                        }),
                        iconProps: {
                            iconName: 'Edit',
                            style: {
                                fontSize: '14px',
                                color: fluentTheme.semanticColors.bodyText
                            }
                        },
                        onClick: () => {
                            elementContextualMenuItems.current[1].sectionProps.items = [];
                            dispatch({
                                type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
                                payload: element
                            });
                            dispatch({
                                type: SET_ADT_SCENE_BUILDER_MODE,
                                payload: ADT3DSceneBuilderMode.EditElement
                            });
                        },
                        onMouseOver: () => {
                            // highlight the hovered element
                            sceneViewDispatch({
                                type:
                                    SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES,
                                payload: {
                                    meshIds: element.objectIDs,
                                    color:
                                        state.objectColor.outlinedMeshHoverColor
                                }
                            });
                        },
                        onMouseOut: () => {
                            // TODO: Change this action to reset fill + outline
                            sceneViewDispatch({
                                type:
                                    SceneViewContextActionType.RESET_OUTLINED_MESHES
                            });
                            setColoredMeshItems(
                                previouslyColoredMeshItems.current
                            );
                        }
                    };

                    // add edit element items to the context menu in the correct position
                    addContextualMenuItems(
                        item,
                        elementContextualMenuItems.current[1]
                    );
                }
            }

            // colored the selected mesh
            const coloredMesh: CustomMeshItem = {
                meshId: mesh.id,
                color: null
            };
            setColoredMeshItems([coloredMesh]);
            sceneViewDispatch({
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES
            });
            previouslyColoredMeshItems.current = [coloredMesh];

            setContextualMenuProps({
                isVisible: true,
                x: e.offsetX,
                y: e.offsetY,
                items: elementContextualMenuItems.current
            });
        },
        [
            fluentTheme.semanticColors.bodyText,
            setColoredMeshItems,
            sceneViewDispatch,
            state.elements,
            state.objectColor.outlinedMeshHoverColor,
            t
        ]
    );

    const meshClickOnEditElement = useCallback(
        (mesh: AbstractMesh) => {
            const selectedMesh = state.coloredMeshItems.find(
                (item) => item.meshId === mesh.id
            );

            let coloredMeshes: CustomMeshItem[] = [];
            if (selectedMesh) {
                coloredMeshes = state.coloredMeshItems.filter(
                    (item) => item.meshId !== selectedMesh.meshId
                );
            } else {
                coloredMeshes = [
                    ...state.coloredMeshItems,
                    { meshId: mesh.id }
                ];
            }
            setColoredMeshItems(coloredMeshes);
        },
        [setColoredMeshItems, state.coloredMeshItems]
    );

    const addContextualMenuItems = (item, targetMenu) => {
        if (!targetMenu.sectionProps.items.find((ci) => ci.key === item.key)) {
            targetMenu.sectionProps.items.push(item);
        }
    };

    const onMeshClicked = useCallback(
        (mesh: AbstractMesh, e: PointerEvent) => {
            if (mesh) {
                switch (state.builderMode) {
                    case ADT3DSceneBuilderMode.ElementsIdle:
                        meshClickOnElementsIdle(mesh, e);
                        break;

                    case ADT3DSceneBuilderMode.EditElement:
                    case ADT3DSceneBuilderMode.CreateElement:
                        meshClickOnEditElement(mesh);
                        break;

                    case ADT3DSceneBuilderMode.BehaviorIdle:
                        meshClickOnBehaviorsIdle(mesh, e);
                        break;
                }
            } else {
                elementContextualMenuItems.current[1].sectionProps.items = [];
                if (
                    state.builderMode === ADT3DSceneBuilderMode.ElementsIdle ||
                    state.builderMode === ADT3DSceneBuilderMode.BehaviorIdle
                ) {
                    setColoredMeshItems([]);
                    // TODO: Change this to reset fill + outline mesh
                    sceneViewDispatch({
                        type: SceneViewContextActionType.RESET_OUTLINED_MESHES
                    });
                }
            }
        },
        [
            meshClickOnBehaviorsIdle,
            meshClickOnEditElement,
            meshClickOnElementsIdle,
            setColoredMeshItems,
            sceneViewDispatch,
            state.builderMode
        ]
    );

    const onMeshHovered = (mesh: AbstractMesh) => {
        switch (state.builderMode) {
            case ADT3DSceneBuilderMode.ElementsIdle:
                meshHoverOnElementsIdle(mesh);
                break;
            case ADT3DSceneBuilderMode.BehaviorIdle:
                meshHoverOnBehaviorsIdle(mesh);
                break;
        }
    };

    const objectColorUpdated = useCallback((objectColor: IADTObjectColor) => {
        dispatch({
            type: SET_ADT_SCENE_OBJECT_COLOR,
            payload: objectColor
        });
    }, []);

    const scenePageModeChange = useCallback(
        (newScenePageMode: ADT3DScenePageModes) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_MODE,
                payload: {
                    mode: newScenePageMode
                }
            });
        },
        [deeplinkDispatch]
    );

    // header callbacks
    const handleScenePageModeChange = useCallback(
        (newScenePageMode: ADT3DScenePageModes) => {
            const switchMode = () => {
                scenePageModeChange(newScenePageMode);
                dispatch({
                    type: SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
                    payload: null
                });
                dispatch({
                    type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
                    payload: null
                });
            };
            // handle forms with changes before transitioning
            if (
                state.formDirtyState.get('behavior') ||
                state.formDirtyState.get('element')
            ) {
                setUnsavedBehaviorChangesDialogOpen(true);
                setUnsavedChangesDialogDiscardAction(() => {
                    switchMode();
                });
            } else {
                switchMode();
            }
        },
        [
            scenePageModeChange,
            setUnsavedBehaviorChangesDialogOpen,
            setUnsavedChangesDialogDiscardAction,
            state.formDirtyState
        ]
    );

    const commonPanelStyles = getLeftPanelStyles(fluentTheme);

    logDebugConsole('debug', 'Render');
    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                behaviorTwinAliasFormInfo: state.behaviorTwinAliasFormInfo,
                coloredMeshItems: state.coloredMeshItems,
                config: state.config,
                dispatch,
                elementTwinAliasFormInfo: state.elementTwinAliasFormInfo,
                getConfig: getScenesConfig.callAdapter,
                locale,
                localeStrings,
                objectColor: state.objectColor,
                sceneId,
                setBehaviorTwinAliasFormInfo,
                setColoredMeshItems,
                setElementTwinAliasFormInfo,
                setGizmoElementItem,
                setGizmoTransformItem,
                setIsLayerBuilderDialogOpen,
                setUnsavedBehaviorChangesDialogOpen,
                setUnsavedChangesDialogDiscardAction,
                setVisualRuleFormMode,
                setWidgetFormInfo,
                state,
                theme,
                visualRuleFormMode: state.visualRuleFormMode,
                widgetFormInfo: state.widgetFormInfo
            }}
        >
            <BaseComponent
                isLoading={!state.config && getScenesConfig.isLoading}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                containerClassName={css(
                    classNames.root,
                    'cb-scene-builder-card-wrapper'
                )}
            >
                {state.config && <BuilderLeftPanel />}
                <div className={classNames.wrapper}>
                    {state.config && (
                        <ADT3DBuilder
                            objectColorUpdated={objectColorUpdated}
                            adapter={adapter as IADTAdapter}
                            modelUrl={
                                state.config.configuration?.scenes.find(
                                    (x) => x.id === sceneId
                                )?.assets[0].url
                            }
                            onMeshClicked={onMeshClicked}
                            onMeshHovered={onMeshHovered}
                            sceneViewProps={sceneViewProps}
                            gizmoElementItem={state.gizmoElementItem}
                            gizmoTransformItem={state.gizmoTransformItem}
                            showHoverOnSelected={state.showHoverOnSelected}
                            coloredMeshItems={state.coloredMeshItems}
                            showMeshesOnHover={state.enableHoverOnModel}
                        />
                    )}
                    {/* Mode & layers */}
                    <Stack
                        horizontal
                        styles={classNames.subComponentStyles.headerStack}
                        tokens={{ childrenGap: 8 }}
                    >
                        <SceneRefreshConfigurator
                            adapter={adapter}
                            config={state.config}
                            sceneId={sceneId}
                        />
                        <SceneThemePicker />
                        <SceneLayers />
                        {showModeToggle && (
                            <FloatingScenePageModeToggle
                                sceneId={sceneId}
                                handleScenePageModeChange={
                                    handleScenePageModeChange
                                }
                                selectedMode={deeplinkState.mode}
                            />
                        )}
                    </Stack>
                    {contextualMenuProps.isVisible && (
                        <div>
                            <div
                                id="cb-3d-builder-contextual-menu"
                                style={{
                                    left: contextualMenuProps.x,
                                    top: contextualMenuProps.y,
                                    position: 'absolute',
                                    width: '1px',
                                    height: '1px'
                                }}
                            />
                            <ContextualMenu
                                items={contextualMenuProps.items}
                                hidden={!contextualMenuProps.isVisible}
                                target="#cb-3d-builder-contextual-menu"
                                onDismiss={() =>
                                    setContextualMenuProps({
                                        isVisible: false,
                                        x: 0,
                                        y: 0,
                                        items: []
                                    })
                                }
                            />
                        </div>
                    )}
                    {/* Preview modal */}
                    {(state.builderMode ===
                        ADT3DSceneBuilderMode.CreateBehavior ||
                        state.builderMode ===
                            ADT3DSceneBuilderMode.EditBehavior) &&
                        state.draftBehavior &&
                        !state.isLayerBuilderDialogOpen &&
                        state.visualRuleFormMode ===
                            VisualRuleFormMode.Inactive && (
                            <div className={commonPanelStyles.previewContainer}>
                                <BehaviorsModal
                                    behaviors={[state.draftBehavior]}
                                    element={undefined}
                                    twins={null}
                                    mode={BehaviorModalMode.preview}
                                    activeWidgetId={
                                        state.widgetFormInfo.widgetId
                                    }
                                />
                            </div>
                        )}
                </div>
            </BaseComponent>
        </SceneBuilderContext.Provider>
    );
};

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = (props) => {
    return (
        <DeeplinkContextProvider>
            <SceneThemeContextProvider>
                <SceneViewContextProvider>
                    <ADT3DSceneBuilderBase {...props} />
                </SceneViewContextProvider>
            </SceneThemeContextProvider>
        </DeeplinkContextProvider>
    );
};

export default styled<
    IADT3DSceneBuilderCardProps,
    IADT3DSceneBuilderStyleProps,
    IADT3DSceneBuilderStyles
>(ADT3DSceneBuilder, getStyles);
