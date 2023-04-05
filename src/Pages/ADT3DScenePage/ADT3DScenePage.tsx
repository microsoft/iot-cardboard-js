import React, {
    createContext,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
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
// Set cors properties perm error which is a special case of UnauthorizedAccess error
const setCorsPropertiesNotAuthorizedError: IComponentError[] = [
    {
        type: ComponentErrorType.SetCorsPropertiesNotAuthorized
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
    const [
        isEnvironmentPickerDialogOpen,
        setIsEnvironmentPickerDialogOpen
    ] = useState(false);

    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );

    const customStyles = getStyles(
        deeplinkState.mode === ADT3DScenePageModes.BuildScene &&
            state.currentStep === ADT3DScenePageSteps.Scene
    );

    const checkCORSPropertiesAdapterData = useAdapter({
        adapterMethod: (params: { adtUrl: string }) =>
            adapter.checkCORSProperties(params.adtUrl),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    const setCorsPropertiesAdapterData = useAdapter({
        adapterMethod: () => adapter.setBlobServiceCorsProperties(),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        isAdapterCalledOnMount: false, // don't fetch scenes config until making sure cors is all good with getCorsPropertiesAdapterData call
        refetchDependencies: []
    });
    const resetConfig = useAdapter({
        adapterMethod: () => adapter.resetSceneConfig(),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    const connectionState = useAdapter({
        adapterMethod: (params: { adtUrl: string }) =>
            adapter.getTimeSeriesConnectionInformation(
                params.adtUrl,
                true,
                true
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
        connectionState.callAdapter({
            adtUrl: deeplinkState.adtUrl
        });
        dispatch({
            type: ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
            payload: {
                adxConnectionInformation: {
                    connection: null,
                    loadingState: ADXConnectionInformationLoadingState.LOADING
                }
            }
        });
    }, [deeplinkState.adtResourceId, deeplinkState.adtUrl, adapter]);

    // update the adapter if the ADT instance changes
    useEffect(() => {
        adapter.setAdtHostUrl(deeplinkState.adtUrl);
        if (environmentPickerOptions?.adt?.selectedItemLocalStorageKey) {
            setLocalStorageItem(
                // TODO: instead should we expose a prop in ConsumerDeepLinkContext like "onAdtUrlChange" and
                // do this update in the consumer side not to rely on environmentPickerOptions local storage key?
                environmentPickerOptions.adt.selectedItemLocalStorageKey,
                JSON.stringify({ appAdtUrl: deeplinkState.adtUrl })
            );
        }
    }, [adapter, deeplinkState.adtUrl]);

    // update the adapter if the Storage instance changes
    useEffect(() => {
        adapter.setBlobContainerPath(deeplinkState.storageUrl);
        if (environmentPickerOptions?.storage?.selectedItemLocalStorageKey) {
            setLocalStorageItem(
                // TODO: instead should we expose a prop in ConsumerDeepLinkContext like "onContainerChange" and
                // do this update in the consumer side not to rely on environmentPickerOptions local storage key?
                environmentPickerOptions.storage.selectedItemLocalStorageKey,
                deeplinkState.storageUrl
            );
        }
        if (deeplinkState.storageUrl) {
            checkCORSPropertiesAdapterData.callAdapter({
                adtUrl: deeplinkState.adtUrl
            });
        }
    }, [adapter, deeplinkState.storageUrl, deeplinkState.adtUrl]);

    // update the adapter when adx connection information changes
    useEffect(() => {
        adapter.setADXConnectionInformation(
            state.adxConnectionInformation.connection
        );
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

    useEffect(() => {
        if (!deeplinkState.storageUrl || deeplinkState.storageUrl === '') {
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: nullContainerError }
            });
            errorCallbackSetRef.current = false;
        }
        if (!deeplinkState.adtUrl || deeplinkState.adtUrl === '') {
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: nullAdtInstanceError }
            });
            errorCallbackSetRef.current = false;
        }
    }, [deeplinkState.storageUrl, deeplinkState.adtUrl]);

    // store the scene config when the fetch resolves
    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: I3DScenesConfig = scenesConfig.adapterResult.getData();
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ADT_SCENE_CONFIG,
                payload: { scenesConfig: config }
            });
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: [] }
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
            errorCallbackSetRef.current = false;
        }
    }, [scenesConfig.adapterResult]);

    // set the error callbacks for button actions of the ScenePageErrorHandlingWrapper component
    // ScenePageErrorHandlingWrapper is intended to have single action with learn more button and illustration by default if not specified otherwise
    // but for a certain type of error - ComponentErrorType.UnauthorizedAccess - we handle it internally with a stepper wizard since multiple steps required
    useEffect(() => {
        if (state?.errors.length > 0) {
            if (!errorCallbackSetRef.current) {
                switch (state?.errors?.[0]?.type) {
                    case ComponentErrorType.CORSError:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: state?.errors?.[0]
                                            ?.isCatastrophic
                                            ? t(
                                                  'scenePageErrorHandling.resolveIssues'
                                              )
                                            : t(
                                                  'scenePageErrorHandling.applyUpdates'
                                              ),
                                        buttonAction: async () => {
                                            setCorsPropertiesAdapterData.callAdapter();
                                            errorCallbackSetRef.current = false;
                                        }
                                    },
                                    ...(!state?.errors?.[0]?.isCatastrophic && {
                                        secondary: {
                                            buttonText: t('dismiss'),
                                            buttonAction: () => {
                                                errorCallbackSetRef.current = false;
                                                scenesConfig.callAdapter();
                                            }
                                        }
                                    }),
                                    link: {
                                        buttonText: t('learnMore'),
                                        buttonAction: () => {
                                            window.open(
                                                DOCUMENTATION_LINKS.howToPrerequisites
                                            );
                                            errorCallbackSetRef.current = false;
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    case ComponentErrorType.ForceCORSError:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t('learnMore'),
                                        buttonAction: async () => {
                                            window.open(
                                                DOCUMENTATION_LINKS.howToPrerequisites
                                            );
                                            errorCallbackSetRef.current = false;
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    case ComponentErrorType.ConnectionError:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t('learnMore'),
                                        buttonAction: () => {
                                            window.open(
                                                DOCUMENTATION_LINKS.howToPrerequisites
                                            );
                                            errorCallbackSetRef.current = false;
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    case ComponentErrorType.JsonSchemaError:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
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
                            }
                        });
                        break;
                    case ComponentErrorType.NoContainerUrl:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t(
                                            'scenePageErrorHandling.configureEnvironment'
                                        ),
                                        buttonAction: () => {
                                            errorCallbackSetRef.current = false;
                                            setIsEnvironmentPickerDialogOpen(
                                                true
                                            );
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    case ComponentErrorType.NoADTInstanceUrl:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t(
                                            'scenePageErrorHandling.configureEnvironment'
                                        ),
                                        buttonAction: () => {
                                            errorCallbackSetRef.current = false;
                                            setIsEnvironmentPickerDialogOpen(
                                                true
                                            );
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    case ComponentErrorType.SetCorsPropertiesNotAuthorized:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t('learnMore'),
                                        buttonAction: () => {
                                            window.open(
                                                DOCUMENTATION_LINKS.howToPrerequisites
                                            );
                                            errorCallbackSetRef.current = false;
                                        }
                                    },
                                    secondary: {
                                        buttonText: t('dismiss'),
                                        buttonAction: () => {
                                            errorCallbackSetRef.current = false;
                                            scenesConfig.callAdapter();
                                        }
                                    }
                                }
                            }
                        });
                        break;
                    default:
                        dispatch({
                            type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK,
                            payload: {
                                errorCallback: {
                                    primary: {
                                        buttonText: t('learnMore'),
                                        buttonAction: () => {
                                            window.open(
                                                DOCUMENTATION_LINKS.overviewDocSetupSection
                                            );
                                            errorCallbackSetRef.current = false;
                                        }
                                    }
                                }
                            }
                        });
                        break;
                }
                // mark that we already set the callback so we don't get an infinite loop of setting
                errorCallbackSetRef.current = true;
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
        if (checkCORSPropertiesAdapterData?.adapterResult.getErrors()) {
            const errors: Array<IComponentError> = checkCORSPropertiesAdapterData?.adapterResult.getErrors();
            // Only set errors if it is a genuine CORSError (2xx, with invalid CORS configuration)
            // This means we will swallow non-2xx errors when we check CORS
            // We want to swallow all non-2xx errors on checking CORS because users could have valid access to the content of a container
            // But may not have read access to CORS properties (which results in 403)
            // This means that users who cannot read CORS configuration may not be able to load 3D models if CORS is misconfigured
            if (
                errors?.[0]?.type === ComponentErrorType.CORSError ||
                errors?.[0]?.type === ComponentErrorType.ForceCORSError ||
                errors?.[0]?.type === ComponentErrorType.ConnectionError // which might be due to CORS or internet connection, hard to know
            ) {
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
        } else if (checkCORSPropertiesAdapterData?.adapterResult.getData()) {
            dispatch({
                type: ADT3DScenePageActionTypes.SET_ERRORS,
                payload: { errors: [] }
            });
            errorCallbackSetRef.current = false;
            scenesConfig.callAdapter();
        }
    }, [checkCORSPropertiesAdapterData?.adapterResult]);

    // if setting CORS rules is successful fetch scenes config
    useEffect(() => {
        if (
            setCorsPropertiesAdapterData?.adapterResult.result !== null &&
            !setCorsPropertiesAdapterData?.adapterResult.getErrors()
        ) {
            scenesConfig.callAdapter();
        } else if (setCorsPropertiesAdapterData?.adapterResult.getErrors()) {
            const errors: Array<IComponentError> = setCorsPropertiesAdapterData?.adapterResult.getErrors();
            if (errors[0].type === ComponentErrorType.UnauthorizedAccess) {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: setCorsPropertiesNotAuthorizedError }
                });
            } else {
                dispatch({
                    type: ADT3DScenePageActionTypes.SET_ERRORS,
                    payload: { errors: errors }
                });
            }
            errorCallbackSetRef.current = false;
        }
    }, [setCorsPropertiesAdapterData?.adapterResult]);

    // update the adx information of environment context with the fetched data
    useEffect(() => {
        if (connectionState?.adapterResult?.result) {
            if (!connectionState?.adapterResult.hasNoData()) {
                const connectionData = connectionState.adapterResult.getData();
                dispatch({
                    type:
                        ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
                    payload: {
                        adxConnectionInformation: {
                            connection: connectionData,
                            loadingState:
                                ADXConnectionInformationLoadingState.EXIST
                        }
                    }
                });
            } else {
                dispatch({
                    type:
                        ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION,
                    payload: {
                        adxConnectionInformation: {
                            connection: null,
                            loadingState:
                                ADXConnectionInformationLoadingState.NOT_EXIST
                        }
                    }
                });
            }
        }
    }, [connectionState?.adapterResult.result]);

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
                                        isDialogOpen={
                                            isEnvironmentPickerDialogOpen
                                        }
                                        onDismiss={() => {
                                            setIsEnvironmentPickerDialogOpen(
                                                false
                                            );
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
                                buttonText:
                                    state?.errorCallback?.primary.buttonText,
                                onClick:
                                    state?.errorCallback?.primary.buttonAction
                            }}
                            secondaryClickAction={
                                state?.errorCallback?.secondary
                                    ? {
                                          buttonText:
                                              state?.errorCallback?.secondary
                                                  .buttonText,
                                          onClick:
                                              state?.errorCallback?.secondary
                                                  .buttonAction
                                      }
                                    : undefined
                            }
                            linkAction={
                                state?.errorCallback?.link
                                    ? {
                                          linkText:
                                              state?.errorCallback?.link
                                                  .buttonText,
                                          onClick:
                                              state?.errorCallback?.link
                                                  .buttonAction
                                      }
                                    : undefined
                            }
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
                storageUrl: adapter.getBlobContainerURL(),
                isLocalStorageEnabled: {
                    adt:
                        props.environmentPickerOptions?.adt
                            ?.isLocalStorageEnabled,
                    storage:
                        props.environmentPickerOptions?.storage
                            ?.isLocalStorageEnabled
                }
            }}
        >
            <SceneThemeContextProvider>
                <ADT3DScenePageBase {...props} />
            </SceneThemeContextProvider>
        </DeeplinkContextProvider>
    );
};

export default React.memo(ADT3DScenePage);
