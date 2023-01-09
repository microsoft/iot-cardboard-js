import Highcharts, { ColorString } from 'highcharts';
import { TFunction } from 'react-i18next';
import { IHighChartSeriesData } from '../../Components/HighChartsWrapper/HighChartsWrapper.types';
import { QuickTimeSpans } from '../Constants/Constants';
import { QuickTimeSpanKey } from '../Constants/Enums';
import { IDataHistoryTimeSeriesTwin } from '../Constants/Interfaces';
import { CUSTOM_HIGHCHARTS_COLOR_IDX_1 } from '../Constants/StyleConstants';
import { ADXTimeSeries, ADXTimeSeriesTableRow } from '../Constants/Types';
import { sortAscendingOrDescending } from '../Services/Utils';
import { IDataHistoryChartYAxisType } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

export const getHighChartColor = (idx: number): ColorString =>
    idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
        ? CUSTOM_HIGHCHARTS_COLOR_IDX_1
        : (Highcharts.getOptions().colors[idx] as ColorString);

/**
 * Gets ADX time series table row and transform it into ADX time series object keyed by id and key fields
 * with reduced data field
 */
export const transformADXTableRowToTimeSeriesData = (
    adxTableRows: Array<ADXTimeSeriesTableRow>
): Array<ADXTimeSeries> => {
    const timeSeries: Array<ADXTimeSeries> = [];
    adxTableRows.sort(sortAscendingOrDescending('timestamp')).forEach((row) => {
        const existingTimeSeries = timeSeries.find(
            (ts) => ts.id === row.id && ts.key === row.key
        );
        if (existingTimeSeries) {
            existingTimeSeries.data.push({
                timestamp: row.timestamp, // note that date is in UTC
                value: row.value
            });
        } else {
            timeSeries.push({
                id: row.id,
                key: row.key,
                data: [
                    {
                        timestamp: row.timestamp, // note that date is in UTC
                        value: row.value
                    }
                ]
            });
        }
    });
    return timeSeries;
};

/** Gets fetched adx time series data and time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart
 */
export const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryTimeSeriesTwin>
): Array<IHighChartSeriesData> =>
    adxTimeSeries && twinIdPropertyMap
        ? adxTimeSeries.map((series) => {
              const timeSeriesTwin = twinIdPropertyMap.find(
                  (map) =>
                      map.twinId === series.id &&
                      map.twinPropertyName === series.key
              );
              return {
                  name:
                      timeSeriesTwin?.label ||
                      getDefaultSeriesLabel(series.id, series.key), // this is the label for series to show in chart
                  data: series.data,
                  color: timeSeriesTwin?.chartProps?.color
              } as IHighChartSeriesData;
          })
        : [];

/**
 * Gets a single ADX time series and transform it into a shape to view in raw data table
 */
export const transformADXTimeSeriesToTableData = (
    adxTimeSeries: ADXTimeSeries
): Array<ADXTimeSeriesTableRow> =>
    adxTimeSeries?.data?.map(
        (tsData) =>
            ({
                timestamp: tsData.timestamp,
                id: adxTimeSeries.id,
                key: adxTimeSeries.key,
                value: tsData.value
            } as ADXTimeSeriesTableRow)
    ) || [];

export const getYAxisTypeOptions = (t: TFunction) => {
    return [
        {
            key: 'shared' as IDataHistoryChartYAxisType,
            text: t(
                'widgets.dataHistory.form.chartOptions.yAxisType.sharedLabel'
            )
        },
        {
            key: 'independent' as IDataHistoryChartYAxisType,
            text: t(
                'widgets.dataHistory.form.chartOptions.yAxisType.independentLabel'
            )
        }
    ];
};

/** Returns QuickTimeSpanKey from given millisecond */
export const getQuickTimeSpanKeyByValue = (
    millis: number
): QuickTimeSpanKey => {
    let key: QuickTimeSpanKey;
    const idx = Object.values(QuickTimeSpans).indexOf(millis);
    if (idx !== -1) {
        key = Object.keys(QuickTimeSpans)[idx] as QuickTimeSpanKey;
    }
    return key;
};

/** The default formatter for a time series label */
export const getDefaultSeriesLabel = (
    twinId: string,
    propertyName: string // can be nested
): string => {
    return `${twinId} ${propertyName}`;
};
