import { ContextualMenu, ContextualMenuItemType } from '@fluentui/react';
import React, { useEffect, useReducer, useRef, useState } from 'react';
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
    SET_REVERT_TO_HOVER_COLOR,
    SET_WIDGET_FORM_INFO,
    WidgetFormInfo
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../Models/Hooks/useAdapter';
import { IScenesConfig } from '../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderReducer,
    defaultADT3DSceneBuilderState
} from './ADT3DSceneBuilder.state';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BuilderLeftPanel from './Internal/BuilderLeftPanel';
import { useTranslation } from 'react-i18next';

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

    const previouslySelectedMeshIds = useRef([]);
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
                key: t('3dSceneBuilder.actions'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: false,
                    bottomDivider: false,
                    title: t('3dSceneBuilder.actions'),
                    items: [
                        {
                            key: t('3dSceneBuilder.createNewElementKey'),
                            text: t('3dSceneBuilder.createNewElement'),
                            onClick: () => {
                                contextualMenuItems.current[1].sectionProps.items = [];
                                dispatch({
                                    type: SET_ADT_SCENE_BUILDER_MODE,
                                    payload: ADT3DSceneBuilderMode.CreateElement
                                });
                            }
                        }
                    ]
                }
            },
            {
                key: t('3dSceneBuilder.elements'),
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    topDivider: false,
                    bottomDivider: false,
                    title: t('3dSceneBuilder.elements'),
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

    const setSelectedMeshIds = (selectedMeshIds) => {
        dispatch({
            type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
            payload: selectedMeshIds
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

    const onMeshClicked = (mesh, e: any) => {
        let meshIds = [...state.selectedMeshIds];
        if (mesh) {
            const selectedMesh = state.selectedMeshIds.find(
                (item) => item === mesh.id
            );

            switch (state.builderMode) {
                case ADT3DSceneBuilderMode.ElementsIdle:
                    for (const element of state.elements) {
                        if (element.meshIDs.includes(mesh.id)) {
                            const item = {
                                key: element.id,
                                text: element.displayName,
                                onClick: () => {
                                    contextualMenuItems.current[1].sectionProps.items = [];
                                    dispatch({
                                        type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
                                        payload: element
                                    });
                                    dispatch({
                                        type: SET_ADT_SCENE_BUILDER_MODE,
                                        payload:
                                            ADT3DSceneBuilderMode.EditElement
                                    });
                                },
                                onMouseOver: () => {
                                    setSelectedMeshIds(element.meshIDs);
                                },
                                onMouseOut: () => {
                                    setSelectedMeshIds(
                                        previouslySelectedMeshIds.current
                                    );
                                }
                            };

                            if (e.event.button === 2) {
                                if (!state.selectedMeshIds.includes(mesh.id)) {
                                    meshIds.push(mesh.id);
                                }
                                addContextualMenuItems(item);
                            } else {
                                if (state.selectedMeshIds.includes(mesh.id)) {
                                    meshIds = meshIds.filter(
                                        (id) => id !== mesh.id
                                    );
                                    removeContextualMenuItems(item);
                                } else {
                                    addContextualMenuItems(item);
                                    meshIds.push(mesh.id);
                                }
                            }
                        }
                    }

                    setSelectedMeshIds(meshIds);
                    previouslySelectedMeshIds.current = meshIds;

                    if (e.event.button === 2) {
                        setContextualMenuProps({
                            isVisible: true,
                            x: e.event.clientX,
                            y: e.event.clientY,
                            items: contextualMenuItems.current
                        });
                    }

                    break;

                case ADT3DSceneBuilderMode.EditElement:
                case ADT3DSceneBuilderMode.CreateElement:
                    if (selectedMesh) {
                        meshIds = state.selectedMeshIds.filter(
                            (item) => item !== selectedMesh
                        );
                    } else {
                        meshIds.push(mesh.id);
                    }
                    setSelectedMeshIds(meshIds);
                    break;
            }
        } else {
            contextualMenuItems.current[1].sectionProps.items = [];
            setSelectedMeshIds([]);
        }
    };

    const addContextualMenuItems = (item) => {
        if (
            !contextualMenuItems.current[1].sectionProps.items.find(
                (ci) => ci.key === item.key
            )
        ) {
            contextualMenuItems.current[1].sectionProps.items.push(item);
        }
    };

    const removeContextualMenuItems = (item) => {
        if (
            contextualMenuItems.current[1].sectionProps.items.find(
                (ci) => ci.key === item.key
            )
        ) {
            contextualMenuItems.current[1].sectionProps.items = contextualMenuItems.current[1].sectionProps.items.filter(
                (ci) => ci.key !== item.key
            );
        }
    };

    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                theme,
                locale,
                localeStrings,
                selectedMeshIds: state.selectedMeshIds,
                setSelectedMeshIds,
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
                                state.config.viewerConfiguration?.scenes[
                                    state.config.viewerConfiguration?.scenes.findIndex(
                                        (s) => s.id === sceneId
                                    )
                                ]?.assets[0].url
                            }
                            onMeshClicked={(mesh, e) => onMeshClicked(mesh, e)}
                            selectedMeshIds={state.selectedMeshIds}
                            revertToHoverColor={state.revertToHoverColor}
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
