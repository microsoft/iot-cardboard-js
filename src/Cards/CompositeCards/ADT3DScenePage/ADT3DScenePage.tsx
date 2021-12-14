import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import ADT3DViewerCard from '../../ADT3DViewerCard/ADT3DViewerCard';
import SceneListCard from '../../SceneListCard/Consume/SceneListCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    IADT3DSceneBuilderProps,
    IADT3DScenePageProps
} from './ADT3DScenePage.types';
import './ADT3DScenePage.scss';
import { DefaultButton, Pivot, PivotItem } from '@fluentui/react';
import ADT3DBuilderCard from '../../ADT3DBuilderCard/ADT3DBuilderCard';
import {
    ADT3DScenePageReducer,
    defaultADT3DScenePageState
} from './ADT3DScenePage.state';
import {
    SET_CURRENT_STEP,
    SET_SELECTED_SCENE
} from '../../../Models/Constants/ActionTypes';
import ADT3DGlobeCard from '../../ADT3DGlobeCard/ADT3DGlobeCard';
import { Scene } from '../../../Models/Classes/3DVConfig';

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );
    const { t } = useTranslation();

    const handleOnSceneClick = (scene: Scene) => {
        dispatch({
            type: SET_SELECTED_SCENE,
            payload: scene
        });
        dispatch({
            type: SET_CURRENT_STEP,
            payload: ADT3DScenePageSteps.TwinBindingsWithScene
        });
    };

    return (
        <div className="cb-scene-page-container">
            <BaseCompositeCard
                title={title}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                adapterAdditionalParameters={adapterAdditionalParameters}
            >
                {state.currentStep === ADT3DScenePageSteps.SceneTwinList && (
                    <div className="cb-scene-page-scene-list-container">
                        <DefaultButton
                            onClick={() => {
                                dispatch({
                                    type: SET_SELECTED_SCENE,
                                    payload: null
                                });
                                dispatch({
                                    type: SET_CURRENT_STEP,
                                    payload: ADT3DScenePageSteps.Globe
                                });
                            }}
                            text={t('globe')}
                            className="cb-scene-page-view-button"
                        />
                        <SceneListCard
                            title={'Twins with visual ontology'}
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            onSceneClick={(scene) => {
                                handleOnSceneClick(scene);
                            }}
                        />
                    </div>
                )}
                {state.currentStep === ADT3DScenePageSteps.Globe && (
                    <div className="cb-scene-page-scene-list-container">
                        <DefaultButton
                            onClick={() => {
                                dispatch({
                                    type: SET_SELECTED_SCENE,
                                    payload: null
                                });
                                dispatch({
                                    type: SET_CURRENT_STEP,
                                    payload: ADT3DScenePageSteps.SceneTwinList
                                });
                            }}
                            text={t('list')}
                            className="cb-scene-page-view-button"
                        />
                        <ADT3DGlobeCard
                            theme={theme}
                            adapter={adapter as any} // TODO: Fix
                            onSceneClick={(scene) => {
                                handleOnSceneClick(scene);
                            }}
                        />
                    </div>
                )}
                {state.currentStep ===
                    ADT3DScenePageSteps.TwinBindingsWithScene && (
                    <>
                        <div className="cb-scene-builder-container">
                            <ADT3DSceneBuilderCompositeComponent
                                scene={state.selectedScene}
                                adapter={adapter}
                                title={state.selectedScene.name}
                                theme={theme}
                                locale={locale}
                                localeStrings={localeStrings}
                                adapterAdditionalParameters={
                                    adapterAdditionalParameters
                                }
                            />
                        </div>
                        <DefaultButton
                            onClick={() => {
                                dispatch({
                                    type: SET_SELECTED_SCENE,
                                    payload: null
                                });
                                dispatch({
                                    type: SET_CURRENT_STEP,
                                    payload: ADT3DScenePageSteps.SceneTwinList
                                });
                            }}
                            text={t('back')}
                            className="cb-scene-page-action-button"
                        />
                    </>
                )}
            </BaseCompositeCard>
        </div>
    );
};

const ADT3DSceneBuilderCompositeComponent: React.FC<IADT3DSceneBuilderProps> = ({
    defaultMode = ADT3DSceneBuilderModes.BuildScene,
    scene,
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();

    const onMeshSelected = (selectedMeshes) => {
        console.log(selectedMeshes);
    };

    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <Pivot
                aria-label={
                    defaultMode === ADT3DSceneBuilderModes.BuildScene
                        ? t('buildMode')
                        : t('viewMode')
                }
                defaultSelectedKey={defaultMode}
                styles={{
                    root: {
                        display: 'flex',
                        justifyContent: 'end',
                        marginBottom: '4px'
                    }
                }}
            >
                <PivotItem
                    headerText={t('build')}
                    itemKey={ADT3DSceneBuilderModes.BuildScene}
                >
                    <BaseCompositeCard
                        theme={theme}
                        locale={locale}
                        localeStrings={localeStrings}
                        adapterAdditionalParameters={
                            adapterAdditionalParameters
                        }
                    >
                        <TwinBuildingsBaseComponentPlaceholder />
                        <div className="cb-scene-view-builder">
                            <ADT3DBuilderCard
                                title="3D Builder"
                                modelUrl={scene.assets[0].url}
                                onMeshSelected={(selectedMeshes) =>
                                    onMeshSelected(selectedMeshes)
                                }
                            />
                        </div>
                    </BaseCompositeCard>
                </PivotItem>
                <PivotItem
                    headerText={t('view')}
                    itemKey={ADT3DSceneBuilderModes.ViewScene}
                >
                    <div className="cb-scene-view-viewer">
                        <ADT3DViewerCard
                            title="3D Viewer"
                            adapter={adapter}
                            pollingInterval={10000}
                            sceneId={scene.id}
                            sceneConfig={null}
                        />
                    </div>
                </PivotItem>
            </Pivot>
        </BaseCompositeCard>
    );
};

const TwinBuildingsBaseComponentPlaceholder: React.FC<any> = (_props) => {
    return (
        <div className="cb-scene-view-twin-bindings">
            Twin bindings component placeholder
        </div>
    );
};

export default React.memo(ADT3DScenePage);
