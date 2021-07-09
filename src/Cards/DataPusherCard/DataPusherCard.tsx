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
    ISpinButtonStyles,
    IStackStyles,
    IStackTokens,
    Position,
    PrimaryButton,
    SpinButton,
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

const DataPusherContext = createContext<IDataPusherContext>(null);
const useDataPusherContext = () => useContext(DataPusherContext);

const spinButtonStyles: Partial<ISpinButtonStyles> = {
    spinButtonWrapper: { width: 100 }
};

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

        // Clear any prior interval
        clearInterval(intervalRef.current);

        if (
            isNaN(state.daysToSimulate) ||
            isNaN(state.dataSpacing) ||
            isNaN(state.liveStreamFrequency) ||
            isNaN(state.quickStreamFrequency)
        ) {
            throw new Error('Input controls cannot be empty');
        }

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

        const startDateMillis =
            new Date().valueOf() - state.daysToSimulate * 86400000; // get starting date

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

    const createModels = () => {
        const assetSimulation = new AssetSimulation(0, 0);
        const models = assetSimulation.generateDTModels(
            state.includeImagesForModel
        );
        modelState.callAdapter({ models });
    };

    const createTwins = () => {
        const assetSimulation = new AssetSimulation(0, 0);
        const twins = assetSimulation.generateDTwins(
            state.includeImagesForModel
        );
        twinState.callAdapter({ twins });
    };

    const createRelationships = () => {
        const assetSimulation = new AssetSimulation(0, 0);
        const relationships = assetSimulation.generateTwinRelationships();
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

    /*
        - Add logic to view status of created twins, models & relationships
        - Add logic to view simulation tick results
    */

    const stackStyles: IStackStyles = {
        root: {
            width: 800
        }
    };

    const numericalSpacingStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10
    };

    return (
        <BaseCard
            isLoading={false}
            adapterResult={null}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            title={'Azure Digital Twins Data simulator'}
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
                                text={'Create models'}
                                disabled={false}
                                onClick={() => {
                                    createModels();
                                }}
                            />
                            <PrimaryButton
                                text={'Create twins'}
                                disabled={false}
                                onClick={() => {
                                    createTwins();
                                }}
                            />
                            <PrimaryButton
                                text={'Create relationships'}
                                disabled={false}
                                onClick={() => {
                                    createRelationships();
                                }}
                            />
                            <PrimaryButton
                                text={
                                    state.isSimulationRunning
                                        ? 'Stop simulation'
                                        : 'Start simulation'
                                }
                                disabled={false}
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
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-adt-data-pusher">
            <TextField
                label="Instance URL"
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
                Quick fill data
            </Separator>
            <QuickFillDataForm />
            <Separator alignContent="start" styles={separatorStyles}>
                Live stream data
            </Separator>
            <LiveStreamDataForm />
            <Separator alignContent="start" styles={separatorStyles}>
                Other options
            </Separator>
            <OtherOptionsForm />
        </div>
    );
};

const QuickFillDataForm = () => {
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-quick-fill-data-form">
            <SpinButton
                label="Days to simulate"
                labelPosition={Position.top}
                value={String(state.daysToSimulate)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_DAYS_TO_SIMULATE,
                        payload: Number(newValue)
                    })
                }
                min={0}
                step={1}
                incrementButtonAriaLabel="Increase value by 1"
                decrementButtonAriaLabel="Decrease value by 1"
                styles={spinButtonStyles}
            />
            <FormFieldDescription>
                Start simulating this many days ago (days)
            </FormFieldDescription>
            <SpinButton
                label="Data spacing"
                labelPosition={Position.top}
                value={String(state.dataSpacing)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_DATA_SPACING,
                        payload: Number(newValue)
                    })
                }
                min={0}
                step={1000}
                incrementButtonAriaLabel="Increase value by 1000"
                decrementButtonAriaLabel="Decrease value by 1000"
                styles={spinButtonStyles}
            />
            <FormFieldDescription>
                Time between event timestamps (ms)
            </FormFieldDescription>
            <SpinButton
                label="Quick stream frequency"
                labelPosition={Position.top}
                value={String(state.quickStreamFrequency)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                        payload: Number(newValue)
                    })
                }
                min={0}
                step={100}
                incrementButtonAriaLabel="Increase value by 100"
                decrementButtonAriaLabel="Decrease value by 100"
                styles={spinButtonStyles}
            />
            <FormFieldDescription>
                How frequently to push past / future events (ms)
            </FormFieldDescription>
        </div>
    );
};

const LiveStreamDataForm = () => {
    const { state, dispatch } = useDataPusherContext();
    return (
        <div className="cb-live-stream-data-form">
            <Toggle
                label="Simulate live data stream"
                checked={state.isLiveDataSimulated}
                onText="On"
                offText="Off"
                onChange={(_e, checked) =>
                    dispatch({
                        type: dataPusherActionType.SET_IS_LIVE_DATA_SIMULATED,
                        payload: checked
                    })
                }
                styles={{ root: { marginBottom: 0 } }}
            />

            {state.isLiveDataSimulated ? (
                <div className="cb-live-stream-data-form-options">
                    <FormFieldDescription>
                        Simulation will stop once current time is reached, and
                        begin to push data every [live stream frequency] ms.
                    </FormFieldDescription>
                    <SpinButton
                        label="Live stream frequency"
                        labelPosition={Position.top}
                        value={String(state.liveStreamFrequency)}
                        onChange={(_e, newValue) =>
                            dispatch({
                                type:
                                    dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                                payload: Number(newValue)
                            })
                        }
                        min={0}
                        step={1000}
                        incrementButtonAriaLabel="Increase value by 1000"
                        decrementButtonAriaLabel="Decrease value by 1000"
                        styles={spinButtonStyles}
                    />
                    <FormFieldDescription>
                        How frequently to push "live" events once caught up to
                        "now" (ms). This number will be both the time between
                        event timestamps and the interval at which new events
                        are pushed. This will override the data spacing field
                        above once Date.now() is reached.
                    </FormFieldDescription>
                </div>
            ) : (
                <FormFieldDescription>
                    Simulation will continue to push events into the future at
                    quick stream frequency indefinitely.
                </FormFieldDescription>
            )}
        </div>
    );
};

const OtherOptionsForm = () => {
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
                    Simulation will push model with default images.
                </FormFieldDescription>
            ) : (
                <FormFieldDescription>
                    Simulation will not push images.
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
            <Text variant={'xSmall'} styles={styles}>
                {children}
            </Text>
        </div>
    );
};

export default DataPusherCard;
