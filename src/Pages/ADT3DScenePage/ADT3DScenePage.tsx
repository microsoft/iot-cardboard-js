import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps,
    ComponentErrorType
} from '../../Models/Constants/Enums';
import SceneList from '../../Components/SceneList/SceneList';
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
    SET_CURRENT_STEP,
    SET_ERRORS,
    SET_SELECTED_BLOB_CONTAINER_URL,
    SET_SELECTED_SCENE,
    SET_UNAUTHORIZED
} from '../../Models/Constants/ActionTypes';
import ADT3DGlobe from '../../Components/ADT3DGlobe/ADT3DGlobe';
import { IScene, IScenesConfig } from '../../Models/Classes/3DVConfig';
import {
    IADTInstance,
    IBlobAdapter,
    IComponentError
} from '../../Models/Constants/Interfaces';
import { ADT3DSceneBuilderContainer } from './Internal/ADT3DSceneBuilderContainer';
import useAdapter from '../../Models/Hooks/useAdapter';
import ScenePageErrorHandlingWrapper from '../../Components/ScenePageErrorHandlingWrapper/ScenePageErrorHandlingWrapper';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import FloatingScenePageModeToggle from './Internal/FloatingScenePageModeToggle';
import EnvironmentPicker from '../../Components/EnvironmentPicker/EnvironmentPicker';
import ADTAdapter from '../../Adapters/ADTAdapter';

export const ADT3DScenePageContext = createContext<IADT3DScenePageContext>(
    null
);

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    environmentPickerOptions
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

    const handleContainerUrlChange = (
        containerUrl: string,
        containerUrls: Array<string>
    ) => {
        dispatch({
            type: SET_SELECTED_BLOB_CONTAINER_URL,
            payload: containerUrl
        });
        adapter.setBlobContainerPath(containerUrl);
        if (environmentPickerOptions?.storage?.onContainerChange) {
            environmentPickerOptions.storage.onContainerChange(
                containerUrl,
                containerUrls
            );
        }
    };

    const handleEnvironmentUrlChange = (
        env: string | IADTInstance,
        envs: Array<string | IADTInstance>
    ) => {
        adapter.setAdtHostUrl(
            typeof env === 'string' ? env.replace('https://', '') : env.hostName
        );
        if (environmentPickerOptions?.environment?.onEnvironmentChange) {
            environmentPickerOptions.environment.onEnvironmentChange(env, envs);
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
        if (scenesConfig?.adapterResult.getErrors()) {
            const errors: Array<IComponentError> = scenesConfig?.adapterResult.getErrors();
            dispatch({
                type: SET_ERRORS,
                payload: errors
            });
        } else {
            dispatch({
                type: SET_ERRORS,
                payload: []
            });
        }
    }, [scenesConfig?.adapterResult]);

    useEffect(() => {
        dispatch({
            type: SET_SELECTED_BLOB_CONTAINER_URL,
            payload: adapter.getBlobContainerURL()
        });
    }, []);

    useEffect(() => {
        if (
            state?.errors?.[0]?.type === ComponentErrorType.UnauthorizedAccess
        ) {
            dispatch({
                type: SET_UNAUTHORIZED,
                payload: {
                    buttonText: t('learnMore'),
                    buttonAction: () => {
                        window.open(
                            'https://docs.microsoft.com/azure/digital-twins/'
                        );
                    }
                }
            });
        }
    }, [state.errors]);

    return (
        <ADT3DScenePageContext.Provider
            value={{ state, dispatch, handleOnHomeClick }}
        >
            <div className="cb-scene-page-wrapper">
                <BaseComponent
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    containerClassName={'cb-scene-page-container'}
                >
                    <FloatingScenePageModeToggle
                        scene={state.selectedScene}
                        handleScenePageModeChange={handleScenePageModeChange}
                        selectedMode={state.scenePageMode}
                    />
                    {state.currentStep === ADT3DScenePageSteps.SceneLobby && (
                        <>
                            <div className="cb-scene-page-scene-environment-picker">
                                <EnvironmentPicker
                                    theme={theme}
                                    locale={locale}
                                    localeStrings={localeStrings}
                                    adapter={adapter as ADTAdapter}
                                    shouldPullFromSubscription={
                                        environmentPickerOptions?.environment
                                            ?.shouldPullFromSubscription
                                    }
                                    {...(adapter.getAdtHostUrl() && {
                                        environmentUrl:
                                            'https://' + adapter.getAdtHostUrl()
                                    })}
                                    onEnvironmentUrlChange={
                                        handleEnvironmentUrlChange
                                    }
                                    {...(environmentPickerOptions?.environment
                                        ?.isLocalStorageEnabled && {
                                        isLocalStorageEnabled: true,
                                        localStorageKey:
                                            environmentPickerOptions
                                                ?.environment?.localStorageKey,
                                        selectedItemLocalStorageKey:
                                            environmentPickerOptions
                                                ?.environment
                                                ?.selectedItemLocalStorageKey
                                    })}
                                    storage={{
                                        ...(adapter.getBlobContainerURL() && {
                                            containerUrl: adapter.getBlobContainerURL()
                                        }),
                                        onContainerUrlChange: handleContainerUrlChange,
                                        ...(environmentPickerOptions?.storage
                                            ?.isLocalStorageEnabled && {
                                            isLocalStorageEnabled: true,
                                            localStorageKey:
                                                environmentPickerOptions
                                                    ?.storage?.localStorageKey,
                                            selectedItemLocalStorageKey:
                                                environmentPickerOptions
                                                    ?.storage
                                                    ?.selectedItemLocalStorageKey
                                        })
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <ScenePageErrorHandlingWrapper
                        errors={state.errors}
                        primaryOnclickAction={
                            state?.unauthorizedError?.buttonAction
                        }
                        buttonText={state?.unauthorizedError?.buttonText}
                    >
                        {state.currentStep ===
                            ADT3DScenePageSteps.SceneLobby && (
                            <div className="cb-scene-page-scene-list-container">
                                {state.selectedBlobContainerURL && (
                                    <SceneList
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
                                                iconProps: {
                                                    iconName: 'Globe'
                                                },
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
                                <ADT3DGlobe
                                    theme={theme}
                                    adapter={adapter as IBlobAdapter}
                                    onSceneClick={(scene) => {
                                        handleOnSceneClick(scene);
                                    }}
                                />
                            </div>
                        )}
                        {state.currentStep ===
                            ADT3DScenePageSteps.SceneBuilder && (
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
                                        refetchConfig={() =>
                                            scenesConfig.callAdapter()
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </ScenePageErrorHandlingWrapper>
                </BaseComponent>
            </div>
        </ADT3DScenePageContext.Provider>
    );
};

export default React.memo(ADT3DScenePage);
