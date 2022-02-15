import React, { createContext, useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import SceneListCard from '../../SceneListCard/Consume/SceneListCard';
import {
    IADT3DScenePageContext,
    IADT3DScenePageProps
} from './ADT3DScenePage.types';
import './ADT3DScenePage.scss';
import { Breadcrumb } from '@fluentui/react';
import {
    ADT3DScenePageReducer,
    defaultADT3DScenePageState
} from './ADT3DScenePage.state';
import {
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_PAGE_MODE,
    SET_BLOB_CONTAINER_URLS,
    SET_CURRENT_STEP,
    SET_SELECTED_BLOB_CONTAINER_URL,
    SET_SELECTED_SCENE
} from '../../../Models/Constants/ActionTypes';
import ADT3DGlobeCard from '../../ADT3DGlobeCard/ADT3DGlobeCard';
import { IScene, IScenesConfig } from '../../../Models/Classes/3DVConfig';
import { IBlobAdapter } from '../../../Models/Constants/Interfaces';
import { ADTSceneConfigBlobContainerPicker } from './Components/BlobContainerPicker';
import { ADT3DSceneBuilderContainer } from './Components/ADT3DSceneBuilderContainer';
import useAdapter from '../../../Models/Hooks/useAdapter';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import FloatingScenePageModeToggle from './Components/FloatingScenePageModeToggle';

export const ADT3DScenePageContext = createContext<IADT3DScenePageContext>(
    null
);

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = ({
    adapter,
    existingBlobContainerUrls,
    onBlobContainerUrlChange,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );
    const { t } = useTranslation();

    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [
            adapter,
            state.selectedBlobContainerURL,
            state.selectedScene
        ]
    });

    const handleOnHomeClick = () => {
        dispatch({
            type: SET_SELECTED_SCENE,
            payload: null
        });
        dispatch({
            type: SET_CURRENT_STEP,
            payload: ADT3DScenePageSteps.SceneLobby
        });
    };

    const handleOnSceneClick = (scene: IScene) => {
        dispatch({
            type: SET_SELECTED_SCENE,
            payload: scene
        });
        dispatch({
            type: SET_CURRENT_STEP,
            payload: ADT3DScenePageSteps.SceneBuilder
        });
    };

    const handleBlobContainerPathChange = (
        selectedBlobURL: string,
        options: Array<string>
    ) => {
        dispatch({
            type: SET_BLOB_CONTAINER_URLS,
            payload: options
        });
        dispatch({
            type: SET_SELECTED_BLOB_CONTAINER_URL,
            payload: selectedBlobURL
        });
        adapter.setBlobContainerPath(selectedBlobURL);
        if (onBlobContainerUrlChange) {
            onBlobContainerUrlChange(selectedBlobURL, options);
        }
    };

    const handleScenePageModeChange = (
        newScenePageMode: ADT3DScenePageModes
    ) => {
        dispatch({
            type: SET_ADT_SCENE_PAGE_MODE,
            payload: newScenePageMode
        });
    };

    // initially set the blobContainerPath to the one passed in adapter
    useEffect(() => {
        dispatch({
            type: SET_SELECTED_BLOB_CONTAINER_URL,
            payload: adapter.getBlobContainerURL()
        });
        if (existingBlobContainerUrls) {
            dispatch({
                type: SET_BLOB_CONTAINER_URLS,
                payload: existingBlobContainerUrls
            });
        }
    }, []);

    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: IScenesConfig = scenesConfig.adapterResult.getData();
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
    }, [scenesConfig?.adapterResult]);

    return (
        <ADT3DScenePageContext.Provider
            value={{ state, dispatch, handleOnHomeClick }}
        >
            <div className="cb-scene-page-container">
                <BaseComponent
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                >
                    <FloatingScenePageModeToggle
                        scene={state.selectedScene}
                        handleScenePageModeChange={handleScenePageModeChange}
                        selectedMode={state.scenePageMode}
                    />
                    {state.currentStep === ADT3DScenePageSteps.SceneLobby && (
                        <div className="cb-scene-page-scene-list-container">
                            <div className="cb-scene-page-scene-environment-picker">
                                <ADTSceneConfigBlobContainerPicker
                                    existingOptions={state.blobContainerURLs}
                                    selectedContainerUrl={
                                        state.selectedBlobContainerURL
                                    }
                                    onContainerUrlSelect={
                                        handleBlobContainerPathChange
                                    }
                                />
                            </div>
                            {state.selectedBlobContainerURL && (
                                <SceneListCard
                                    key={state.selectedBlobContainerURL}
                                    title={'All scenes'}
                                    theme={theme}
                                    locale={locale}
                                    adapter={adapter}
                                    onSceneClick={(scene) => {
                                        handleOnSceneClick(scene);
                                    }}
                                    additionalActions={[
                                        {
                                            iconProps: { iconName: 'Globe' },
                                            onClick: () => {
                                                dispatch({
                                                    type: SET_SELECTED_SCENE,
                                                    payload: null
                                                });
                                                dispatch({
                                                    type: SET_CURRENT_STEP,
                                                    payload:
                                                        ADT3DScenePageSteps.Globe
                                                });
                                            },
                                            text: t('globe')
                                        }
                                    ]}
                                />
                            )}
                        </div>
                    )}
                    {state.currentStep === ADT3DScenePageSteps.Globe && (
                        <div className="cb-scene-page-scene-globe-container">
                            <Breadcrumb
                                items={[
                                    {
                                        text: t('3dScenePage.home'),
                                        key: 'Home',
                                        onClick: handleOnHomeClick
                                    },
                                    {
                                        text: t('3dScenePage.globe'),
                                        key: 'Scene'
                                    }
                                ]}
                                maxDisplayedItems={10}
                                ariaLabel="Breadcrumb with items rendered as buttons"
                                overflowAriaLabel="More links"
                            />
                            <ADT3DGlobeCard
                                theme={theme}
                                adapter={adapter as IBlobAdapter}
                                onSceneClick={(scene) => {
                                    handleOnSceneClick(scene);
                                }}
                            />
                        </div>
                    )}
                    {state.currentStep === ADT3DScenePageSteps.SceneBuilder && (
                        <>
                            <div className="cb-scene-builder-and-viewer-container">
                                <ADT3DSceneBuilderContainer
                                    mode={state.scenePageMode}
                                    scenesConfig={state.scenesConfig}
                                    scene={state.selectedScene}
                                    adapter={adapter}
                                    theme={theme}
                                    locale={locale}
                                    localeStrings={localeStrings}
                                    adapterAdditionalParameters={
                                        adapterAdditionalParameters
                                    }
                                    refetchConfig={() =>
                                        scenesConfig.callAdapter()
                                    }
                                />
                            </div>
                        </>
                    )}
                </BaseComponent>
            </div>
        </ADT3DScenePageContext.Provider>
    );
};

export default React.memo(ADT3DScenePage);
