import { classNamesFunction, styled, useTheme } from '@fluentui/react';
import React, { memo, useContext, useEffect, useMemo, useRef } from 'react';
import {
    ADXTimeSeries,
    BehaviorModalMode,
    DTwin,
    IADXConnection,
    IDataHistoryWidgetTimeSeriesTwin,
    TimeSeriesData
} from '../../../../../Models/Constants';
import { useTimeSeriesData } from '../../../../../Models/Hooks/useTimeSeriesData';
import { getMockTimeSeriesDataArrayInLocalTime } from '../../../../../Models/Services/Utils';
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
        connection,
        timeSeries,
        chartOptions
    } = widget.widgetConfiguration;

    const { adapter, twins, mode } = useContext(BehaviorsModalContext);
    const twinIdPropertyMap = getTwinIdPropertyMap(timeSeries, twins);
    const isRequestSent = useRef(false);

    const connectionToQuery: IADXConnection = useMemo(
        () =>
            connection
                ? {
                      kustoClusterUrl: connection.adxClusterUrl,
                      kustoDatabaseName: connection.adxDatabaseName,
                      kustoTableName: connection.adxTableName
                  }
                : null,
        [connection]
    );
    const {
        query,
        deeplink,
        data,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connection: connectionToQuery,
        quickTimeSpanInMillis: chartOptions.defaultQuickTimeSpanInMillis,
        twins: twinIdPropertyMap
    });

    const xMinDateInMillisRef = useRef<number>(null);
    const xMaxDateInMillisRef = useRef<number>(null);

    useEffect(() => {
        if (
            mode === BehaviorModalMode.viewer &&
            query &&
            (adapter || connection) &&
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
    }, [adapter, query, connection, twinIdPropertyMap, chartOptions, mode]);

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
