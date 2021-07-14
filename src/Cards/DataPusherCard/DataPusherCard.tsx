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
    IStackStyles,
    IStackTokens,
    PrimaryButton,
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

const DataPusherContext = createContext<IDataPusherContext>(null);
const useDataPusherContext = () => useContext(DataPusherContext);

const separatorStyles: Partial<ISeparatorStyles> = {
    content: { fontWeight: 'bold', paddingLeft: 0 }
};

const DataPusherCard = ({
    locale,
    localeStrings,
    theme,
    adapter,
    Simulation,
    initialInstanceUrl = '<your_adt_instance_url>.digitaltwins.azure.net'
}: IDataPusherProps) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(dataPusherReducer, {
        ...defaultAdtDataPusherState,
        instanceUrl: initialInstanceUrl
    });

    const intervalRef = useRef(null);
    const lastAdapterResult = useRef(null);

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

        console.log('starting live simulation: ', state);

        // Clear any prior interval
        clearInterval(intervalRef.current);

        // Live simulator
        const startLiveSimulation = () => {
            const sim = new Simulation(
                new Date().valueOf(),
                state.liveStreamFrequency
            );

            intervalRef.current = setInterval(() => {
                const events = sim.tick();
                updateTwinState.callAdapter({ events });
            }, state.liveStreamFrequency);
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
        relationshipState.callAdapter({ relationships });
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
        console.log('Twin state updated', twinState.adapterResult);
        lastAdapterResult.current = twinState.adapterResult;
    }, [twinState.adapterResult]);

    useEffect(() => {
        console.log('Model state updated', modelState.adapterResult);
        lastAdapterResult.current = modelState.adapterResult;
    }, [modelState.adapterResult]);

    useEffect(() => {
        console.log(
            'Relationship state updated',
            relationshipState.adapterResult
        );
        lastAdapterResult.current = relationshipState.adapterResult;
    }, [relationshipState.adapterResult]);

    useEffect(() => {
        console.log('Twin updates sent --', updateTwinState.adapterResult);
        lastAdapterResult.current = updateTwinState.adapterResult;
    }, [updateTwinState.adapterResult]);

    const stackStyles: IStackStyles = {
        root: {
            width: 800
        }
    };

    const numericalSpacingStackTokens: IStackTokens = {
        childrenGap: 16
    };

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
                            styles={stackStyles}
                            tokens={numericalSpacingStackTokens}
                        >
                            <PrimaryButton
                                text={t('dataPusher.generateEnvironment')}
                                disabled={false}
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
                                    !state.isSimulationRunning &&
                                    !state.isDataBackFilled &&
                                    !state.isLiveDataSimulated
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

const AdtDataPusher = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-adt-data-pusher">
            <TextField
                label={t('dataPusher.instanceUrl')}
                value={state.instanceUrl}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_INSTANCE_URL,
                        payload: newValue
                    })
                }
                styles={{
                    fieldGroup: { width: '600px' },
                    root: { marginBottom: '8px' }
                }}
            />
            <Separator alignContent="start" styles={separatorStyles}>
                {t('dataPusher.pastEventsLabel')}
            </Separator>
            <QuickFillDataForm />
            <Separator alignContent="start" styles={separatorStyles}>
                {t('dataPusher.liveStreamLabel')}
            </Separator>
            <LiveStreamDataForm />
            <Separator alignContent="start" styles={separatorStyles}>
                {t('dataPusher.otherOptionsLabel')}
            </Separator>
            <OtherOptionsForm />
        </div>
    );
};

const QuickFillDataForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-quick-fill-data-form">
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

            {state.isDataBackFilled ? (
                <>
                    <FormFieldDescription>
                        {t('dataPusher.pastEventsDescriptionOn')}
                    </FormFieldDescription>
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
                                type: dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                payload: newValue
                            });
                        }}
                        onIncrement={(newValue) =>
                            dispatch({
                                type: dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                payload: newValue
                            })
                        }
                        onDecrement={(newValue) =>
                            dispatch({
                                type: dataPusherActionType.SET_DAYS_TO_SIMULATE,
                                payload: newValue
                            })
                        }
                    />
                    <FormFieldDescription>
                        {t('dataPusher.daysToSimulateDescription')}
                    </FormFieldDescription>
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
                    <NumericSpinInput
                        label={t('dataPusher.quickStreamFrequencyLabel')}
                        width={125}
                        min={500}
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
                </>
            ) : (
                <FormFieldDescription>
                    {t('dataPusher.pastEventsDescriptionOff')}
                </FormFieldDescription>
            )}
        </div>
    );
};

const LiveStreamDataForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-live-stream-data-form">
            <Toggle
                label=""
                checked={state.isLiveDataSimulated}
                onText={t('on')}
                offText={t('off')}
                onChange={(_e, checked) =>
                    dispatch({
                        type: dataPusherActionType.SET_IS_LIVE_DATA_SIMULATED,
                        payload: checked
                    })
                }
                styles={{ root: { marginBottom: 0, marginTop: 4 } }}
            />

            {state.isLiveDataSimulated ? (
                <div className="cb-live-stream-data-form-options">
                    <FormFieldDescription>
                        {t('dataPusher.liveStreamDescriptionOn')}
                    </FormFieldDescription>
                    <NumericSpinInput
                        label={t('dataPusher.liveStreamFrequencyLabel')}
                        width={125}
                        min={500}
                        max={Infinity}
                        step={100}
                        suffix={'ms'}
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
            ) : (
                <FormFieldDescription>
                    {t('dataPusher.liveStreamDescriptionOff')}
                </FormFieldDescription>
            )}
        </div>
    );
};

const OtherOptionsForm = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useDataPusherContext();

    return (
        <div className="cb-other-options-form">
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

export default DataPusherCard;
