import React, { useCallback, useRef, useState } from 'react';
import {
    ITimeSeriesTwinCalloutProps,
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
} from './TimeSeriesTwinCallout.types';
import { getStyles } from './TimeSeriesTwinCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    DirectionalHint,
    Stack,
    PrimaryButton,
    TextField,
    Toggle,
    DefaultButton,
    StackItem
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import TwinSearch from '../../../TwinSearch/TwinSearch';
import produce from 'immer';
import ModelledPropertyBuilder from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { PRIMARY_TWIN_NAME } from '../../../../Models/Constants/Constants';
import { createGUID, deepCopy } from '../../../../Models/Services/Utils';
import { isNumericType } from '../../../../Models/Classes/3DVConfig';
import {
    getDefaultSeriesLabel,
    sendDataHistoryExplorerUserTelemetry
} from '../../../../Models/SharedUtils/DataHistoryUtils';
import { TelemetryEvents } from '../../../../Models/Constants/TelemetryConstants';
import useGuid from '../../../../Models/Hooks/useGuid';

const defaultTimeSeriesTwin: IDataHistoryTimeSeriesTwin = {
    seriesId: '',
    twinId: '',
    twinPropertyName: '',
    twinPropertyType: null,
    label: '',
    chartProps: { color: null, isTwinPropertyTypeCastedToNumber: true }
};

const getClassNames = classNamesFunction<
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
>();

const TimeSeriesTwinCallout: React.FC<ITimeSeriesTwinCalloutProps> = (
    props
) => {
    const guid = useGuid();
    const {
        adapter,
        timeSeriesTwin,
        target,
        onDismiss,
        onPrimaryActionClick,
        dataHistoryInstanceId = guid,
        styles
    } = props;

    // state
    const [
        timeSeriesTwinToEdit,
        setTimeSeriesTwinToEdit
    ] = useState<IDataHistoryTimeSeriesTwin>(
        deepCopy(
            timeSeriesTwin || {
                ...defaultTimeSeriesTwin,
                seriesId: createGUID()
            }
        )
    );
    const isLabelAutoPopulated = useRef(false);
    const isAddDisabled = !(
        timeSeriesTwinToEdit.twinId && timeSeriesTwinToEdit.twinPropertyName
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const handleTwinIdChange = useCallback(
        (selectedTwinId: string) => {
            setTimeSeriesTwinToEdit(
                produce((draft) => {
                    draft.twinId = selectedTwinId;
                    draft.twinPropertyName = '';
                    draft.twinPropertyType = null;
                    if (isLabelAutoPopulated.current) {
                        draft.label = '';
                    }
                })
            );
        },
        [setTimeSeriesTwinToEdit]
    );
    const handleTwinPropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            setTimeSeriesTwinToEdit(
                produce((draft) => {
                    draft.twinPropertyName =
                        newPropertyExpression.property.localPath; // not assigning property 'name' but 'localPath' instead in case the property is a nested one
                    draft.twinPropertyType =
                        newPropertyExpression.property.propertyType;

                    if (!draft.label) {
                        draft.label = getDefaultSeriesLabel(
                            draft.twinId,
                            newPropertyExpression.property.localPath
                        ); // auto populate the label with selected twin and its property name if it is empty
                        isLabelAutoPopulated.current = true;
                    } else if (isLabelAutoPopulated.current) {
                        draft.label = getDefaultSeriesLabel(
                            draft.twinId,
                            newPropertyExpression.property.localPath
                        );
                    }
                })
            );
        },
        [setTimeSeriesTwinToEdit]
    );
    const handleTwinPropertyCastingChange = useCallback(
        (_event, checked: boolean) => {
            setTimeSeriesTwinToEdit(
                produce((draft) => {
                    draft.chartProps.isTwinPropertyTypeCastedToNumber = checked;
                })
            );
            const telemetry =
                TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                    .ToggleNumericCasting;
            sendDataHistoryExplorerUserTelemetry(
                telemetry.eventName,
                dataHistoryInstanceId,
                {
                    [telemetry.properties.toggleValue]: checked
                }
            );
        },
        [setTimeSeriesTwinToEdit, dataHistoryInstanceId]
    );
    const handleLabelChange = useCallback(
        (_event, label: string) => {
            setTimeSeriesTwinToEdit(
                produce((draft) => {
                    draft.label = label;
                    isLabelAutoPopulated.current = false;
                })
            );
        },
        [setTimeSeriesTwinToEdit]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Callout
                target={`#${target}`}
                styles={classNames.subComponentStyles.callout}
                onDismiss={onDismiss}
                directionalHint={DirectionalHint.rightTopEdge}
            >
                <Stack tokens={{ childrenGap: 12 }}>
                    <Stack tokens={{ childrenGap: 8 }}>
                        <StackItem>
                            <TwinSearch
                                adapter={adapter}
                                onSelectTwinId={handleTwinIdChange}
                                isInspectorDisabled={
                                    !timeSeriesTwinToEdit.twinId
                                }
                                twinId={timeSeriesTwinToEdit.twinId}
                                initialSelectedValue={
                                    timeSeriesTwinToEdit.twinId
                                }
                                disableDropdownDescription
                                dropdownLabel={t('twinId')}
                            />
                        </StackItem>
                        <StackItem>
                            <ModelledPropertyBuilder
                                customLabel={t(
                                    'dataHistoryExplorer.builder.timeSeriesTwin.property'
                                )}
                                adapter={adapter}
                                twinIdParams={{
                                    primaryTwinIds: [
                                        timeSeriesTwinToEdit.twinId
                                    ]
                                }}
                                mode={
                                    ModelledPropertyBuilderMode.PROPERTY_SELECT
                                }
                                propertyExpression={{
                                    expression: timeSeriesTwinToEdit.twinPropertyName
                                        ? `${PRIMARY_TWIN_NAME}.${timeSeriesTwinToEdit.twinPropertyName}`
                                        : ''
                                }}
                                onChange={handleTwinPropertyChange}
                                isDisabled={!timeSeriesTwinToEdit.twinId}
                                required
                            />

                            {timeSeriesTwinToEdit.twinPropertyType &&
                                !isNumericType(
                                    timeSeriesTwinToEdit.twinPropertyType
                                ) && (
                                    <Toggle
                                        styles={
                                            classNames.subComponentStyles
                                                .typeCastToggle
                                        }
                                        defaultChecked={
                                            timeSeriesTwinToEdit.chartProps
                                                ?.isTwinPropertyTypeCastedToNumber
                                        }
                                        label={t(
                                            'dataHistoryExplorer.builder.timeSeriesTwin.propertyTypeCastLabel'
                                        )}
                                        onChange={
                                            handleTwinPropertyCastingChange
                                        }
                                    />
                                )}
                        </StackItem>
                        <StackItem>
                            <TextField
                                placeholder={t(
                                    'widgets.dataHistory.form.timeSeries.labelPlaceholder'
                                )}
                                label={t(
                                    'widgets.dataHistory.form.timeSeries.label'
                                )}
                                value={timeSeriesTwinToEdit?.label}
                                onChange={handleLabelChange}
                            />
                        </StackItem>
                    </Stack>
                    <Stack
                        horizontal
                        horizontalAlign={'end'}
                        tokens={{ childrenGap: 8 }}
                    >
                        <DefaultButton text={t('cancel')} onClick={onDismiss} />
                        <PrimaryButton
                            text={timeSeriesTwin ? t('update') : t('add')}
                            onClick={() =>
                                onPrimaryActionClick(timeSeriesTwinToEdit)
                            }
                            disabled={isAddDisabled}
                            styles={classNames.subComponentStyles.addButton?.()}
                        />
                    </Stack>
                </Stack>
            </Callout>
        </div>
    );
};

export default styled<
    ITimeSeriesTwinCalloutProps,
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
>(TimeSeriesTwinCallout, getStyles);
