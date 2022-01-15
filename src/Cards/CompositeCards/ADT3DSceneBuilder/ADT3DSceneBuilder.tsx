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
    SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../../Models/Hooks/useAdapter';
import {
    ScenesConfig,
    TwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderReducer,
    ADT3DSceneBuilderLeftPanelReducer,
    defaultADT3DSceneBuilderState,
    defaultADT3DSceneBuilderLeftPanelState
} from './ADT3DSceneBuilder.state';
import { IADTAdapter } from '../../../Models/Constants/Interfaces';
import SceneElementForm from './Components/ElementForm';
import SceneBehaviors from './Components/Behaviors';
import SceneElements from './Components/Elements';
import { ColoredMeshItem } from '../../../Models/Classes/SceneView.types';

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

    const setSelectedObjectIds = (selectedMeshIds) => {
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
            const config: ScenesConfig = getScenesConfig.adapterResult.getData();
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
                selectedObjectIds: state.selectedObjectIds,
                coloredMeshItems: state.coloredMeshItems,
                setColoredMeshItems,
                setSelectedObjectIds,
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
                                    setSelectedObjectIds(selectedMeshes)
                                }
                                coloredMeshItems={state.coloredMeshItems}
                                preselectedMeshIds={state.selectedObjectIds}
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
        sceneId,
        setSelectedObjectIds,
        setColoredMeshItems,
        theme,
        locale,
        localeStrings
    } = useContext(SceneBuilderContext);

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
        setSelectedObjectIds([]);
    };

    const onElementClick = (element: TwinToObjectMapping) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
            payload: element
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditElement
        });
        setSelectedObjectIds(element.meshIDs);
        setColoredMeshItems([]);
    };

    const onElementEnter = (element: TwinToObjectMapping) => {
        const coloredMeshes: ColoredMeshItem[] = [];
        for (const id of element.meshIDs) {
            const coloredMesh: ColoredMeshItem = {
                meshId: id,
                color: '#00A8F0'
            };
            coloredMeshes.push(coloredMesh);
        }
        setColoredMeshItems(coloredMeshes);
    };

    const onElementLeave = () => {
        setColoredMeshItems([]);
    };

    const onElementBackClick = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.Idle
        });
        setSelectedObjectIds([]);
    };

    const onElementSave = (newElements: Array<TwinToObjectMapping>) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_ELEMENTS,
            payload: newElements
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.Idle
        });
        setSelectedObjectIds([]);
    };
    // END of scene element related callbacks

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

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            {state.builderMode === ADT3DSceneBuilderMode.Idle && (
                <Pivot
                    aria-label={t('buildMode')}
                    defaultSelectedKey={ADT3DSceneTwinBindingsMode.Elements}
                    className="cb-scene-builder-left-panel-pivot"
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.elements')}
                        itemKey={ADT3DSceneTwinBindingsMode.Elements}
                    >
                        <SceneElements
                            elements={state.elements}
                            onCreateElementClick={onCreateElementClick}
                            onElementClick={onElementClick}
                            onElementEnter={onElementEnter}
                            onElementLeave={onElementLeave}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        itemKey={ADT3DSceneTwinBindingsMode.Behaviors}
                    >
                        <SceneBehaviors />
                    </PivotItem>
                </Pivot>
            )}
            {(state.builderMode === ADT3DSceneBuilderMode.CreateElement ||
                state.builderMode === ADT3DSceneBuilderMode.EditElement) && (
                <SceneElementForm
                    builderMode={state.builderMode}
                    selectedElement={state.selectedElement}
                    onElementBackClick={onElementBackClick}
                    onElementSave={onElementSave}
                />
            )}
        </BaseComponent>
    );
};

export default React.memo(ADT3DSceneBuilder);
