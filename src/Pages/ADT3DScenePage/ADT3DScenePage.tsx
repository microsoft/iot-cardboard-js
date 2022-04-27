import React, {
    createContext,
    useCallback,
    useEffect,
    useReducer
} from 'react';
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
import {
    ADT3DScenePageReducer,
    defaultADT3DScenePageState
} from './ADT3DScenePage.state';
import {
    SET_ADT_SCENE_CONFIG,
    SET_CURRENT_STEP,
    SET_ERRORS,
    SET_SELECTED_SCENE,
    SET_ERROR_CALLBACK
} from '../../Models/Constants/ActionTypes';
import {
    IADTInstance,
    IComponentError
} from '../../Models/Constants/Interfaces';
import { ADT3DSceneBuilderContainer } from './Internal/ADT3DSceneBuilderContainer';
import useAdapter from '../../Models/Hooks/useAdapter';
import ScenePageErrorHandlingWrapper from '../../Components/ScenePageErrorHandlingWrapper/ScenePageErrorHandlingWrapper';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import EnvironmentPicker from '../../Components/EnvironmentPicker/EnvironmentPicker';
import ADTAdapter from '../../Adapters/ADTAdapter';
import {
    I3DScenesConfig,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    DeeplinkContext,
    DeeplinkContextActionType,
    DeeplinkContextReducer
} from '../../Contexts/3DSceneDeeplinkContext';

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

    // set the initial state for the Deeplink reducer
    const [deeplinkState, deeplinkDispatch] = useReducer(
        DeeplinkContextReducer,
        {
            adtUrl:
                // 'https://' + 'mitchtest.api.wus2.digitaltwins.azure.net' ||
                'https://' + adapter.getAdtHostUrl(),
            mode: ADT3DScenePageModes.BuildScene,
            sceneId: 'f7053e7537048e03be4d1e6f8f93aa8a',
            // sceneId: '58e02362287440d9a5bf3f8d6d6bfcf9',
            selectedElementId: '',
            selectedLayerIds: [],
            storageUrl:
                // 'https://cardboardresources.blob.core.windows.net/msnyder' ||
                adapter.getBlobContainerURL()
        }
    );

    const { t } = useTranslation();
    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [
            adapter,
            deeplinkState.storageUrl,
            state.selectedScene
        ]
    });

    const resetConfig = useAdapter({
        adapterMethod: () => adapter.resetSceneConfig(),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });
    const setSelectedSceneId = useCallback(
        (sceneId: string | undefined) => {
            // store the new step on the context
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_SCENE_ID,
                payload: { sceneId }
            });
        },
        [dispatch]
    );
    const setCurrentStep = useCallback(
        (step: ADT3DScenePageSteps) => {
            // store the new step on the context
            dispatch({
                type: SET_CURRENT_STEP,
                payload: step
            });
        },
        [dispatch]
    );
    const setMode = useCallback(
        (mode: ADT3DScenePageModes) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_MODE,
                payload: {
                    mode
                }
            });
        },
        [deeplinkDispatch]
    );
    const setBlobContainerUrl = useCallback(
        (url: string) => {
            // store url to context
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_STORAGE_URL,
                payload: { url }
            });
            adapter.setBlobContainerPath(url);
        },
        [dispatch, adapter]
    );

    const handleOnHomeClick = useCallback(() => {
        console.log(`***Home click`);
        setSelectedSceneId(null);
        setCurrentStep(ADT3DScenePageSteps.SceneLobby);
    }, [setSelectedSceneId, setCurrentStep]);

    const handleOnSceneClick = useCallback(
        (scene: IScene) => {
            console.log(`***Scene click`, scene);
            setSelectedSceneId(scene?.id);
            setMode(ADT3DScenePageModes.BuildScene);
            setCurrentStep(ADT3DScenePageSteps.Scene);
        },
        [setSelectedSceneId, setCurrentStep]
    );

    const handleOnClickGlobe = useCallback(() => {
        console.log(`***Globe click`);
        setSelectedSceneId(null);
        setMode(ADT3DScenePageModes.Globe);
        setCurrentStep(ADT3DScenePageSteps.Scene);
    }, [setSelectedSceneId, setCurrentStep]);

    const handleContainerUrlChange = (
        containerUrl: string,
        containerUrls: Array<string>
    ) => {
        console.log(`***Storage change`, containerUrl);
        setBlobContainerUrl(containerUrl);
        if (environmentPickerOptions?.storage?.onContainerChange) {
            environmentPickerOptions.storage.onContainerChange(
                containerUrl,
                containerUrls
            );
        }
    };

    const handleEnvironmentUrlChange = useCallback(
        (env: string | IADTInstance, envs: Array<string | IADTInstance>) => {
            const url =
                typeof env === 'string'
                    ? env.replace('https://', '')
                    : env.hostName;
            console.log(`***ADT change`, env);
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_ADT_URL,
                payload: {
                    url
                }
            });
            if (environmentPickerOptions?.environment?.onEnvironmentChange) {
                environmentPickerOptions.environment.onEnvironmentChange(
                    env,
                    envs
                );
            }
        },
        [
            deeplinkDispatch,
            environmentPickerOptions?.environment?.onEnvironmentChange
        ]
    );

    // update the adapter if the ADT instance changes
    useEffect(() => {
        adapter.setAdtHostUrl(deeplinkState.adtUrl);
    }, [deeplinkState.adtUrl, adapter]);

    useEffect(() => {
        console.log(`***Scene id change`, deeplinkState.sceneId);
        const storeScene = (scene: IScene | null) => {
            // store the new scene on the context
            dispatch({
                type: SET_SELECTED_SCENE,
                payload: scene
            });
        };

        const sceneId = deeplinkState.sceneId;
        const scenes = state?.scenesConfig?.configuration?.scenes;
        if (!sceneId) {
            storeScene(null);
            return;
        }
        if (scenes) {
            console.log(`***Looking for scene`, scenes);
            const scene = scenes.find((x) => x.id === sceneId);
            console.log(`***Scene found`, scene);
            if (scene) {
                storeScene(scene);
            }
        }
    }, [deeplinkState.sceneId, state?.scenesConfig?.configuration?.scenes]);

    // store the scene config when the fetch resolves
    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: I3DScenesConfig = scenesConfig.adapterResult.getData();
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
        if (
            state?.errors?.[0]?.type ===
                ComponentErrorType.UnauthorizedAccess ||
            state?.errors?.[0]?.type === ComponentErrorType.NonExistentBlob
        ) {
            dispatch({
                type: SET_ERROR_CALLBACK,
                payload: {
                    buttonText: t('learnMore'),
                    buttonAction: () => {
                        window.open(
                            'https://docs.microsoft.com/azure/digital-twins/'
                        );
                    }
                }
            });
        } else if (
            state?.errors?.[0]?.type === ComponentErrorType.JsonSchemaError
        ) {
            dispatch({
                type: SET_ERROR_CALLBACK,
                payload: {
                    buttonText: 'Reset Configuration File',
                    buttonAction: async () => {
                        await resetConfig.callAdapter();
                        await scenesConfig.callAdapter();
                    }
                }
            });
        }
    }, [state.errors]);

    console.log(`***Deeplink state:`, deeplinkState);

    return (
        <ADT3DScenePageContext.Provider
            value={{ state, dispatch, handleOnHomeClick, handleOnSceneClick }}
        >
            <DeeplinkContext.Provider
                value={{ state: deeplinkState, dispatch: deeplinkDispatch }}
            >
                <div className="cb-scene-page-wrapper">
                    <BaseComponent
                        theme={theme}
                        locale={locale}
                        localeStrings={localeStrings}
                        containerClassName={'cb-scene-page-container'}
                    >
                        {state.currentStep ===
                            ADT3DScenePageSteps.SceneLobby && (
                            <>
                                <div className="cb-scene-page-scene-environment-picker">
                                    <EnvironmentPicker
                                        adapter={adapter as ADTAdapter}
                                        shouldPullFromSubscription={
                                            environmentPickerOptions
                                                ?.environment
                                                ?.shouldPullFromSubscription
                                        }
                                        {...(deeplinkState.adtUrl && {
                                            environmentUrl: deeplinkState.adtUrl
                                        })}
                                        onEnvironmentUrlChange={
                                            handleEnvironmentUrlChange
                                        }
                                        {...(environmentPickerOptions
                                            ?.environment
                                            ?.isLocalStorageEnabled && {
                                            isLocalStorageEnabled: true,
                                            localStorageKey:
                                                environmentPickerOptions
                                                    ?.environment
                                                    ?.localStorageKey,
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
                                            ...(environmentPickerOptions
                                                ?.storage
                                                ?.isLocalStorageEnabled && {
                                                isLocalStorageEnabled: true,
                                                localStorageKey:
                                                    environmentPickerOptions
                                                        ?.storage
                                                        ?.localStorageKey,
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
                            primaryClickAction={{
                                buttonText: state?.errorCallback?.buttonText,
                                onClick: state?.errorCallback?.buttonAction
                            }}
                        >
                            {state.currentStep ===
                                ADT3DScenePageSteps.SceneLobby && (
                                <div className="cb-scene-page-scene-list-container">
                                    {deeplinkState.storageUrl && (
                                        <SceneList
                                            key={deeplinkState.storageUrl}
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
                                                    onClick: handleOnClickGlobe,
                                                    text: t('globe')
                                                }
                                            ]}
                                        />
                                    )}
                                </div>
                            )}
                            {state.currentStep ===
                                ADT3DScenePageSteps.Scene && (
                                <>
                                    <div className="cb-scene-builder-and-viewer-container">
                                        <ADT3DSceneBuilderContainer
                                            mode={deeplinkState.mode}
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
            </DeeplinkContext.Provider>
        </ADT3DScenePageContext.Provider>
    );
};

export default React.memo(ADT3DScenePage);
