import {
    ActionButton,
    ChoiceGroup,
    Dropdown,
    ITextFieldProps,
    Label,
    Link,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import produce from 'immer';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { IADXConnection } from '../../../../../../../Models/Constants';
import { DOCUMENTATION_LINKS } from '../../../../../../../Models/Constants/Constants';
import {
    IDataHistoryAggregationType,
    IDataHistoryBasicTimeSeries,
    IDataHistoryChartYAxisType
} from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADT3DScenePageContext } from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage';
import { ADXConnectionInformationLoadingState } from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage.types';
import TooltipCallout from '../../../../../../TooltipCallout/TooltipCallout';
import { getActionButtonStyles } from '../../../../Shared/LeftPanel.styles';
import { getWidgetFormStyles } from '../../WidgetForm/WidgetForm.styles';
import {
    AggregationTypeOptions,
    ChartOptionKeys,
    CONNECTION_STRING_SUFFIX,
    IDataHistoryWidgetBuilderProps,
    MAX_NUMBER_OF_TIME_SERIES,
    QuickTimeSpanKey,
    getQuickTimeSpanOptions,
    QuickTimeSpans,
    SERIES_LIST_ITEM_ID_PREFIX,
    getYAxisTypeOptions
} from './DataHistoryWidgetBuilder.types';
import TimeSeriesFormCallout from './Internal/TimeSeriesFormCallout';
import TimeSeriesList from './Internal/TimeSeriesList';

const DataHistoryWidgetBuilder: React.FC<IDataHistoryWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const [selectedTimeSeriesIdx, setSelectedTimeSeriesIdx] = useState(null);
    const addTimeSeriesCalloutId = useId('add-time-series-callout');
    const yAxisLabelId = useId('y-axis-label');
    const [
        isTimeSeriesFormCalloutVisible,
        {
            setTrue: setIsAddTimeSeriesCalloutVisibleTrue,
            setFalse: setIsAddTimeSeriesCalloutVisibleFalse
        }
    ] = useBoolean(false);

    const { t } = useTranslation();
    const {
        state: { adxConnectionInformation }
    } = useContext(ADT3DScenePageContext);

    useEffect(() => {
        const {
            displayName,
            connectionString,
            timeSeries
        } = formData.widgetConfiguration;
        if (displayName && connectionString && timeSeries.length) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData]);

    useEffect(() => {
        if (
            adxConnectionInformation.loadingState ===
            ADXConnectionInformationLoadingState.EXIST
        ) {
            const connection = adxConnectionInformation.connection;
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.connectionString = generateConnectionString(
                        connection
                    );
                })
            );
        }
    }, [adxConnectionInformation]);

    const connectionString = formData.widgetConfiguration.connectionString
        ? formData.widgetConfiguration.connectionString
        : adxConnectionInformation.loadingState ===
          ADXConnectionInformationLoadingState.LOADING
        ? t('widgets.dataHistory.form.connectionLoadingText')
        : t('widgets.dataHistory.form.noConnectionInformationText');

    const quickTimeSpanKeyByValue = useMemo((): QuickTimeSpanKey => {
        let key: QuickTimeSpanKey;
        const idx = Object.values(QuickTimeSpans).indexOf(
            formData.widgetConfiguration.chartOptions.defaultQuickTimeSpan
        );
        if (idx !== -1) {
            key = Object.keys(QuickTimeSpans)[idx] as QuickTimeSpanKey;
        }
        return key;
    }, [formData.widgetConfiguration.chartOptions.defaultQuickTimeSpan]);

    const selectedSeries =
        selectedTimeSeriesIdx !== -1
            ? formData.widgetConfiguration.timeSeries[selectedTimeSeriesIdx]
            : null;

    const onDisplayNameChange = useCallback(
        (_event, value: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.displayName = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const handleTimeSeriesFormDismiss = useCallback(() => {
        setIsAddTimeSeriesCalloutVisibleFalse();
        setSelectedTimeSeriesIdx(null);
    }, []);

    const handleTimeSeriesFormPrimaryAction = useCallback(
        (series: IDataHistoryBasicTimeSeries) => {
            selectedSeries
                ? updateWidgetData(
                      produce(formData, (draft) => {
                          draft.widgetConfiguration.timeSeries[
                              selectedTimeSeriesIdx
                          ] = series;
                      })
                  )
                : updateWidgetData(
                      produce(formData, (draft) => {
                          draft.widgetConfiguration.timeSeries.push(series);
                      })
                  );
            handleTimeSeriesFormDismiss();
        },
        [
            updateWidgetData,
            handleTimeSeriesFormDismiss,
            formData,
            selectedSeries
        ]
    );

    const handleTimeSeriesEditClick = useCallback((idx: number) => {
        setSelectedTimeSeriesIdx(idx);
        setIsAddTimeSeriesCalloutVisibleTrue();
    }, []);

    const handleTimeSeriesRemoveClick = useCallback(
        (idx: number) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.timeSeries.splice(idx, 1);
                })
            );
        },
        [formData]
    );

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);
    const handleOnRenderConnectionStringLabel = useCallback(
        (
            props?: ITextFieldProps,
            defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
        ): JSX.Element => {
            return (
                <Stack
                    horizontal
                    verticalAlign={'center'}
                    className={customStyles.stackWithTooltipAndRequired}
                >
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                'widgets.dataHistory.form.connectionStringInformation'
                            ),
                            calloutContent: (
                                <>
                                    {t(
                                        'widgets.dataHistory.form.connectionStringInformation'
                                    )}{' '}
                                    <Link
                                        target="_blank"
                                        href={DOCUMENTATION_LINKS.dataHistory}
                                    >
                                        {t('learnMore')}
                                    </Link>
                                </>
                            )
                        }}
                    />
                </Stack>
            );
        },
        [t, customStyles]
    );

    const onChartOptionChange = useCallback(
        (
            optionKey: ChartOptionKeys,
            value:
                | IDataHistoryChartYAxisType
                | IDataHistoryAggregationType
                | number
        ) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.chartOptions[
                        optionKey as string
                    ] = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const actionButtonStyles = getActionButtonStyles(theme);
    return (
        <div className={customStyles.widgetFormContents}>
            <Stack tokens={{ childrenGap: 8 }}>
                <TextField
                    required
                    placeholder={t(
                        'widgets.dataHistory.form.connectionStringPlaceholder'
                    )}
                    label={t('widgets.dataHistory.form.connectionStringTitle')}
                    value={connectionString}
                    readOnly
                    disabled
                    title={connectionString}
                    onRenderLabel={handleOnRenderConnectionStringLabel}
                />
                <TextField
                    required
                    placeholder={t(
                        'widgets.dataHistory.form.displayNamePlaceholder'
                    )}
                    label={t('displayName')}
                    value={formData.widgetConfiguration.displayName}
                    onChange={onDisplayNameChange}
                />
                <TimeSeriesList
                    series={formData.widgetConfiguration.timeSeries}
                    onSeriesEditClick={handleTimeSeriesEditClick}
                    onSeriesRemoveClick={handleTimeSeriesRemoveClick}
                />
                {formData.widgetConfiguration.timeSeries.length <
                    MAX_NUMBER_OF_TIME_SERIES && (
                    <ActionButton
                        id={addTimeSeriesCalloutId}
                        styles={actionButtonStyles}
                        text={t('widgets.dataHistory.form.timeSeries.add')}
                        onClick={setIsAddTimeSeriesCalloutVisibleTrue}
                    />
                )}
                <Label className={customStyles.label} id={yAxisLabelId}>
                    <Stack horizontal verticalAlign="center">
                        <span>
                            {t(
                                'widgets.dataHistory.form.chartOptions.yAxisType.label'
                            )}
                        </span>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    'widgets.dataHistory.form.chartOptions.yAxisType.description'
                                ),
                                calloutContent: t(
                                    'widgets.dataHistory.form.chartOptions.yAxisType.description'
                                )
                            }}
                        />
                    </Stack>
                </Label>
                <ChoiceGroup
                    className={customStyles.choiceGroup}
                    selectedKey={
                        formData.widgetConfiguration.chartOptions.yAxisType
                    }
                    options={getYAxisTypeOptions(t)}
                    onChange={(_env, option) =>
                        onChartOptionChange(
                            'yAxisType',
                            option.key as IDataHistoryChartYAxisType
                        )
                    }
                    ariaLabelledBy={yAxisLabelId}
                />
                <Dropdown
                    label={t(
                        'widgets.dataHistory.form.chartOptions.quickTimeSpan.label'
                    )}
                    selectedKey={quickTimeSpanKeyByValue}
                    onChange={(_env, option) =>
                        onChartOptionChange('defaultQuickTimeSpan', option.data)
                    }
                    options={getQuickTimeSpanOptions(t)}
                />
                <Dropdown
                    label={t(
                        'widgets.dataHistory.form.chartOptions.aggregationType.label'
                    )}
                    selectedKey={
                        formData.widgetConfiguration.chartOptions
                            .aggregationType
                    }
                    onChange={(_env, option) =>
                        onChartOptionChange(
                            'aggregationType',
                            option.key as IDataHistoryAggregationType
                        )
                    }
                    options={AggregationTypeOptions}
                />
            </Stack>
            {isTimeSeriesFormCalloutVisible && (
                <TimeSeriesFormCallout
                    calloutTarget={
                        selectedSeries
                            ? SERIES_LIST_ITEM_ID_PREFIX + selectedTimeSeriesIdx
                            : addTimeSeriesCalloutId
                    }
                    series={selectedSeries}
                    onDismiss={handleTimeSeriesFormDismiss}
                    onPrimaryActionClick={handleTimeSeriesFormPrimaryAction}
                />
            )}
        </div>
    );
};

const generateConnectionString = (
    connection: IADXConnection
): string | null => {
    if (
        connection?.kustoClusterUrl &&
        connection?.kustoDatabaseName &&
        connection?.kustoTableName
    ) {
        try {
            const clusterUrl = new URL(connection?.kustoClusterUrl);
            if (clusterUrl.host.endsWith(CONNECTION_STRING_SUFFIX)) {
                return `kustoClusterUrl=${connection.kustoClusterUrl};kustoDatabaseName=${connection.kustoDatabaseName};kustoTableName=${connection.kustoTableName}`;
            }
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
};

export default DataHistoryWidgetBuilder;
