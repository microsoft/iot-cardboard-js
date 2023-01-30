import Highcharts, { ColorString } from 'highcharts';
import { TFunction } from 'react-i18next';
import { IHighChartSeriesData } from '../../Components/HighChartsWrapper/HighChartsWrapper.types';
import { QuickTimeSpans } from '../Constants/Constants';
import { QuickTimeSpanKey } from '../Constants/Enums';
import {
    IChartOption,
    IDataHistoryTimeSeriesTwin
} from '../Constants/Interfaces';
import { CUSTOM_HIGHCHARTS_COLOR_IDX_1 } from '../Constants/StyleConstants';
import {
    ADXTimeSeries,
    ADXTimeSeriesTableRow,
    TimeSeriesData
} from '../Constants/Types';
import { objectHasOwnProperty } from '../Services/Utils';
import { IDataHistoryChartYAxisType } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

/** Creates mock time series data array with data points between now and a certain milliseconds ago */
export const getMockTimeSeriesDataArrayInLocalTime = (
    lengthOfSeries = 1,
    numberOfDataPoints = 5,
    agoInMillis = 1 * 60 * 60 * 1000
): Array<Array<TimeSeriesData>> => {
    const toInMillis = Date.now();
    const fromInMillis = toInMillis - agoInMillis;
    return Array.from({ length: lengthOfSeries }).map(() => {
        const maxLimitVariance = Math.floor(Math.random() * 500); // pick a max value between 0-500 as this timeseries value range to add more variance for values of different timeseries in independent y axes
        return Array.from({ length: numberOfDataPoints }, () => ({
            timestamp: Math.floor(
                Math.random() * (toInMillis - fromInMillis + 1) + fromInMillis
            ),
            value: Math.floor(Math.random() * maxLimitVariance)
        })).sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
    });
};

export const getHighChartColorByIdx = (idx: number): ColorString =>
    idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
        ? CUSTOM_HIGHCHARTS_COLOR_IDX_1
        : (Highcharts.getOptions().colors[idx] as ColorString);

/**
 * Picking the next available color from an array containing the 10 default colors for the chart's series in HighCharts.
 * When all colors are used, new colors are pulled from the start again in a loop fashion.
 * @param usedColors set of already used colors to keep track of
 * @returns a new color which has not been used before if not in first 10 different colors
 */
export const getHighChartColor = (
    usedColors: Array<ColorString> = []
): ColorString => {
    const PALETTE_SIZE = 10; // HighCharts has 10 different colors
    let nextColorIdx = usedColors.length % PALETTE_SIZE;
    if (usedColors.includes(getHighChartColorByIdx(nextColorIdx))) {
        for (
            let index = 0;
            index < Highcharts.getOptions().colors.length;
            index++
        ) {
            // first try to use an available one between 0 and PALETTE_SIZE based on the passed usedColor list,
            // considering a series in between might have been removed and an available color might exist to use first before continuing from the current index
            if (!usedColors.includes(getHighChartColorByIdx(index))) {
                nextColorIdx = index;
                break;
            }
        }
    }
    const newColor: ColorString = getHighChartColorByIdx(nextColorIdx);
    usedColors.push(newColor);
    return newColor;
};

/** Gets fetched adx time series data and data history widget time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart.
 * Make sure there is one-to-one relationship between the parameters
 */
export const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryTimeSeriesTwin>
): Array<IHighChartSeriesData> =>
    adxTimeSeries && twinIdPropertyMap
        ? adxTimeSeries.map((series) => {
              const timeSeriesTwin = twinIdPropertyMap.find(
                  (map) => map.seriesId === series.seriesId
              );

              return {
                  name: getSeriesName(timeSeriesTwin) || getSeriesName(series), // this is the label for series to show in chart
                  data: series.data,
                  color: timeSeriesTwin?.chartProps?.color
              } as IHighChartSeriesData;
          })
        : [];

/**
 * Gets a single ADX time series and transform it into a shape to view in raw data table
 */
export const transformADXTimeSeriesToADXTableData = (
    adxTimeSeries: ADXTimeSeries
): Array<ADXTimeSeriesTableRow> =>
    adxTimeSeries?.data?.map(
        (tsData) =>
            ({
                timestamp:
                    typeof tsData.timestamp === 'number'
                        ? new Date(tsData.timestamp).toISOString()
                        : tsData.timestamp,
                id: adxTimeSeries.id,
                key: adxTimeSeries.key,
                value: tsData.value
            } as ADXTimeSeriesTableRow)
    ) || [];

/** Returns y-axis options as chart options */
export const getYAxisTypeOptions = (t: TFunction): Array<IChartOption> => {
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

/** Returns quick timespan options as chart options */
export const getQuickTimeSpanOptions = (t: TFunction): Array<IChartOption> => {
    return Object.keys(QuickTimeSpans).map((timeSpan) => ({
        key: timeSpan,
        text: t(`quickTimesDropdown.options.${timeSpan}`),
        data: QuickTimeSpans[timeSpan]
    }));
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

/**
 * Returns a name for a series which is going to be used in chart,
 * first check for label if exists, otherwise,
 * concatenate id with property name
 */
export const getSeriesName = (
    seriesTwin: IDataHistoryTimeSeriesTwin | ADXTimeSeries
): string =>
    seriesTwin
        ? objectHasOwnProperty(seriesTwin, 'twinId')
            ? (seriesTwin as IDataHistoryTimeSeriesTwin).label ||
              `${(seriesTwin as IDataHistoryTimeSeriesTwin).twinId} (${
                  (seriesTwin as IDataHistoryTimeSeriesTwin).twinPropertyName
              })`
            : `${(seriesTwin as ADXTimeSeries).id} (${
                  (seriesTwin as ADXTimeSeries).key
              })`
        : null;

/** The default formatter for a time series label */
export const getDefaultSeriesLabel = (
    twinId: string,
    propertyName: string // can be nested
): string => {
    return `${twinId} (${propertyName})`;
};
