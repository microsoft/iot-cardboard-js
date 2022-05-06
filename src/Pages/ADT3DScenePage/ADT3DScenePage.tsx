import React, {
    createContext,
    useCallback,
    useEffect,
    useReducer,
    useRef
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
    SET_ERROR_CALLBACK
} from '../../Models/Constants/ActionTypes';
import {
    IADTInstance,
    IBlobAdapter,
    IComponentError
} from '../../Models/Constants/Interfaces';
import { ADT3DSceneBuilderContainer } from './Internal/ADT3DSceneBuilderContainer';
import useAdapter from '../../Models/Hooks/useAdapter';
import ScenePageErrorHandlingWrapper from '../../Components/ScenePageErrorHandlingWrapper/ScenePageErrorHandlingWrapper';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import EnvironmentPicker from '../../Components/EnvironmentPicker/EnvironmentPicker';
import {
    I3DScenesConfig,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ADT3DGlobeContainer from '../../Components/ADT3DGlobeContainer/ADT3DGlobeContainer';
import {
    useDeeplinkContext,
    DeeplinkContextProvider
} from '../../Models/Context/DeeplinkContext';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext.types';
import { addHttpsPrefix } from '../../Models/Services/Utils';

export const ADT3DScenePageContext = createContext<IADT3DScenePageContext>(
    null
);

const ADT3DScenePageBase: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    environmentPickerOptions
}) => {
    const { t } = useTranslation();
    const errorCallbackSetRef = useRef<boolean>(false);
    const { deeplinkDispatch, deeplinkState } = useDeeplinkContext();

    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );

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
        [deeplinkDispatch]
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
        [adapter, deeplinkDispatch]
    );

    const handleOnHomeClick = useCallback(() => {
        setSelectedSceneId(null);
        setCurrentStep(ADT3DScenePageSteps.SceneList);
    }, [setSelectedSceneId, setCurrentStep]);

    const handleOnSceneClick = useCallback(
        (scene: IScene) => {
            setSelectedSceneId(scene?.id);
            setMode(ADT3DScenePageModes.BuildScene);
            setCurrentStep(ADT3DScenePageSteps.Scene);
        },
        [setCurrentStep, setMode, setSelectedSceneId]
    );

    const handleOnClickGlobe = useCallback(() => {
        setSelectedSceneId(null);
        setCurrentStep(ADT3DScenePageSteps.Globe);
    }, [setSelectedSceneId, setCurrentStep]);

    const handleContainerUrlChange = useCallback(
        (containerUrl: string, containerUrls: Array<string>) => {
            setBlobContainerUrl(containerUrl);
            if (environmentPickerOptions?.storage?.onContainerChange) {
                environmentPickerOptions.storage.onContainerChange(
                    containerUrl,
                    containerUrls
                );
            }
        },
        [environmentPickerOptions?.storage, setBlobContainerUrl]
    );

    const handleEnvironmentUrlChange = useCallback(
        (env: string | IADTInstance, envs: Array<string | IADTInstance>) => {
            const url =
                typeof env === 'string'
                    ? env.replace('https://', '')
                    : env.hostName;
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
        [deeplinkDispatch, environmentPickerOptions?.environment]
    );

    // update the adapter if the ADT instance changes
    useEffect(() => {
        adapter.setAdtHostUrl(deeplinkState.adtUrl);
    }, [deeplinkState.adtUrl, adapter]);

    // when a scene is selected show it
    useEffect(() => {
        if (deeplinkState.sceneId) {
            setCurrentStep(ADT3DScenePageSteps.Scene);
        }
    }, [deeplinkState.sceneId, setCurrentStep]);

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

    // show error screens if needed
    useEffect(() => {
        if (
            (state?.errors?.[0]?.type ===
                ComponentErrorType.UnauthorizedAccess ||
                state?.errors?.[0]?.type ===
                    ComponentErrorType.NonExistentBlob) &&
            !errorCallbackSetRef.current
        ) {
            // mark that we already set the callback so we don't get an infinite loop of setting
            errorCallbackSetRef.current = true;
            dispatch({
                type: SET_ERROR_CALLBACK,
                payload: {
                    buttonText: t('learnMore'),
                    buttonAction: () => {
                        window.open(
                            'https://docs.microsoft.com/azure/digital-twins/'
                        );
                        errorCallbackSetRef.current = false;
                    }
                }
            });
        } else if (
            state?.errors?.[0]?.type === ComponentErrorType.JsonSchemaError &&
            !errorCallbackSetRef.current
        ) {
            // mark that we already set the callback so we don't get an infinite loop of setting
            errorCallbackSetRef.current = true;
            dispatch({
                type: SET_ERROR_CALLBACK,
                payload: {
                    buttonText: 'Reset Configuration File',
                    buttonAction: async () => {
                        await resetConfig.callAdapter();
                        await scenesConfig.callAdapter();
                        errorCallbackSetRef.current = false;
                    }
                }
            });
        }
    }, [resetConfig, scenesConfig, state?.errors, t]);

    return (
        <ADT3DScenePageContext.Provider
            value={{ state, dispatch, handleOnHomeClick, handleOnSceneClick }}
        >
            <div className="cb-scene-page-wrapper">
                <BaseComponent
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    containerClassName={'cb-scene-page-container'}
                >
                    {state.currentStep === ADT3DScenePageSteps.SceneList && (
                        <>
                            <div className="cb-scene-page-scene-environment-picker">
                                <EnvironmentPicker
                                    adapter={adapter}
                                    shouldPullFromSubscription={
                                        environmentPickerOptions?.environment
                                            ?.shouldPullFromSubscription
                                    }
                                    // temp hack until we clean up environmentPicker to output the value with https prefix
                                    // if we have a url with the prefix, use it, otherwise append the prefix
                                    // without this if you pass a value without the prefix it will crash the picker
                                    environmentUrl={addHttpsPrefix(
                                        deeplinkState.adtUrl
                                    )}
                                    onEnvironmentUrlChange={
                                        handleEnvironmentUrlChange
                                    }
                                    {...(environmentPickerOptions?.environment
                                        ?.isLocalStorageEnabled && {
                                        isLocalStorageEnabled: true,
                                        localStorageKey:
                                            environmentPickerOptions?.storage
                                                ?.localStorageKey,
                                        selectedItemLocalStorageKey:
                                            environmentPickerOptions?.storage
                                                ?.selectedItemLocalStorageKey
                                    })}
                                    storage={{
                                        containerUrl: deeplinkState.storageUrl,
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
                        primaryClickAction={{
                            buttonText: state?.errorCallback?.buttonText,
                            onClick: state?.errorCallback?.buttonAction
                        }}
                    >
                        {state.currentStep ===
                            ADT3DScenePageSteps.SceneList && (
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
                        {state.currentStep === ADT3DScenePageSteps.Scene && (
                            <>
                                <div className="cb-scene-builder-and-viewer-container">
                                    <ADT3DSceneBuilderContainer
                                        mode={deeplinkState.mode}
                                        scenesConfig={state.scenesConfig}
                                        sceneId={deeplinkState.sceneId}
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
                        {state.currentStep === ADT3DScenePageSteps.Globe && (
                            <div className="cb-scene-page-scene-globe-container">
                                <ADT3DGlobeContainer
                                    adapter={adapter as IBlobAdapter}
                                />
                            </div>
                        )}
                    </ScenePageErrorHandlingWrapper>
                </BaseComponent>
            </div>
        </ADT3DScenePageContext.Provider>
    );
};

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = (props) => {
    const { adapter } = props;
    return (
        <DeeplinkContextProvider
            initialState={{
                // note: don't add https
                adtUrl: adapter.getAdtHostUrl(),
                storageUrl: addHttpsPrefix(adapter.getBlobContainerURL())
            }}
        >
            <ADT3DScenePageBase {...props} />
        </DeeplinkContextProvider>
    );
};

export default React.memo(ADT3DScenePage);
