import { Text } from '@fluentui/react/lib/Text';
import { Separator } from '@fluentui/react/lib/components/Separator/Separator';
import { TextField } from '@fluentui/react/lib/components/TextField/TextField';
import { ITextFieldStyles } from '@fluentui/react/lib/components/TextField/TextField.types';
import { Toggle } from '@fluentui/react/lib/components/Toggle/Toggle';
import React, { createContext, useContext, useReducer } from 'react';
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
import { ISeparatorStyles } from '@fluentui/react';

const DataPusherContext = createContext<IDataPusherContext>(null);
const useDataPusherContext = () => useContext(DataPusherContext);

const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: '100px' },
    root: { marginBottom: '8px' }
};

const separatorStyles: Partial<ISeparatorStyles> = {
    content: { fontWeight: 'bold', paddingLeft: 0 }
};

const DataPusherCard = ({ locale, localeStrings, theme }: IDataPusherProps) => {
    const [state, dispatch] = useReducer(
        dataPusherReducer,
        defaultAdtDataPusherState
    );

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
                    fieldGroup: { width: '80%' },
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
            <TextField
                type="number"
                label="Days to simulate"
                description="Start simulating this many days ago (days)"
                value={String(state.daysToSimulate)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_DAYS_TO_SIMULATE,
                        payload: Number(newValue)
                    })
                }
                styles={textFieldStyles}
            />
            <TextField
                type="number"
                label="Data spacing"
                description="Time between event timestamps (ms)"
                value={String(state.dataSpacing)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_DATA_SPACING,
                        payload: Number(newValue)
                    })
                }
                styles={textFieldStyles}
            />
            <TextField
                type="number"
                label="Quick stream frequency"
                description="How frequently to push past / future events (ms)"
                value={String(state.dataSpacing)}
                onChange={(_e, newValue) =>
                    dispatch({
                        type: dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                        payload: Number(newValue)
                    })
                }
                styles={textFieldStyles}
            />
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
                    <TextField
                        type="number"
                        label="Live stream frequency"
                        description={`How frequently to push "live" events once caught up to "now" (ms).
                    This number will be both the time between event timestamps and the interval
                    at which new events are pushed. This will override the data spacing field
                    above once Date.now() is reached.`}
                        value={String(state.dataSpacing)}
                        onChange={(_e, newValue) =>
                            dispatch({
                                type:
                                    dataPusherActionType.SET_QUICK_STREAM_FREQUENCY,
                                payload: Number(newValue)
                            })
                        }
                        styles={textFieldStyles}
                    />
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
