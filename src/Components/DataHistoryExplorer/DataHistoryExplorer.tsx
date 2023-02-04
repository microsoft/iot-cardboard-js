import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef
} from 'react';
import {
    ADX_TABLE_DOWNLOAD_FILE_NAME,
    DataHistoryExplorerActionType,
    ERROR_IMAGE_HEIGHT,
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
} from './DataHistoryExplorer.types';
import { getStyles } from './DataHistoryExplorer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    FontIcon,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import TimeSeriesBuilder from './Internal/TimeSeriesBuilder/TimeSeriesBuilder';
import {
    ADXTimeSeries,
    ADXTimeSeriesTableRow,
    IDataHistoryTimeSeriesTwin,
    TimeSeriesData
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import TimeSeriesViewer from './Internal/TimeSeriesViewer/TimeSeriesViewer';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    deepCopy,
    downloadText,
    getDebugLogger,
    isDefined,
    sortAscendingOrDescending
} from '../../Models/Services/Utils';
import {
    getDefaultSeriesLabel,
    getHighChartColor,
    sendDataHistoryExplorerSystemTelemetry,
    sendDataHistoryExplorerUserTelemetry,
    transformADXTimeSeriesToADXTableData
} from '../../Models/SharedUtils/DataHistoryUtils';
import DataHistoryErrorHandlingWrapper from '../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper';
import { IDataHistoryChartOptions } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useTimeSeriesData } from '../../Models/Hooks/useTimeSeriesData';
import { ColorString } from 'highcharts';
import {
    DataHistoryExplorerReducer,
    defaultDataHistoryExplorerState
} from './DataHistoryExplorer.state';
import { TelemetryEvents } from '../../Models/Constants/TelemetryConstants';
import TimeSeriesTwinCallout from './Internal/TimeSeriesTwinCallout/TimeSeriesTwinCallout';
import TimeSeriesCommandBar from './Internal/TimeSeriesCommandBar/TimeSeriesCommandBar';
import {
    TimerSeriesViewerData,
    TimeSeriesViewerMode
} from './Internal/TimeSeriesViewer/TimeSeriesViewer.types';
import {
    ChartCommandBarProps,
    TableCommandBarProps
} from './Internal/TimeSeriesCommandBar/TimeSeriesCommandBar.types';
import { TimeSeriesTableRow } from './Internal/TimeSeriesViewer/Internal/TimeSeriesTable/TimeSeriesTable.types';
import { usePrevious } from '@fluentui/react-hooks';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataHistoryExplorer', debugLogging);

const getClassNames = classNamesFunction<
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>();

const DataHistoryExplorer: React.FC<IDataHistoryExplorerProps> = (props) => {
    const {
        adapter,
        hasTitle = true,
        timeSeriesTwins: timeSeriesTwinsProp = [],
        defaultChartOptions,
        styles
    } = props;

    // state
    const [state, dispatch] = useReducer(DataHistoryExplorerReducer, {
        ...defaultDataHistoryExplorerState,
        adxConnectionInformation: adapter.getADXConnectionInformation(),
        timeSeriesTwins: timeSeriesTwinsProp,
        chartOptions: {
            ...deepCopy(defaultChartOptions),
            xMinDateInMillis: null,
            xMaxDateInMillis: null
        }
    });

    // hooks
    const { t } = useTranslation();
    const calloutTargetIdRef = useRef<string>(null);
    const usedSeriesColorsRef = useRef<Array<ColorString>>(
        timeSeriesTwinsProp
            ?.filter((t) => t.chartProps?.color)
            .map((t) => t.chartProps?.color) || []
    );
    const updateConnectionAdapterData = useAdapter({
        // fetch connection information if not exist
        adapterMethod: () => adapter.updateADXConnectionInformation(),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    const {
        query,
        data,
        deeplink,
        errors,
        fetchTimeSeriesData,
        isLoading = true
    } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: state.chartOptions.defaultQuickTimeSpanInMillis,
        twins: state.timeSeriesTwins,
        queryOptions: { isNullIncluded: true, shouldCastToDouble: false } // fetch all raw data, do filtering later based on selected viewer mode later
    });

    const commandBarViewerModeProps:
        | ChartCommandBarProps
        | TableCommandBarProps = useMemo(
        () =>
            state.selectedViewerMode === TimeSeriesViewerMode.Chart
                ? ({
                      viewerMode: TimeSeriesViewerMode.Chart,
                      deeplink: deeplink
                  } as ChartCommandBarProps)
                : ({
                      viewerMode: TimeSeriesViewerMode.Table,
                      onDownloadClick: handleOnDownloadTableClick
                  } as TableCommandBarProps),
        [state.selectedViewerMode]
    );

    const chartData = useMemo(() => {
        const filteredSeries: Array<ADXTimeSeries> = [];
        let series: ADXTimeSeries;
        data?.forEach((d) => {
            const seriesTwin = state.timeSeriesTwins.find(
                (tsTwin) => tsTwin.seriesId === d.seriesId
            );
            series = deepCopy(d);
            series.data = d.data.reduce(
                (acc: Array<TimeSeriesData>, current) => {
                    try {
                        if (isDefined(current.value)) {
                            // filter out null values
                            const castedNumeric = Number(current.value);
                            if (
                                seriesTwin.chartProps
                                    .isTwinPropertyTypeCastedToNumber &&
                                !isNaN(castedNumeric)
                            ) {
                                // filter out non-numeric values if it is set to numeric casting (by default it is true for numeric data types)
                                acc.push({
                                    value: castedNumeric,
                                    timestamp: current.timestamp
                                });
                            }
                        }
                        return acc;
                    } catch (error) {
                        acc = [];
                    }
                },
                []
            );
            filteredSeries.push(series);
        });
        return filteredSeries;
    }, [data, state.timeSeriesTwins]);

    const tableData = useMemo(() => {
        const adxTimeSeriesTableRows: Array<TimeSeriesTableRow> =
            data?.reduce((acc, adxTs) => {
                const transformedADXRow = transformADXTimeSeriesToADXTableData(
                    adxTs
                ); // flatten the adxTimeSeries back to individual rows
                transformedADXRow.map(
                    (adxRow, idxR) =>
                        acc.push({
                            ...adxRow,
                            seriesId: adxTs.seriesId,
                            property: adxRow.key,
                            key: adxTs.seriesId + idxR
                        } as TimeSeriesTableRow) // cannot use the ADXTimeSeriesTableRow type since key cannot be used as a unique DOM key for rendering))
                );
                return acc;
            }, []) || [];
        adxTimeSeriesTableRows.sort(sortAscendingOrDescending('timestamp'));
        logDebugConsole(
            'debug',
            `Number of rows: ${adxTimeSeriesTableRows.length}`
        );
        return adxTimeSeriesTableRows;
    }, [data]);

    const viewerData: TimerSeriesViewerData = useMemo(
        () => ({ chart: chartData, table: tableData }),
        [tableData, chartData]
    );

    //callbacks
    const updateXMinAndMax = useCallback(() => {
        const nowInMillis = Date.now();
        dispatch({
            type: DataHistoryExplorerActionType.SET_EXPLORER_CHART_OPTIONS,
            payload: {
                explorerChartOptions: {
                    ...state.chartOptions,
                    xMinDateInMillis:
                        nowInMillis -
                        state.chartOptions.defaultQuickTimeSpanInMillis,
                    xMaxDateInMillis: nowInMillis
                }
            }
        });
    }, [state.chartOptions]);

    const handleTimeSeriesTwinCalloutPrimaryAction = useCallback(
        (timeSeriesTwin: IDataHistoryTimeSeriesTwin) => {
            if (isDefined(state.selectedTimeSeriesTwinSeriesId)) {
                const selectedIdx = state.timeSeriesTwins.findIndex(
                    (tsTwin) =>
                        tsTwin.seriesId === state.selectedTimeSeriesTwinSeriesId
                );
                dispatch({
                    type: DataHistoryExplorerActionType.EDIT_TIME_SERIES_TWINS,
                    payload: { seriesIdx: selectedIdx, series: timeSeriesTwin }
                });
                const telemetry =
                    TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                        .EditSeries;
                sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                    {
                        property: telemetry.properties.itemIndex,
                        value: selectedIdx
                    },
                    {
                        property: telemetry.properties.hasCustomLabel,
                        value:
                            timeSeriesTwin.label !==
                            getDefaultSeriesLabel(
                                timeSeriesTwin.twinId,
                                timeSeriesTwin.twinPropertyName
                            )
                    }
                ]);
            } else {
                dispatch({
                    type: DataHistoryExplorerActionType.ADD_TIME_SERIES_TWINS,
                    payload: {
                        series: {
                            ...timeSeriesTwin,
                            chartProps: {
                                ...timeSeriesTwin.chartProps,
                                color: getHighChartColor(
                                    usedSeriesColorsRef.current
                                )
                            }
                        }
                    }
                });
                const telemetry =
                    TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                        .AddSeries;
                sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                    {
                        property: telemetry.properties.hasCustomLabel,
                        value:
                            timeSeriesTwin.label !==
                            getDefaultSeriesLabel(
                                timeSeriesTwin.twinId,
                                timeSeriesTwin.twinPropertyName
                            )
                    }
                ]);
            }
        },
        [state.timeSeriesTwins, state.selectedTimeSeriesTwinSeriesId]
    );

    const handleOnAddSeriesClick = useCallback(
        (calloutTargetId: string) => {
            calloutTargetIdRef.current = calloutTargetId;
            dispatch({
                type:
                    DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE,
                payload: { isVisible: true }
            });
        },
        [dispatch]
    );

    const handleOnEditSeriesClick = useCallback(
        (seriesId: string, calloutTargetId: string) => {
            calloutTargetIdRef.current = calloutTargetId;
            dispatch({
                type:
                    DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE,
                payload: { isVisible: true, selectedSeriesId: seriesId }
            });
        },
        [dispatch]
    );

    const handleOnRemoveSeriesClick = useCallback(
        (seriesId: string) => {
            const selectedIdx = state.timeSeriesTwins.findIndex(
                (tsTwin) => tsTwin.seriesId === seriesId
            );
            dispatch({
                type: DataHistoryExplorerActionType.REMOVE_TIME_SERIES_TWINS,
                payload: { seriesIdx: selectedIdx }
            });
            const telemetry =
                TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                    .RemoveSeries;
            sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                {
                    property: telemetry.properties.itemIndex,
                    value: selectedIdx
                }
            ]);
            /**
             * when a series is removed, also remove if from usedColors reference
             * so that whenever adding a new series we can use these available colors first
             * before picking the next color in Highcharts palette
             */
            usedSeriesColorsRef.current.splice(
                usedSeriesColorsRef.current.findIndex(
                    (c) =>
                        c ===
                        state.timeSeriesTwins.find(
                            (tsTwin) => tsTwin.seriesId === seriesId
                        ).chartProps.color
                ),
                1
            );
        },
        [state.timeSeriesTwins, dispatch]
    );

    const handleOnViewModeChange = useCallback(
        (viewerMode: TimeSeriesViewerMode) => {
            dispatch({
                type: DataHistoryExplorerActionType.SET_VIEWER_MODE,
                payload: { viewerMode: viewerMode }
            });
            const telemetry =
                TelemetryEvents.Tools.DataHistoryExplorer.UserAction.ChangeView;
            sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                {
                    property: telemetry.properties.view,
                    value: viewerMode
                }
            ]);
        },
        [dispatch, sendDataHistoryExplorerUserTelemetry]
    );

    const handleOnChartOptionChange = useCallback(
        (chartOptions: IDataHistoryChartOptions) => {
            dispatch({
                type: DataHistoryExplorerActionType.SET_CHART_OPTIONS,
                payload: { chartOptions: chartOptions }
            });
            logDebugConsole(
                'debug',
                `Chart options changed: ${JSON.stringify(chartOptions)}`
            );
            const telemetry =
                TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                    .ChangeChartOption;
            sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                {
                    property: telemetry.properties.chartOptions,
                    value: JSON.stringify(chartOptions)
                }
            ]);
        },
        [
            state.timeSeriesTwins,
            dispatch,
            logDebugConsole,
            sendDataHistoryExplorerUserTelemetry
        ]
    );

    const handleOnDownloadTableClick = useCallback(() => {
        downloadText(
            JSON.stringify(
                tableData.map((d) => {
                    const { property, ...rest } = d;
                    delete rest.seriesId;
                    return {
                        ...rest,
                        key: property // move the key field back to property name
                    } as ADXTimeSeriesTableRow;
                }),
                null,
                2
            ),
            `${ADX_TABLE_DOWNLOAD_FILE_NAME}.json`
        );
        const telemetry =
            TelemetryEvents.Tools.DataHistoryExplorer.UserAction.DownloadTable;
        sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
            {
                property: telemetry.properties.numberOfRows,
                value: data.length
            }
        ]);
    }, [tableData]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    //side-effects
    useEffect(() => {
        if (
            !adapter.getADXConnectionInformation() &&
            !updateConnectionAdapterData.isLoading
        ) {
            updateConnectionAdapterData.callAdapter();
        }
    }, []);
    useEffect(() => {
        if (updateConnectionAdapterData?.adapterResult?.result) {
            if (!updateConnectionAdapterData?.adapterResult.hasNoData()) {
                const connectionData = updateConnectionAdapterData.adapterResult.getData();
                dispatch({
                    type:
                        DataHistoryExplorerActionType.SET_ADX_CONNECTION_INFORMATION,
                    payload: { adxConnectionInformation: connectionData }
                });
            } else {
                dispatch({
                    type:
                        DataHistoryExplorerActionType.SET_ADX_CONNECTION_INFORMATION,
                    payload: { adxConnectionInformation: null }
                });
            }
        }
    }, [updateConnectionAdapterData?.adapterResult.result]);
    useEffect(() => {
        if (data && !isLoading) {
            const seriesIdsWithNoData = state.timeSeriesTwins
                ?.filter((ts) => !data?.find((d) => d.seriesId === ts.seriesId))
                .map((ts) => ts.seriesId);
            dispatch({
                type: DataHistoryExplorerActionType.SET_MISSING_SERIES,
                payload: { seriesIds: seriesIdsWithNoData }
            });
        }
    }, [data, state.timeSeriesTwins, isLoading]);

    const prevQuery = usePrevious(query);
    useEffect(() => {
        if (query && query !== prevQuery) {
            logDebugConsole(
                'debug',
                `Query to send for ${state.selectedViewerMode}: ${query}`
            );
            fetchTimeSeriesData();
            updateXMinAndMax();
        }
    }, [query]);

    useEffect(() => {
        logDebugConsole(
            'debug',
            'Series changed: {timeSeriesTwins}',
            state.timeSeriesTwins
        );
        sendDataHistoryExplorerSystemTelemetry(state.timeSeriesTwins);
    }, [state.timeSeriesTwins]);

    return (
        <div className={classNames.root}>
            {hasTitle && (
                <div className={classNames.titleWrapper}>
                    <FontIcon
                        className={classNames.titleIcon}
                        iconName={'Chart'}
                    />
                    <span className={classNames.title}>
                        {t('dataHistoryExplorer.title')}
                    </span>
                </div>
            )}
            {updateConnectionAdapterData.adapterResult.getErrors() ? (
                <DataHistoryErrorHandlingWrapper
                    error={
                        updateConnectionAdapterData.adapterResult.getErrors()[0]
                    }
                    imgHeight={ERROR_IMAGE_HEIGHT}
                    styles={classNames.subComponentStyles.errorWrapper}
                />
            ) : updateConnectionAdapterData.isLoading ? (
                <Spinner
                    styles={classNames.subComponentStyles.loadingSpinner}
                    size={SpinnerSize.large}
                    label={t('dataHistoryExplorer.loadingConnectionLabel')}
                    ariaLive="assertive"
                    labelPosition="bottom"
                />
            ) : (
                <>
                    <Stack
                        horizontal
                        tokens={{ childrenGap: 8 }}
                        className={classNames.contentStack}
                    >
                        <TimeSeriesBuilder
                            timeSeriesTwins={state.timeSeriesTwins}
                            missingTimeSeriesTwinIds={
                                state.missingDataSeriesIds
                            }
                            onAddSeriesClick={handleOnAddSeriesClick}
                            onEditSeriesClick={handleOnEditSeriesClick}
                            onRemoveSeriesClick={handleOnRemoveSeriesClick}
                            styles={classNames.subComponentStyles.builder}
                        />
                        <Stack
                            tokens={{ childrenGap: 8 }}
                            className={classNames.contentStack}
                        >
                            {state.timeSeriesTwins.length > 0 && (
                                <TimeSeriesCommandBar
                                    viewerModeProps={commandBarViewerModeProps}
                                    onChartOptionsChange={
                                        handleOnChartOptionChange
                                    }
                                />
                            )}
                            <TimeSeriesViewer
                                isLoading={isLoading}
                                timeSeriesTwins={state.timeSeriesTwins}
                                viewerMode={state.selectedViewerMode}
                                onViewerModeChange={handleOnViewModeChange}
                                chartOptions={state.chartOptions}
                                data={viewerData}
                                error={errors[0]}
                                styles={classNames.subComponentStyles.viewer}
                            />
                        </Stack>
                    </Stack>
                    {state.isTimeSeriesTwinCalloutVisible && (
                        <TimeSeriesTwinCallout
                            adapter={adapter}
                            timeSeriesTwin={
                                state.selectedTimeSeriesTwinSeriesId !== null
                                    ? state.timeSeriesTwins.find(
                                          (t) =>
                                              t.seriesId ===
                                              state.selectedTimeSeriesTwinSeriesId
                                      )
                                    : undefined
                            }
                            styles={
                                classNames.subComponentStyles
                                    .timeSeriesTwinCallout
                            }
                            target={calloutTargetIdRef.current}
                            onPrimaryActionClick={
                                handleTimeSeriesTwinCalloutPrimaryAction
                            }
                            onDismiss={() => {
                                dispatch({
                                    type:
                                        DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE,
                                    payload: { isVisible: false }
                                });
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default styled<
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>(DataHistoryExplorer, getStyles);
