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
    ADT3DScenePageActionTypes,
    ADXConnectionInformationLoadingState,
    IADT3DScenePageContext,
    IADT3DScenePageProps
} from './ADT3DScenePage.types';
import './ADT3DScenePage.scss';
import {
    ADT3DScenePageReducer,
    defaultADT3DScenePageState
} from './ADT3DScenePage.state';
import {
    IADTInstance,
    IAzureStorageAccount,
    IAzureStorageBlobContainer,
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
import SceneListModeToggle from './Internal/SceneListModeToggle';
import {
    useDeeplinkContext,
    DeeplinkContextProvider
} from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import ADT3DGlobe from '../../Components/ADT3DGlobe/ADT3DGlobe';
import { getStyles } from './ADT3DScenePage.styles';
import { Stack } from '@fluentui/react';
import DeeplinkFlyout from '../../Components/DeeplinkFlyout/DeeplinkFlyout';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { SceneThemeContextProvider } from '../../Models/Context';
import { DOCUMENTATION_LINKS } from '../../Models/Constants/Constants';
import { setLocalStorageItem } from '../../Models/Services/LocalStorageManager/LocalStorageManager';

export const ADT3DScenePageContext = createContext<IADT3DScenePageContext>(
    null
);

// Set container missing error
const nullContainerError: IComponentError[] = [
    {
        type: ComponentErrorType.NoContainerUrl
    }
];
// Set container missing error
const nullAdtInstanceError: IComponentError[] = [
    {
        type: ComponentErrorType.NoADTInstanceUrl
    }
];

const ADT3DScenePageBase: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    environmentPickerOptions,
    enableTwinPropertyInspectorPatchMode = false
}) => {
    const { t } = useTranslation();
    const errorCallbackSetRef = useRef<boolean>(false);
    const { deeplinkDispatch, deeplinkState } = useDeeplinkContext();

    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );

    const customStyles = getStyles(
        deeplinkState.mode === ADT3DScenePageModes.BuildScene &&
            state.currentStep === ADT3DScenePageSteps.Scene
    );

    const getCorsPropertiesAdapterData = useAdapter({
        adapterMethod: () => adapter.getBlobServiceCorsProperties(),
        refetchDependencies: [adapter, deeplinkState.storageUrl]
    });

    const setCorsPropertiesAdapterData = useAdapter({
        adapterMethod: () => adapter.setBlobServiceCorsProperties(),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter, deeplinkState.storageUrl]
    });

    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        isAdapterCalledOnMount: false, // don't fetch scenes config until making sure cors is all good with getCorsPropertiesAdapterData call
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

    const connectionState = useAdapter({
        adapterMethod: (params: {
            adtInstanceIdentifier: { id?: string; hostName?: string };
        }) =>
            adapter.getTimeSeriesConnectionInformation(
                params.adtInstanceIdentifier
            ),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
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
                type: ADT3DScenePageActionTypes.SET_CURRENT_STEP,
                payload: { currentStep: step }
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

    const handleOnSceneSwap = useCallback(
        (sceneId: string) => {
            setSelectedSceneId(sceneId);
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_ELEMENT_ID,
                payload: { id: '' }
            });
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_LAYER_IDS,
                payload: { ids: [] }
            });
        },
        [setSelectedSceneId]
    );

    const handleContainerChange = useCallback(
        (
            storageAccount: string | IAzureStorageAccount,
            storageContainer: string | IAzureStorageBlobContainer,
            storageContainers: Array<string | IAzureStorageBlobContainer>
        ) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_STORAGE_CONTAINER,
                payload: { storageContainer, storageAccount }
            });

            if (environmentPickerOptions?.storage?.onContainerChange) {
                environmentPickerOptions.storage.onContainerChange(
                    storageContainer,
                    storageContainers
                );
            }
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: [] }
            });
            errorCallbackSetRef.current = false;
        },
        [environmentPickerOptions?.storage]
    );

    const handleAdtInstanceChange = useCallback(
        (
            adtInstance: string | IADTInstance,
            adtInstances: Array<string | IADTInstance>
        ) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_ADT_INSTANCE,
                payload: {
                    adtInstance
                }
            });
            if (environmentPickerOptions?.adt?.onAdtInstanceChange) {
                environmentPickerOptions.adt.onAdtInstanceChange(
                    adtInstance,
                    adtInstances
                );
            }
        },
        [deeplinkDispatch, environmentPickerOptions?.adt]
    );

    // if the adx connection information is not in the environment context. fetch it and update the context
    useEffect(() => {
        if (!adapter.getADXConnectionInformation()) {
            {
                connectionState.callAdapter({
                    adtInstanceIdentifier: deeplinkState.adtResourceId
                        ? { id: deeplinkState.adtResourceId }
                        : { hostName: deeplinkState.adtUrl?.slice(7) }
                });
                dispatch({
                    type:
                        ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION_LOADING_STATE,
                    payload: {
                        adxConnectionInformationLoadingState:
                            ADXConnectionInformationLoadingState.LOADING
                    }
                });
                dispatch({
                    type:
                        ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
                    payload: {
                        adxConnectionInformation: null
                    }
                });
            }
        }
    }, [deeplinkState.adtResourceId, deeplinkState.adtUrl, adapter]);

    // update the adapter if the ADT instance changes
    useEffect(() => {
        adapter.setAdtHostUrl(deeplinkState.adtUrl);
        if (environmentPickerOptions?.adt?.selectedItemLocalStorageKey) {
            setLocalStorageItem(
                // TODO: instead should we expose a prop in ConsumerDeepLinkContext like "onAdtUrlChange" and
                // do this update in the consumer side not to rely on environmentPickerOptions local storage key?
                environmentPickerOptions.adt.selectedItemLocalStorageKey,
                deeplinkState.adtUrl
            );
        }
    }, [adapter, deeplinkState.adtUrl]);

    // update the adapter if the Storage instance changes
    useEffect(() => {
        adapter.setBlobContainerPath(deeplinkState.storageUrl);
    }, [adapter, deeplinkState.storageUrl]);

    // update the adapter when adx connection information changes
    useEffect(() => {
        adapter.setADXConnectionInformation(state.adxConnectionInformation);
    }, [adapter, state.adxConnectionInformation]);

    // when a scene is selected show it
    useEffect(() => {
        if (deeplinkState.sceneId && state.scenesConfig) {
            // check if we can resolve the scene, if not, don't navigate
            const scene = ViewerConfigUtility.getSceneById(
                state.scenesConfig,
                deeplinkState.sceneId
            );
            if (scene) {
                setCurrentStep(ADT3DScenePageSteps.Scene);
            }
        }
    }, [deeplinkState.sceneId, state.scenesConfig, setCurrentStep]);

    const onListModeChange = useCallback(
        (sceneListMode: ADT3DScenePageSteps) => {
            setSelectedSceneId(null);
            setCurrentStep(sceneListMode);
        },
        [setSelectedSceneId, setCurrentStep]
    );

    // store the scene config when the fetch resolves
    useEffect(() => {
        const storageContainerNotSet =
            !deeplinkState.storageUrl || deeplinkState.storageUrl === '';
        const adtUrlNotSet =
            !deeplinkState.adtUrl || deeplinkState.adtUrl === '';
        if (
            scenesConfig.adapterResult &&
            (storageContainerNotSet || adtUrlNotSet)
        ) {
            if (storageContainerNotSet) {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: nullContainerError }
                });
            }
            if (adtUrlNotSet) {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: nullAdtInstanceError }
                });
            }
        } else {
            if (!scenesConfig.adapterResult.hasNoData()) {
                const config: I3DScenesConfig = scenesConfig.adapterResult.getData();
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ADT_SCENE_CONFIG,
                    payload: { scenesConfig: config }
                });
            } else {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ADT_SCENE_CONFIG,
                    payload: { scenesConfig: null }
                });
            }
            if (scenesConfig?.adapterResult.getErrors()) {
                const errors: Array<IComponentError> = scenesConfig?.adapterResult.getErrors();
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors }
                });
            } else {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: [] }
                });
            }
        }
    }, [
        deeplinkState.adtUrl,
        deeplinkState.storageUrl,
        scenesConfig.adapterResult
    ]);

    // set the error callbacks for button actions of the ScenePageErrorHandlingWrapper component
    // ScenePageErrorHandlingWrapper is intended to have single action with learn more button and illustration by default if not specified otherwise
    // but for a certain type of error - ComponentErrorType.UnauthorizedAccess - we handle it internally with a stepper wizard since multiple steps required
    useEffect(() => {
        if (state?.errors.length > 0) {
            if (
                state?.errors?.[0]?.type === ComponentErrorType.CORSError &&
                !errorCallbackSetRef.current
            ) {
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                    payload: {
                        errorCallback: {
                            buttonText: t(
                                'scenePageErrorHandling.resolveIssues'
                            ),
                            buttonAction: async () => {
                                setCorsPropertiesAdapterData.callAdapter();
                                errorCallbackSetRef.current = false;
                            }
                        }
                    }
                });
            } else if (
                state?.errors?.[0]?.type ===
                    ComponentErrorType.JsonSchemaError &&
                !errorCallbackSetRef.current
            ) {
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                    payload: {
                        errorCallback: {
                            buttonText: t(
                                'scenePageErrorHandling.resetConfigFile'
                            ),
                            buttonAction: async () => {
                                await resetConfig.callAdapter();
                                await scenesConfig.callAdapter();
                                errorCallbackSetRef.current = false;
                            }
                        }
                    }
                });
            } else if (
                state?.errors?.[0]?.type ===
                    ComponentErrorType.NoContainerUrl &&
                !errorCallbackSetRef.current
            ) {
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                    payload: {
                        errorCallback: {
                            buttonText: t(
                                'scenePageErrorHandling.configureEnvironment'
                            ),
                            buttonAction: () => {
                                errorCallbackSetRef.current = false;
                            }
                        }
                    }
                });
            } else if (
                state?.errors?.[0]?.type ===
                    ComponentErrorType.NoADTInstanceUrl &&
                !errorCallbackSetRef.current
            ) {
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                    payload: {
                        errorCallback: {
                            buttonText: t(
                                'scenePageErrorHandling.configureEnvironment'
                            ),
                            buttonAction: () => {
                                errorCallbackSetRef.current = false;
                            }
                        }
                    }
                });
            } else if (!errorCallbackSetRef.current) {
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                    payload: {
                        errorCallback: {
                            buttonText: t('learnMore'),
                            buttonAction: () => {
                                window.open(
                                    DOCUMENTATION_LINKS.overviewDocSetupSection
                                );
                                errorCallbackSetRef.current = false;
                            }
                        }
                    }
                });
            }
        }
    }, [
        resetConfig,
        scenesConfig,
        setCorsPropertiesAdapterData,
        state?.errors,
        t
    ]);

    // if the result of get cors request has error which we send manually if the storage's blob service
    // does not have required CORS rules in its properties, then set the errors to render ScenePageErrorHandlingWrapper component,
    // otherwise if there is no issues, clear the errors and with CORS fetch scenes config
    useEffect(() => {
        if (getCorsPropertiesAdapterData?.adapterResult.getErrors()) {
            if (!deeplinkState.storageUrl || deeplinkState.storageUrl === '') {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: nullContainerError }
                });
            } else {
                const errors: Array<IComponentError> = getCorsPropertiesAdapterData?.adapterResult.getErrors();
                // Only set errors if it is a genuine CORSError (2xx, with invalid CORS configuration)
                // This means we will swallow non-2xx errors when we check CORS
                // We want to swallow all non-2xx errors on checking CORS because users could have valid access to the content of a container
                // But may not have read access to CORS properties (which results in 403)
                // This means that users who cannot read CORS configuration may not be able to load 3D models if CORS is misconfigured
                if (errors?.[0]?.type === ComponentErrorType.CORSError) {
                    errorCallbackSetRef.current = false;
                    dispatch({
                        type: ADT3DScenePageActionTypes.SET_ERRORS,
                        payload: { errors }
                    });
                } else {
                    dispatch({
                        type: ADT3DScenePageActionTypes.SET_ERRORS,
                        payload: { errors: [] }
                    });
                    errorCallbackSetRef.current = false;
                    scenesConfig.callAdapter();
                }
            }
        } else if (getCorsPropertiesAdapterData?.adapterResult.getData()) {
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: [] }
            });
            errorCallbackSetRef.current = false;
            scenesConfig.callAdapter();
        }
    }, [deeplinkState.storageUrl, getCorsPropertiesAdapterData?.adapterResult]);

    // if setting CORS rules is successful fetch scenes config
    useEffect(() => {
        if (
            setCorsPropertiesAdapterData?.adapterResult.result !== null &&
            !setCorsPropertiesAdapterData?.adapterResult.getErrors()
        ) {
            scenesConfig.callAdapter();
        }
    }, [setCorsPropertiesAdapterData?.adapterResult]);

    // update the adx information of environment context with the fetched data
    useEffect(() => {
        if (!connectionState?.adapterResult.hasNoData()) {
            const connectionData = connectionState.adapterResult.getData();

            dispatch({
                type:
                    ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION_LOADING_STATE,
                payload: {
                    adxConnectionInformationLoadingState:
                        ADXConnectionInformationLoadingState.EXISTED
                }
            });
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
                payload: {
                    adxConnectionInformation: connectionData
                }
            });
        } else if (connectionState?.adapterResult.getData()) {
            dispatch({
                type:
                    ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION_LOADING_STATE,
                payload: {
                    adxConnectionInformationLoadingState:
                        ADXConnectionInformationLoadingState.NOT_EXISTED
                }
            });
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
                payload: {
                    adxConnectionInformation: null
                }
            });
        }
    }, [connectionState?.adapterResult]);

    return (
        <ADT3DScenePageContext.Provider
            value={{
                state,
                dispatch,
                handleOnHomeClick,
                handleOnSceneClick,
                handleOnSceneSwap,
                isTwinPropertyInspectorPatchModeEnabled: enableTwinPropertyInspectorPatchMode
            }}
        >
            <div className="cb-scene-page-wrapper">
                <BaseComponent
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    containerClassName={customStyles.container}
                >
                    {(state.currentStep === ADT3DScenePageSteps.SceneList ||
                        state.currentStep === ADT3DScenePageSteps.Globe) && (
                        <>
                            <div className={customStyles.header}>
                                <div className="cb-scene-page-scene-environment-picker">
                                    <EnvironmentPicker
                                        adapter={adapter}
                                        adtInstanceUrl={deeplinkState.adtUrl}
                                        onAdtInstanceChange={
                                            handleAdtInstanceChange
                                        }
                                        {...(environmentPickerOptions?.adt
                                            ?.isLocalStorageEnabled && {
                                            isLocalStorageEnabled: true,
                                            localStorageKey:
                                                environmentPickerOptions?.adt
                                                    ?.localStorageKey,
                                            selectedItemLocalStorageKey:
                                                environmentPickerOptions?.adt
                                                    ?.selectedItemLocalStorageKey
                                        })}
                                        storage={{
                                            containerUrl:
                                                deeplinkState.storageUrl,
                                            onContainerChange: handleContainerChange,
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
                                <Stack horizontal tokens={{ childrenGap: 8 }}>
                                    <DeeplinkFlyout
                                        mode="Simple"
                                        styles={{
                                            subComponentStyles: {
                                                headerControlGroup: {
                                                    root: {
                                                        border: 'none'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    {!state?.errors?.length && ( // show the scene list toggle mode only if there is no error
                                        <SceneListModeToggle
                                            selectedMode={state.currentStep}
                                            onListModeChange={onListModeChange}
                                        />
                                    )}
                                </Stack>
                            </div>
                        </>
                    )}
                    {state?.errors?.length > 0 ? (
                        <ScenePageErrorHandlingWrapper
                            adapter={adapter}
                            errors={state.errors}
                            primaryClickAction={{
                                buttonText: state?.errorCallback?.buttonText,
                                onClick: state?.errorCallback?.buttonAction
                            }}
                            verifyCallbackAdapterData={scenesConfig}
                        />
                    ) : (
                        state.scenesConfig && (
                            <>
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
                                            />
                                        )}
                                    </div>
                                )}
                                {state.currentStep ===
                                    ADT3DScenePageSteps.Globe && (
                                    <div className="cb-scene-page-scene-globe-container">
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
                                    ADT3DScenePageSteps.Scene && (
                                    <>
                                        <div className="cb-scene-builder-and-viewer-container">
                                            <ADT3DSceneBuilderContainer
                                                scenesConfig={
                                                    state.scenesConfig
                                                }
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
                            </>
                        )
                    )}
                </BaseComponent>
            </div>
        </ADT3DScenePageContext.Provider>
    );
};

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = (props) => {
    const { adapter } = props;
    const adtHostUrl = adapter.getAdtHostUrl();
    return (
        <DeeplinkContextProvider
            initialState={{
                adtUrl: adtHostUrl ? `https://${adtHostUrl}` : '',
                storageUrl: adapter.getBlobContainerURL()
            }}
        >
            <SceneThemeContextProvider>
                <ADT3DScenePageBase {...props} />
            </SceneThemeContextProvider>
        </DeeplinkContextProvider>
    );
};

export default React.memo(ADT3DScenePage);
