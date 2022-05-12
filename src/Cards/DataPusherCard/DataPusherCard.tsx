import { Text, Separator, TextField, Toggle } from '@fluentui/react';
import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef
} from 'react';
import BaseCard from '../BaseCard/BaseCard';
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
    Dropdown,
    IDropdownOption,
    ISeparatorStyles,
    PrimaryButton,
    ProgressIndicator,
    Stack
} from '@fluentui/react';
import { useAdapter } from '../../Models/Hooks';
import {
    AdtPusherSimulationType,
    DTwinUpdateEvent
} from '../../Models/Constants/Interfaces';
import AssetSimulation from '../../Models/Classes/Simulations/AssetSimulation';
import NumericSpinInput from '../../Components/NumericSpinInput/NumericSpinInput';
import { useTranslation } from 'react-i18next';
import ExpandableSlideInContent from '../../Components/ExpandableContent/ExpandableContent';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import GenerateADTAssets from '../../Components/GenerateADTAssets/GenerateADTAssets';

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
    initialInstanceUrl = '<your_adt_instance_url>.digitaltwins.azure.net',
    disablePastEvents = false
}: IDataPusherProps) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(dataPusherReducer, {
        ...defaultAdtDataPusherState,
        instanceUrl: initialInstanceUrl,
        disablePastEvents
    });

    const intervalRef = useRef(null);

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
            const sim = new AssetSimulation(
                new Date().valueOf(),
                state.liveStreamFrequency * 1000,
                state.simulationType
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
        const sim = new AssetSimulation(
            startDateMillis,
            state.dataSpacing,
            state.simulationType
        );

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
        const assetSimulation = new AssetSimulation(0, 0, state.simulationType);
        dispatch({
            type: dataPusherActionType.SET_MODELS,
            payload: assetSimulation.generateDTModels()
        });
        dispatch({
            type: dataPusherActionType.SET_TWINS,
            payload: assetSimulation.generateDTwins()
        });
        dispatch({
            type: dataPusherActionType.SET_RELATIONSHIPS,
            payload: assetSimulation.generateTwinRelationships()
        });
        dispatch({
            type: dataPusherActionType.SET_ARE_ASSETS_SET,
            payload: true
        });
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

    const onComplete = () => {
        dispatch({
            type: dataPusherActionType.SET_ARE_ASSETS_UPLOADED,
            payload: true
        });
    };

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
        if (state.simulationStatus.areAssetsUploaded) {
            dispatch({
                type: dataPusherActionType.SET_IS_ENVIRONMENT_READY,
                payload: true
            });
        }
    }, [state.simulationStatus.areAssetsUploaded]);
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
                    <div className="cb-adt-data-pusher">
                        <TextField
                            label={t('dataPusher.instanceUrl')}
                            placeholder={
                                '<your_adt_instance_url>.digitaltwins.azure.net'
                            }
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
                        <SimulationTypeForm />
                        {!state.disablePastEvents && (
                            <>
                                <Separator
                                    alignContent="start"
                                    styles={separatorStyles}
                                >
                                    {t('dataPusher.pastEventsLabel')}
                                </Separator>
                                <QuickFillDataForm />
                            </>
                        )}
                        <Separator
                            alignContent="start"
                            styles={separatorStyles}
                        >
                            {t('dataPusher.liveStreamLabel')}
                        </Separator>
                        <LiveStreamDataForm />
                        <Separator
                            alignContent="start"
                            styles={separatorStyles}
                        >
                            {t('dataPusher.create')}
                        </Separator>
                        <FormFieldDescription>
                            {t('dataPusher.generateEnvironmentDescription')}
                        </FormFieldDescription>
                        <div className="cb-generate-assets-container">
                            {state.areAssetsSet && (
                                <GenerateADTAssets
                                    adapter={adapter}
                                    models={state.models}
                                    twins={state.twins}
                                    relationships={state.relationships}
                                    triggerUpload={state.areAssetsSet}
                                    onComplete={onComplete}
                                />
                            )}
                            <PrimaryButton
                                text={t('dataPusher.generateEnvironment')}
                                disabled={state.areAssetsSet}
                                className={'cb-initiate-action-button'}
                                onClick={() => {
                                    generateEnvironment();
                                }}
                            />
                        </div>
                        <Separator
                            alignContent="start"
                            styles={separatorStyles}
                        >
                            {t('dataPusher.simulate')}
                        </Separator>
                        <FormFieldDescription>
                            {t('dataPusher.simulateDescription')}
                        </FormFieldDescription>
                        <div>
                            {!!state.isSimulationRunning && (
                                <ProgressIndicator
                                    label={t('dataPusher.simulating')}
                                    description={t('dataPusher.liveStatus', {
                                        packetNumber:
                                            state.simulationStatus.liveStatus
                                                ?.packetNumber ?? 0,
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
                            className={'cb-initiate-action-button'}
                        />
                    </div>
                </div>
            </DataPusherContext.Provider>
        </BaseCard>
    );
};

const SimulationTypeForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    const options: IDropdownOption[] = [
        {
            key: AdtPusherSimulationType.RobotArms,
            text: t('dataPusher.robotArms')
        },
        {
            key: AdtPusherSimulationType.DairyProduction,
            text: t('dataPusher.dairyProduction')
        }
    ];
    const onChange = (_event, item: IDropdownOption) => {
        dispatch({
            type: dataPusherActionType.SET_SIMULATION_TYPE,
            payload: item.key
        });
    };

    return (
        <Dropdown
            styles={{ root: { width: 200 } }}
            label={t('dataPusher.pusherType')}
            options={options}
            onChange={onChange}
            selectedKey={state.simulationType}
        />
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
