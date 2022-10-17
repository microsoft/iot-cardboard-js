import React, { memo, useContext, useEffect, useMemo, useRef } from 'react';
import {
    ADXTimeSeries,
    BehaviorModalMode,
    DTwin,
    IDataHistoryWidgetTimeSeriesTwin,
    TimeSeriesData
} from '../../../../../Models/Constants';
import { useTimeSeriesData } from '../../../../../Models/Hooks/useTimeSeriesData';
import {
    IDataHistoryTimeSeries,
    IDataHistoryWidget,
    IDataHistoryWidgetConfiguration
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import HighChartsWrapper from '../../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../../HighChartsWrapper/HighChartsWrapper.types';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { dataHistoryClassNames } from './DataHistoryWidget.styles';

interface IProp {
    widget: IDataHistoryWidget;
}

const DataHistoryWidget: React.FC<IProp> = ({ widget }) => {
    const {
        displayName,
        connectionString,
        timeSeries,
        chartOptions
    } = widget.widgetConfiguration;

    const { adapter, twins, mode } = useContext(BehaviorsModalContext);
    const twinIdPropertyMap = getTwinIdPropertyMap(timeSeries, twins);
    const isRequestSent = useRef(false);

    const {
        query,
        deeplink,
        data,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connectionString,
        quickTimeSpan: chartOptions.defaultQuickTimeSpan,
        twins: twinIdPropertyMap
    });

    useEffect(() => {
        if (
            mode === BehaviorModalMode.viewer &&
            query &&
            (adapter || connectionString) &&
            !isRequestSent.current &&
            twinIdPropertyMap
        ) {
            fetchTimeSeriesData();
            isRequestSent.current = true;
        }
    }, [
        adapter,
        query,
        connectionString,
        twinIdPropertyMap,
        chartOptions,
        mode
    ]);

    const placeholderTimeSeriesData: Array<
        Array<TimeSeriesData>
    > = useMemo(() => {
        // placeholder timeseries data to be used in preview mode, need to memoize not to change the chart plot area unless time span or series length changes
        const toInMillis = Date.now();
        const fromInMillis = toInMillis - chartOptions.defaultQuickTimeSpan;
        return timeSeries.map(() =>
            Array.from({ length: 5 }, () => ({
                timestamp: Math.floor(
                    Math.random() * (toInMillis - fromInMillis + 1) +
                        fromInMillis
                ),
                value: Math.floor(Math.random() * 500)
            })).sort(
                (a, b) => (a.timestamp as number) - (b.timestamp as number)
            )
        );
    }, [chartOptions.defaultQuickTimeSpan, timeSeries.length]);

    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            mode === BehaviorModalMode.preview
                ? generatePlaceholderHighChartsData(
                      widget.widgetConfiguration,
                      placeholderTimeSeriesData
                  )
                : transformADXTimeSeriesToHighChartsSeries(
                      data,
                      twinIdPropertyMap
                  ),
        [mode, widget.widgetConfiguration, data, twinIdPropertyMap]
    );

    return (
        <div className={dataHistoryClassNames.container}>
            <HighChartsWrapper
                title={displayName}
                seriesData={highChartSeriesData}
                isLoading={isLoading}
                chartOptions={{
                    titleTargetLink:
                        mode === BehaviorModalMode.viewer
                            ? deeplink
                            : undefined,
                    legendLayout: 'vertical',
                    legendPadding: 0,
                    hasMultipleAxes: chartOptions.yAxisType === 'independent',
                    dataGrouping: chartOptions.aggregationType
                }}
            />
        </div>
    );
};

/** Gets timeSeries list from data history widget and twins and
 * evaluate the twin id and property name tuples using the resolved twins to use in query
 */
const getTwinIdPropertyMap = (
    timeSeries: IDataHistoryTimeSeries,
    twins: Record<string, DTwin>
): Array<IDataHistoryWidgetTimeSeriesTwin> =>
    twins
        ? timeSeries.map((ts) => {
              const aliasAndPropertyTuple = ts.expression?.split('.'); // TODO: change this logic when timeSeries expressions gets complex, current expression is in [PrimaryTwin.Temperature] format
              if (twins && aliasAndPropertyTuple.length === 2) {
                  return {
                      label: ts.label,
                      twinId: twins[aliasAndPropertyTuple[0]]?.$dtId,
                      twinPropertyName: aliasAndPropertyTuple[1]
                  };
              }
          })
        : null;

/** Gets fetched adx time series data and data history widget time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart
 */
const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryWidgetTimeSeriesTwin>
): Array<IHighChartSeriesData> =>
    adxTimeSeries && twinIdPropertyMap
        ? adxTimeSeries.map(
              (series) =>
                  ({
                      name:
                          twinIdPropertyMap.find(
                              (map) =>
                                  map.twinId === series.id &&
                                  map.twinPropertyName === series.key
                          )?.label || series.id + ' ' + series.key, // this is the label for series to show in chart
                      data: series.data
                  } as IHighChartSeriesData)
          )
        : [];

const generatePlaceholderHighChartsData = (
    widgetConfig: IDataHistoryWidgetConfiguration,
    placeholderTimeSeriesData: Array<Array<TimeSeriesData>>
): Array<IHighChartSeriesData> => {
    return widgetConfig.timeSeries.map((ts, idx) => ({
        name: `${ts.label || ts.expression}`,
        data: placeholderTimeSeriesData[idx],
        tooltipSuffix: ts.unit
    }));
};

export default memo(DataHistoryWidget);
