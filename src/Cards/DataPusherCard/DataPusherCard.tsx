import { Text } from '@fluentui/react/lib/Text';
import { Separator } from '@fluentui/react/lib/components/Separator/Separator';
import { TextField } from '@fluentui/react/lib/components/TextField/TextField';
import { Toggle } from '@fluentui/react/lib/components/Toggle/Toggle';
import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef
} from 'react';
import BaseCard from '../Base/Consume/BaseCard';
import './DataPusher.scss';
import {
    dataPusherReducer,
    defaultAdtDataPusherState
} from './DataPusher.state';
import {
    dataPusherActionType,
    IDataPusherContext,
    IDataPusherProps
} from './DataPusher.types';
import {
    ISeparatorStyles,
    PrimaryButton,
    ProgressIndicator,
    Stack
} from '@fluentui/react';
import { useAdapter } from '../../Models/Hooks';
import {
    DTModel,
    DTwin,
    DTwinRelationship,
    DTwinUpdateEvent
} from '../../Models/Constants/Interfaces';
import AssetSimulation from '../../Models/Classes/Simulations/AssetSimulation';
import NumericSpinInput from '../../Components/NumericSpinInput/NumericSpinInput';
import { useTranslation } from 'react-i18next';
import ExpandableSlideInContent from '../../Components/ExpandableContent/ExpandableContent';
import { Icon } from '@fluentui/react/lib/Icon';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

const DataPusherContext = createContext<IDataPusherContext>(null);
const useDataPusherContext = () => useContext(DataPusherContext);

const separatorStyles: Partial<ISeparatorStyles> = {
    content: { fontWeight: 'bold', paddingLeft: 0 },
    root: { marginTop: 16 }
};

const DataPusherCard = ({
    locale,
    localeStrings,
    theme,
    adapter,
    Simulation,
    initialInstanceUrl = '<your_adt_instance_url>.digitaltwins.azure.net',
    disablePastEvents = false,
    isOtherOptionsVisible = true
}: IDataPusherProps) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(dataPusherReducer, {
        ...defaultAdtDataPusherState,
        instanceUrl: initialInstanceUrl,
        disablePastEvents,
        isOtherOptionsVisible
    });

    const intervalRef = useRef(null);

    const modelState = useAdapter({
        adapterMethod: (params: { models: DTModel[] }) =>
            adapter.createModels(params.models),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const relationshipState = useAdapter({
        adapterMethod: (params: { relationships: DTwinRelationship[] }) =>
            adapter.createRelationships(params.relationships),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const twinState = useAdapter({
        adapterMethod: (params: { twins: DTwin[] }) =>
            adapter.createTwins(params.twins),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const updateTwinState = useAdapter({
        adapterMethod: (params: { events: Array<DTwinUpdateEvent> }) =>
            adapter.updateTwins(params.events),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const stopSimulation = () => {
        dispatch({
            type: dataPusherActionType.SET_IS_SIMULATION_RUNNING,
            payload: false
        });
        clearInterval(intervalRef.current);
        adapter.packetNumber = 0;
    };

    const startSimulation = () => {
        dispatch({
            type: dataPusherActionType.SET_IS_SIMULATION_RUNNING,
            payload: true
        });

        // Clear any prior interval
        clearInterval(intervalRef.current);

        // Live simulator
        const startLiveSimulation = () => {
            const sim = new Simulation(
                new Date().valueOf(),
                state.liveStreamFrequency * 1000
            );

            intervalRef.current = setInterval(() => {
                const events = sim.tick();
                updateTwinState.callAdapter({ events });
            }, state.liveStreamFrequency * 1000);
        };

        const startDateMillis = state.isDataBackFilled
            ? new Date().valueOf() - state.daysToSimulate * 86400000
            : new Date().valueOf(); // get starting date

        // Quick fill simulator
        const sim = new Simulation(startDateMillis, state.dataSpacing);

        intervalRef.current = setInterval(() => {
            if (
                sim.seedTimeMillis > new Date().valueOf() &&
                state.isLiveDataSimulated
            ) {
                // Change to live simulation
                console.log('Reached "now", beginning live simulation');
                clearInterval(intervalRef.current);
                startLiveSimulation();
            }
            const events = sim.tick();
            updateTwinState.callAdapter({ events });
        }, state.quickStreamFrequency);
    };

    const generateEnvironment = async () => {
        const assetSimulation = new AssetSimulation(0, 0);
        const models = assetSimulation.generateDTModels(
            state.includeImagesForModel
        );
        const twins = assetSimulation.generateDTwins(
            state.includeImagesForModel
        );
        const relationships = assetSimulation.generateTwinRelationships();
        await modelState.callAdapter({ models });
        await twinState.callAdapter({ twins });
        await relationshipState.callAdapter({ relationships });
    };

    // Update adapter's ADT Url when input changes
    useEffect(() => {
        adapter.adtHostUrl = state.instanceUrl;
    }, [state.instanceUrl]);

    // Safely unmount
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        // 409 error means duplicate models in environment -- OK
        if (
            (modelState.adapterResult?.getCatastrophicError()?.rawError as any)
                ?.request?.status === 409 ||
            modelState.adapterResult?.getData()
        ) {
            dispatch({
                type: dataPusherActionType.SET_ARE_MODELS_READY,
                payload: true
            });
        }
    }, [modelState.adapterResult]);

    useEffect(() => {
        if (twinState.adapterResult?.getData()) {
            dispatch({
                type: dataPusherActionType.SET_ARE_TWINS_READY,
                payload: true
            });
        }
    }, [twinState.adapterResult]);

    useEffect(() => {
        if (relationshipState.adapterResult?.getData()) {
            dispatch({
                type: dataPusherActionType.SET_ARE_RELATIONSHIPS_READY,
                payload: true
            });
        }
    }, [relationshipState.adapterResult]);

    useEffect(() => {
        const data = updateTwinState.adapterResult?.getData();
        if (data) {
            dispatch({
                type: dataPusherActionType.SET_LIVE_STATUS,
                payload: {
                    packetNumber: adapter.packetNumber,
                    totalTwinsPatched: data?.length ?? 0,
                    totalSuccessfulPatches:
                        data?.length > 0
                            ? data.reduce(
                                  (acc, curr) =>
                                      curr?.status === 204 ? acc + 1 : acc,
                                  0
                              )
                            : 0
                }
            });
        }
    }, [updateTwinState.adapterResult]);

    useEffect(() => {
        if (
            state.simulationStatus.areModelsReady &&
            state.simulationStatus.areTwinsReady &&
            state.simulationStatus.areRelationshipsReady
        ) {
            dispatch({
                type: dataPusherActionType.SET_IS_ENVIRONMENT_READY,
                payload: true
            });
        }
    }, [
        state.simulationStatus.areModelsReady,
        state.simulationStatus.areTwinsReady,
        state.simulationStatus.areRelationshipsReady
    ]);

    return (
        <BaseCard
            isLoading={false}
            adapterResult={null}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            title={t('dataPusher.dataPusherTitle')}
        >
            <DataPusherContext.Provider value={{ state, dispatch }}>
                <div className="cb-datapusher-container">
                    <AdtDataPusher />
                    <div className="cb-datapusher-footer">
                        <Stack
                            horizontal
                            styles={{
                                root: {
                                    width: 800
                                }
                            }}
                            tokens={{ childrenGap: 16 }}
                        >
                            <PrimaryButton
                                text={t('dataPusher.generateEnvironment')}
                                disabled={state.isEnvironmentReady}
                                onClick={() => {
                                    generateEnvironment();
                                }}
                            />

                            <PrimaryButton
                                text={
                                    state.isSimulationRunning
                                        ? t('dataPusher.stopSimulation')
                                        : t('dataPusher.startSimulation')
                                }
                                disabled={
                                    (!state.isSimulationRunning &&
                                        !state.isDataBackFilled &&
                                        !state.isLiveDataSimulated) ||
                                    !state.isEnvironmentReady
                                }
                                onClick={() =>
                                    state.isSimulationRunning
                                        ? stopSimulation()
                                        : startSimulation()
                                }
                            />
                        </Stack>
                    </div>
                </div>
            </DataPusherContext.Provider>
        </BaseCard>
    );
};

const SimulationStatus = () => {
    const { t } = useTranslation();
    const { state } = useDataPusherContext();

    const StatusIndicator = ({ label, ready }) => {
        const iconStyles = {
            root: {
                fontSize: 8,
                width: 20,
                color: 'var(--cb-color-inactive)'
            }
        };

        const checkMarkStyles = {
            root: {
                fontSize: 14,
                width: 20,
                fontWeight: 'bold',
                color: 'var(--cb-color-theme-primary)'
            }
        };
        return (
            <div className="cb-status-row-container">
                {ready ? (
                    <Icon iconName={'Checkmark'} styles={checkMarkStyles} />
                ) : (
                    <Icon iconName={'StatusCircleOuter'} styles={iconStyles} />
                )}
                <Text variant={'medium'}>{label}</Text>
            </div>
        );
    };

    return (
        <div>
            {!state.isSimulationRunning ? (
                <>
                    <StatusIndicator
                        label={t('dataPusher.models')}
                        ready={state.simulationStatus.areModelsReady}
                    />
                    <StatusIndicator
                        label={t('dataPusher.twins')}
                        ready={state.simulationStatus.areTwinsReady}
                    />
                    <StatusIndicator
                        label={t('dataPusher.relationships')}
                        ready={state.simulationStatus.areRelationshipsReady}
                    />
                </>
            ) : (
                <ProgressIndicator
                    label={t('dataPusher.simulating')}
                    description={t('dataPusher.liveStatus', {
                        packetNumber:
                            state.simulationStatus.liveStatus?.packetNumber ??
                            0,
                        totalSuccessfulPatches:
                            state.simulationStatus.liveStatus
                                ?.totalSuccessfulPatches ?? 0,
                        totalTwinsPatched:
                            state.simulationStatus.liveStatus
                                ?.totalTwinsPatched ?? 0
                    })}
                />
            )}
        </div>
    );
};

const AdtDataPusher = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-adt-data-pusher">
            <TextField
                label={t('dataPusher.instanceUrl')}
                placeholder={'<your_adt_instance_url>.digitaltwins.azure.net'}
                value={state.instanceUrl}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_INSTANCE_URL,
                        payload: newValue
                            .replace('https://', '')
                            .replace('http://', '')
                    })
                }
                styles={{
                    fieldGroup: { width: '600px' },
                    root: { marginBottom: '8px' }
                }}
            />
            {!state.disablePastEvents && (
                <>
                    <Separator alignContent="start" styles={separatorStyles}>
                        {t('dataPusher.pastEventsLabel')}
                    </Separator>
                    <QuickFillDataForm />
                </>
            )}
            <Separator alignContent="start" styles={separatorStyles}>
                {t('dataPusher.liveStreamLabel')}
            </Separator>
            <LiveStreamDataForm />
            {state.isOtherOptionsVisible && (
                <>
                    <Separator alignContent="start" styles={separatorStyles}>
                        {t('dataPusher.otherOptionsLabel')}
                    </Separator>
                    <OtherOptionsForm />
                </>
            )}
            <Separator alignContent="start" styles={separatorStyles}>
                {t('dataPusher.simulationStatus')}
            </Separator>
            <SimulationStatus />
        </div>
    );
};

const QuickFillDataForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-quick-fill-data-form-container">
            <Toggle
                label=""
                checked={state.isDataBackFilled}
                onText={t('on')}
                offText={t('off')}
                onChange={(_e, checked) =>
                    dispatch({
                        type: dataPusherActionType.SET_IS_DATA_BACK_FILLED,
                        payload: checked
                    })
                }
                styles={{ root: { marginBottom: 0, marginTop: 4 } }}
            />
            <FormFieldDescription>
                {state.isDataBackFilled
                    ? t('dataPusher.pastEventsDescriptionOn')
                    : t('dataPusher.pastEventsDescriptionOff')}
            </FormFieldDescription>

            <ExpandableSlideInContent isExpanded={state.isDataBackFilled}>
                <Stack tokens={{ childrenGap: 8 }}>
                    <div>
                        <NumericSpinInput
                            label={t('dataPusher.daysToSimulateLabel')}
                            width={125}
                            min={1}
                            max={1000}
                            step={1}
                            suffix={t('dataPusher.days')}
                            value={state.daysToSimulate}
                            onChange={(newValue) => {
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                    payload: newValue
                                });
                            }}
                            onIncrement={(newValue) =>
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                    payload: newValue
                                })
                            }
                            onDecrement={(newValue) =>
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                    payload: newValue
                                })
                            }
                        />
                        <FormFieldDescription>
                            {t('dataPusher.daysToSimulateDescription')}
                        </FormFieldDescription>
                    </div>
                    <div>
                        <NumericSpinInput
                            label={t('dataPusher.dataSpacingLabel')}
                            width={125}
                            min={100}
                            max={Infinity}
                            step={1000}
                            suffix={'ms'}
                            value={state.dataSpacing}
                            onChange={(newValue) => {
                                dispatch({
                                    type: dataPusherActionType.SET_DATA_SPACING,
                                    payload: newValue
                                });
                            }}
                            onIncrement={(newValue) =>
                                dispatch({
                                    type: dataPusherActionType.SET_DATA_SPACING,
                                    payload: newValue
                                })
                            }
                            onDecrement={(newValue) =>
                                dispatch({
                                    type: dataPusherActionType.SET_DATA_SPACING,
                                    payload: newValue
                                })
                            }
                        />
                        <FormFieldDescription>
                            {t('dataPusher.dataSpacingDescription')}
                        </FormFieldDescription>
                    </div>
                    <div>
                        <NumericSpinInput
                            label={t('dataPusher.quickStreamFrequencyLabel')}
                            width={125}
                            min={1000}
                            max={Infinity}
                            step={100}
                            suffix={'ms'}
                            value={state.quickStreamFrequency}
                            onChange={(newValue) => {
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                                    payload: newValue
                                });
                            }}
                            onIncrement={(newValue) =>
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                                    payload: newValue
                                })
                            }
                            onDecrement={(newValue) =>
                                dispatch({
                                    type:
                                        dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                                    payload: newValue
                                })
                            }
                        />
                        <FormFieldDescription>
                            {t('dataPusher.quickStreamFrequencyDescription')}
                        </FormFieldDescription>
                    </div>
                </Stack>
            </ExpandableSlideInContent>
        </div>
    );
};

const LiveStreamDataForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-live-stream-data-form-container">
            {!state.disablePastEvents && (
                <>
                    <Toggle
                        label=""
                        checked={state.isLiveDataSimulated}
                        onText={t('on')}
                        offText={t('off')}
                        onChange={(_e, checked) =>
                            dispatch({
                                type:
                                    dataPusherActionType.SET_IS_LIVE_DATA_SIMULATED,
                                payload: checked
                            })
                        }
                        styles={{ root: { marginBottom: 0, marginTop: 4 } }}
                    />
                    <FormFieldDescription>
                        {state.isLiveDataSimulated
                            ? t('dataPusher.liveStreamDescriptionOn')
                            : t('dataPusher.liveStreamDescriptionOff')}
                    </FormFieldDescription>
                </>
            )}
            <ExpandableSlideInContent isExpanded={state.isLiveDataSimulated}>
                <div className="cb-live-stream-data-form-options">
                    <NumericSpinInput
                        label={t('dataPusher.liveStreamFrequencyLabel')}
                        width={125}
                        min={1}
                        max={Infinity}
                        step={1}
                        suffix={
                            state.liveStreamFrequency === 1
                                ? 'second'
                                : 'seconds'
                        }
                        value={state.liveStreamFrequency}
                        onChange={(newValue) => {
                            dispatch({
                                type:
                                    dataPusherActionType.SET_LIVE_STREAM_FREQUENCY,
                                payload: newValue
                            });
                        }}
                        onIncrement={(newValue) =>
                            dispatch({
                                type:
                                    dataPusherActionType.SET_LIVE_STREAM_FREQUENCY,
                                payload: newValue
                            })
                        }
                        onDecrement={(newValue) =>
                            dispatch({
                                type:
                                    dataPusherActionType.SET_LIVE_STREAM_FREQUENCY,
                                payload: newValue
                            })
                        }
                    />
                    <FormFieldDescription>
                        {t('dataPusher.liveStreamFrequencyDescription')}
                    </FormFieldDescription>
                </div>
            </ExpandableSlideInContent>
        </div>
    );
};

const OtherOptionsForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();

    return (
        <div className="cb-other-options-form-container">
            <Toggle
                label="Include images for model"
                checked={state.includeImagesForModel}
                onText="On"
                offText="Off"
                onChange={(_e, checked) =>
                    dispatch({
                        type: dataPusherActionType.SET_INCLUDE_IMAGES_FOR_MODEL,
                        payload: checked
                    })
                }
                styles={{ root: { marginBottom: 0 } }}
            />
            {state.includeImagesForModel ? (
                <FormFieldDescription>
                    {t('dataPusher.includeImagesDescriptionOn')}
                </FormFieldDescription>
            ) : (
                <FormFieldDescription>
                    {t('dataPusher.includeImagesDescriptionOff')}
                </FormFieldDescription>
            )}
        </div>
    );
};

const FormFieldDescription = ({ children }: { children: React.ReactNode }) => {
    const styles = (_props, theme) => ({
        root: {
            color: theme.palette.neutralSecondary
        }
    });

    return (
        <div className="cb-form-field-description">
            <Text variant={'small'} styles={styles}>
                {children}
            </Text>
        </div>
    );
};

export default withErrorBoundary(DataPusherCard);
