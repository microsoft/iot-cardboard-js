import { classNamesFunction, styled, useTheme } from '@fluentui/react';
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
    IDataHistoryWidgetConfiguration
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import HighChartsWrapper from '../../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../../HighChartsWrapper/HighChartsWrapper.types';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getStyles } from './DataHistoryWidget.styles';
import {
    IDataHistoryWidgetProps,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from './DataHistoryWidget.types';

const getClassNames = classNamesFunction<
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
>();

const DataHistoryWidget: React.FC<IDataHistoryWidgetProps> = ({
    widget,
    styles
}) => {
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
        quickTimeSpanInMillis: chartOptions.defaultQuickTimeSpanInMillis,
        twins: twinIdPropertyMap
    });

    const xMinDateInMillisRef = useRef<number>(null);
    const xMaxDateInMillisRef = useRef<number>(null);

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
            const nowInMillis = Date.now();
            xMinDateInMillisRef.current =
                nowInMillis - chartOptions.defaultQuickTimeSpanInMillis;
            xMaxDateInMillisRef.current = nowInMillis;
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
    > = useMemo(
        () =>
            getMockTimeSeriesDataArrayInLocalTime(
                timeSeries.length,
                5,
                chartOptions.defaultQuickTimeSpanInMillis
            ),
        [chartOptions.defaultQuickTimeSpanInMillis, timeSeries.length]
    );

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

    const classNames = getClassNames(styles, { theme: useTheme() });
    return (
        <div className={classNames.root}>
            <HighChartsWrapper
                title={displayName}
                seriesData={highChartSeriesData}
                isLoading={isLoading}
                chartOptions={{
                    titleAlign: 'left',
                    titleTargetLink:
                        mode === BehaviorModalMode.viewer
                            ? deeplink
                            : undefined,
                    legendLayout: 'vertical',
                    legendPadding: 0,
                    hasMultipleAxes: chartOptions.yAxisType === 'independent',
                    dataGrouping: chartOptions.aggregationType,
                    xMinInMillis: xMinDateInMillisRef.current,
                    xMaxInMillis: xMaxDateInMillisRef.current
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
              const splittedArray = ts.expression?.split('.'); // expression is in [PrimaryTwin.Temperature] or [PrimaryTwin.Status.Temperature] nested propery format
              if (splittedArray) {
                  const [alias, ...propertyPath] = splittedArray;
                  if (twins && alias?.length && propertyPath?.length) {
                      return {
                          label: ts.label,
                          twinId: twins[alias]?.$dtId,
                          twinPropertyName: propertyPath.join('.')
                      };
                  }
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

/** Generate placeholder mock data for timeseries to show in chart in preview mode
 */
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

export default styled<
    IDataHistoryWidgetProps,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
>(memo(DataHistoryWidget), getStyles);

/** Creates mock time series data array with data points between now and a certain milliseconds ago */
const getMockTimeSeriesDataArrayInLocalTime = (
    lengthOfSeries = 1,
    numberOfDataPoints = 5,
    agoInMillis = 1 * 60 * 60 * 1000
): Array<Array<TimeSeriesData>> => {
    const toInMillis = Date.now();
    const fromInMillis = toInMillis - agoInMillis;
    return Array.from({ length: lengthOfSeries }).map(() =>
        Array.from({ length: numberOfDataPoints }, () => ({
            timestamp: Math.floor(
                Math.random() * (toInMillis - fromInMillis + 1) + fromInMillis
            ),
            value: Math.floor(Math.random() * 500)
        })).sort((a, b) => (a.timestamp as number) - (b.timestamp as number))
    );
};
