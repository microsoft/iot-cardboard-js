import { ContextualMenu, ContextualMenuItemType } from '@fluentui/react';
import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';
import { ADT3DSceneBuilderMode } from '../../Models/Constants/Enums';
import ADT3DBuilder from '../ADT3DBuilder/ADT3DBuilder';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    IContextMenuProps,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
    SET_MESH_IDS_TO_OUTLINE,
    SET_REVERT_TO_HOVER_COLOR,
    SET_WIDGET_FORM_INFO,
    WidgetFormInfo
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
import { AbstractMesh } from 'babylonjs/Meshes/abstractMesh';
import { ColoredMeshItem } from '../../Models/Classes/SceneView.types';
import { createColoredMeshItems } from '../3DV/SceneView.Utils';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { RenderModes } from '../../Models/Constants';

export const SceneBuilderContext = React.createContext<I3DSceneBuilderContext>(
    null
);

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = ({
    sceneId,
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    const previouslyColoredMeshItems = useRef([]);
    const contextualMenuItems = useRef([]);

    const [
        contextualMenuProps,
        setContextualMenuProps
    ] = useState<IContextMenuProps>({
        isVisible: false,
        x: 0,
        y: 0,
        items: contextualMenuItems.current
    });

    useEffect(() => {
        contextualMenuItems.current = [
            {
                key: t('3dSceneBuilder.elements'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: false,
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
                                    color: 'var(--cb-color-text-primary)'
                                }
                            },
                            onClick: () => {
                                contextualMenuItems.current[0].sectionProps.items = [];
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

    const setColoredMeshItems = (coloredMeshItems: Array<ColoredMeshItem>) => {
        dispatch({
            type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
            payload: coloredMeshItems
        });
    };

    const setMeshIdsToOutline = (meshIdsToOutline: Array<string>) => {
        dispatch({
            type: SET_MESH_IDS_TO_OUTLINE,
            payload: meshIdsToOutline
        });
    };

    const setWidgetFormInfo = (widgetFormInfo: WidgetFormInfo) => {
        dispatch({
            type: SET_WIDGET_FORM_INFO,
            payload: widgetFormInfo
        });
    };

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
                }
            } else {
                contextualMenuItems.current[0].sectionProps.items = [];
                if (state.builderMode === ADT3DSceneBuilderMode.ElementsIdle) {
                    setColoredMeshItems([]);
                }
            }
        },
        [state]
    );

    const onMeshHovered = (mesh: AbstractMesh) => {
        if (state.builderMode === ADT3DSceneBuilderMode.ElementsIdle) {
            let coloredMeshes = [];
            const meshIds = [];
            if (mesh && !contextualMenuProps.isVisible) {
                for (const element of state.elements) {
                    if (element.objectIDs.includes(mesh.id)) {
                        for (const id of element.objectIDs) {
                            if (id !== mesh.id) {
                                meshIds.push(id);
                            } else {
                                coloredMeshes.push({
                                    meshId: id,
                                    color: state.renderMode.meshHoverColor
                                });
                            }
                        }
                    } else {
                        coloredMeshes.push({
                            meshId: mesh.id,
                            color: state.renderMode.meshHoverColor
                        });
                    }
                }
            } else if (contextualMenuProps.isVisible) {
                coloredMeshes = previouslyColoredMeshItems.current;
            }

            setMeshIdsToOutline(meshIds);
            setColoredMeshItems(coloredMeshes);
        }
    };

    const meshClickOnElementsIdle = (mesh: AbstractMesh, e: PointerEvent) => {
        const coloredMeshes = [];
        contextualMenuItems.current[0].sectionProps.items = [];
        for (const element of state.elements) {
            if (element.objectIDs.includes(mesh.id)) {
                const item = {
                    key: element.id,
                    text: t('3dSceneBuilder.edit', {
                        elementDisplayName: element.displayName
                    }),
                    iconProps: {
                        iconName: 'Edit',
                        style: {
                            fontSize: '14px',
                            color: 'var(--cb-color-text-primary)'
                        }
                    },
                    onClick: () => {
                        contextualMenuItems.current[0].sectionProps.items = [];
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
                        const ids = [];
                        for (const id of element.objectIDs) {
                            if (
                                id !==
                                previouslyColoredMeshItems.current[0].meshId
                            ) {
                                ids.push(id);
                            }
                        }
                        setMeshIdsToOutline(ids);
                    },
                    onMouseOut: () => {
                        setMeshIdsToOutline([]);
                        setColoredMeshItems(previouslyColoredMeshItems.current);
                    }
                };

                addContextualMenuItems(item);
            }
        }

        coloredMeshes.push({ meshId: mesh.id });

        setColoredMeshItems(coloredMeshes);
        setMeshIdsToOutline([]);
        previouslyColoredMeshItems.current = coloredMeshes;

        setContextualMenuProps({
            isVisible: true,
            x: e.clientX,
            y: e.clientY,
            items: contextualMenuItems.current
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

    const addContextualMenuItems = (item) => {
        if (
            !contextualMenuItems.current[0].sectionProps.items.find(
                (ci) => ci.key === item.key
            )
        ) {
            contextualMenuItems.current[0].sectionProps.items.push(item);
        }
    };

    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                theme,
                locale,
                localeStrings,
                coloredMeshItems: state.coloredMeshItems,
                setColoredMeshItems,
                setMeshIdsToOutline,
                config: state.config,
                getConfig: getScenesConfig.callAdapter,
                sceneId,
                widgetFormInfo: state.widgetFormInfo,
                setWidgetFormInfo,
                dispatch,
                state
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
                            adapter={adapter as IADTAdapter}
                            modelUrl={
                                state.config.configuration?.scenes[
                                    state.config.configuration?.scenes.findIndex(
                                        (s) => s.id === sceneId
                                    )
                                ]?.assets[0].url
                            }
                            renderMode={state.renderMode}
                            onMeshClicked={onMeshClicked}
                            onMeshHovered={onMeshHovered}
                            meshIdsToOutline={state.meshIdsToOutline}
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
                </div>
            </BaseComponent>
        </SceneBuilderContext.Provider>
    );
};
export default React.memo(ADT3DSceneBuilder);
