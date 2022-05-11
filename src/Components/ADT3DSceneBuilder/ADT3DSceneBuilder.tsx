import {
    ContextualMenu,
    ContextualMenuItemType,
    mergeStyleSets,
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
    BehaviorModalMode
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
    SET_MESH_IDS_TO_OUTLINE,
    SET_REVERT_TO_HOVER_COLOR,
    SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO,
    SET_ELEMENT_TWIN_ALIAS_FORM_INFO,
    SET_WIDGET_FORM_INFO,
    BehaviorTwinAliasFormInfo,
    WidgetFormInfo,
    ElementTwinAliasFormInfo
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    ADT3DSceneBuilderReducer,
    defaultADT3DSceneBuilderState
} from './ADT3DSceneBuilder.state';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BuilderLeftPanel from './Internal/BuilderLeftPanel';
import { useTranslation } from 'react-i18next';
import { AbstractMesh } from '@babylonjs/core';
import { CustomMeshItem } from '../../Models/Classes/SceneView.types';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { createCustomMeshItems } from '../3DV/SceneView.Utils';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { createGUID, deepCopy } from '../../Models/Services/Utils';
import {
    DatasourceType,
    defaultBehavior
} from '../../Models/Classes/3DVConfig';
import { IADTObjectColor } from '../../Models/Constants';
import { getLeftPanelStyles } from './Internal/Shared/LeftPanel.styles';
import BehaviorsModal from '../BehaviorsModal/BehaviorsModal';

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

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = ({
    sceneId,
    sceneViewProps,
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();
    const fluentTheme = useTheme();
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(null);

    const previouslyColoredMeshItems = useRef([]);
    const elementContextualMenuItems = useRef([]);
    const behaviorContextualMenuItems = useRef([]);

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

    const setColoredMeshItems = useCallback(
        (coloredMeshItems: Array<CustomMeshItem>) => {
            dispatch({
                type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
                payload: coloredMeshItems
            });
        },
        []
    );

    const setOutlinedMeshItems = useCallback(
        (outlinedMeshItems: Array<CustomMeshItem>) => {
            dispatch({
                type: SET_MESH_IDS_TO_OUTLINE,
                payload: outlinedMeshItems
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
                    setOutlinedMeshItems([]);
                }
            }
        },
        [state]
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

    const meshHoverOnBehaviorsIdle = (mesh: AbstractMesh) => {
        const meshIds = [];
        if (!contextualMenuProps.isVisible) {
            if (mesh) {
                for (const element of state.elements) {
                    // find elements that contain this mesh
                    if (element.objectIDs.includes(mesh.id)) {
                        for (const id of element.objectIDs) {
                            // add meshes that make up element to highlight
                            meshIds.push(id);
                        }
                    }
                }
                setOutlinedMeshItems(
                    createCustomMeshItems(
                        meshIds,
                        state.objectColor.outlinedMeshHoverColor
                    )
                );
            } else {
                setOutlinedMeshItems([]);
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

        setOutlinedMeshItems(
            createCustomMeshItems(
                meshIds,
                state.objectColor.outlinedMeshHoverColor
            )
        );
        setColoredMeshItems(coloredMeshes);
    };

    const meshClickOnBehaviorsIdle = (mesh: AbstractMesh, e: PointerEvent) => {
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
            setOutlinedMeshItems(outlinedElements);
            previouslyColoredMeshItems.current = outlinedElements;
        } else {
            setOutlinedMeshItems([]);
        }

        let behaviors: IBehavior[] = [];
        // get behaviors that contain any of the elements
        for (const element of elements) {
            const behavior = ViewerConfigUtility.getBehaviorsOnElement(
                element,
                state.config?.configuration?.behaviors
            );
            if (behavior) {
                behaviors = behaviors.concat(behavior);
            }
        }

        // create edit behavior items for the context menu
        for (const behavior of behaviors) {
            const item = {
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
                    // get elements that are contained in the hovered behavior
                    let ids = [];
                    const selectedElements = [];
                    behavior.datasources
                        .filter(
                            ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                        )
                        .forEach((ds) => {
                            ds.elementIDs.forEach((elementId) => {
                                const element = state.elements.find(
                                    (el) => el.id === elementId
                                );
                                element && selectedElements.push(element);
                            });
                        });

                    for (const element of selectedElements) {
                        ids = ids.concat(element.objectIDs);
                    }

                    // colored meshes that are in the elements contained in the hovered behavior
                    setOutlinedMeshItems(
                        createCustomMeshItems(
                            ids,
                            state.objectColor.outlinedMeshHoverColor
                        )
                    );
                },
                onMouseOut: () => {
                    // rest highlight and mesh colorings
                    setOutlinedMeshItems(previouslyColoredMeshItems.current);
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
                    setOutlinedMeshItems([]);
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
                    setOutlinedMeshItems(
                        createCustomMeshItems(
                            element.objectIDs,
                            state.objectColor.outlinedMeshHoverColor
                        )
                    );
                },
                onMouseOut: () => {
                    setOutlinedMeshItems(previouslyColoredMeshItems.current);
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
    };

    const meshClickOnElementsIdle = (mesh: AbstractMesh, e: PointerEvent) => {
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
                        setOutlinedMeshItems(
                            createCustomMeshItems(
                                element.objectIDs,
                                state.objectColor.outlinedMeshHoverColor
                            )
                        );
                    },
                    onMouseOut: () => {
                        setOutlinedMeshItems([]);
                        setColoredMeshItems(previouslyColoredMeshItems.current);
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
        const coloredMesh: CustomMeshItem = { meshId: mesh.id, color: null };
        setColoredMeshItems([coloredMesh]);
        setOutlinedMeshItems([]);
        previouslyColoredMeshItems.current = [coloredMesh];

        setContextualMenuProps({
            isVisible: true,
            x: e.offsetX,
            y: e.offsetY,
            items: elementContextualMenuItems.current
        });
    };

    const meshClickOnEditElement = (mesh) => {
        const selectedMesh = state.coloredMeshItems.find(
            (item) => item.meshId === mesh.id
        );
        let coloredMeshes = [...state.coloredMeshItems];

        if (selectedMesh) {
            coloredMeshes = state.coloredMeshItems.filter(
                (item) => item.meshId !== selectedMesh.meshId
            );
        } else {
            coloredMeshes.push({ meshId: mesh.id });
        }
        setColoredMeshItems(coloredMeshes);
    };

    const addContextualMenuItems = (item, targetMenu) => {
        if (!targetMenu.sectionProps.items.find((ci) => ci.key === item.key)) {
            targetMenu.sectionProps.items.push(item);
        }
    };

    const objectColorUpdated = useCallback((objectColor: IADTObjectColor) => {
        dispatch({
            type: SET_ADT_SCENE_OBJECT_COLOR,
            payload: objectColor
        });
    }, []);

    const commonPanelStyles = getLeftPanelStyles(fluentTheme);

    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                theme,
                locale,
                localeStrings,
                coloredMeshItems: state.coloredMeshItems,
                setColoredMeshItems,
                setOutlinedMeshItems,
                config: state.config,
                getConfig: getScenesConfig.callAdapter,
                sceneId,
                widgetFormInfo: state.widgetFormInfo,
                setWidgetFormInfo,
                behaviorTwinAliasFormInfo: state.behaviorTwinAliasFormInfo,
                setBehaviorTwinAliasFormInfo,
                elementTwinAliasFormInfo: state.elementTwinAliasFormInfo,
                setElementTwinAliasFormInfo,
                dispatch,
                state,
                objectColor: state.objectColor,
                behaviorToEdit,
                setBehaviorToEdit,
                setIsLayerBuilderDialogOpen
            }}
        >
            <BaseComponent
                isLoading={!state.config && getScenesConfig.isLoading}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                containerClassName="cb-scene-builder-card-wrapper"
            >
                {state.config && <BuilderLeftPanel />}
                <div className="cb-scene-builder-canvas">
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
                            outlinedMeshItems={state.outlinedMeshItems}
                            showHoverOnSelected={state.showHoverOnSelected}
                            coloredMeshItems={state.coloredMeshItems}
                            showMeshesOnHover={state.enableHoverOnModel}
                        />
                    )}
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
                    {(state.builderMode ===
                        ADT3DSceneBuilderMode.CreateBehavior ||
                        state.builderMode ===
                            ADT3DSceneBuilderMode.EditBehavior) &&
                        behaviorToEdit &&
                        !state.isLayerBuilderDialogOpen && (
                            <div className={commonPanelStyles.previewContainer}>
                                <BehaviorsModal
                                    behaviors={[behaviorToEdit]}
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
export default React.memo(ADT3DSceneBuilder);
