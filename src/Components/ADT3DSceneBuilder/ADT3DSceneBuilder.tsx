import { ContextualMenu, IContextualMenuItem } from '@fluentui/react';
import React, { useEffect, useReducer, useState } from 'react';
import { ADT3DSceneBuilderMode } from '../../Models/Constants/Enums';
import ADT3DBuilder from '../ADT3DBuilder/ADT3DBuilder';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
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
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    const [contextualMenuProps, setContextualMenuProps] = useState<{
        isVisible: boolean;
        x: number;
        y: number;
        items: IContextualMenuItem[];
    }>({ isVisible: false, x: 0, y: 0, items: [] });

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

    const onMeshClicked = (mesh, e) => {
        let meshes = [...state.selectedMeshIds];
        const contextMenuItems = [];
        if (mesh) {
            const selectedMesh = state.selectedMeshIds.find(
                (item) => item === mesh.id
            );

            contextMenuItems.push({
                key: 'createElement',
                text: 'Create Element',
                onClick: () => {
                    dispatch({
                        type: SET_ADT_SCENE_BUILDER_MODE,
                        payload: ADT3DSceneBuilderMode.CreateElement
                    });
                }
            });

            switch (state.builderMode) {
                case ADT3DSceneBuilderMode.ElementsIdle:
                    for (const element of state.elements) {
                        if (element.meshIDs.includes(mesh.id)) {
                            const item = {
                                key: element.id,
                                text: element.displayName,
                                onClick: () => {
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
                                    setSelectedMeshIds([mesh.id]);
                                }
                            };
                            contextMenuItems.push(item);
                        }
                    }

                    setContextualMenuProps({
                        isVisible: true,
                        x: e.event.clientX,
                        y: e.event.clientY,
                        items: contextMenuItems
                    });
                    setSelectedMeshIds([mesh.id]);
                    break;

                case ADT3DSceneBuilderMode.EditElement:
                case ADT3DSceneBuilderMode.CreateElement:
                    if (selectedMesh) {
                        meshes = state.selectedMeshIds.filter(
                            (item) => item !== selectedMesh
                        );
                        setSelectedMeshIds(meshes);
                    } else {
                        meshes.push(mesh.id);
                        setSelectedMeshIds(meshes);
                    }
                    break;
            }
        } else {
            setSelectedMeshIds([]);
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
                        />
                    )}
                    {contextualMenuProps.isVisible && (
                        <div>
                            <div
                                id="target"
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
                                target="#target"
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
