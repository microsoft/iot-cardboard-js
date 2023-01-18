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
import { ADXTimeSeries } from '../Constants/Types';
import { objectHasOwnProperty } from '../Services/Utils';
import { IDataHistoryChartYAxisType } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

export const getHighChartColorByIdx = (idx: number): ColorString =>
    idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
        ? CUSTOM_HIGHCHARTS_COLOR_IDX_1
        : (Highcharts.getOptions().colors[idx] as ColorString);

/**
 * Picking color from an array containing the 10 default colors for the chart's series in HighCharts. When all colors are used, new colors are pulled from the start again.
 * @param usedColors set of already used colors to keep track of
 * @returns a new color which has not been used before if not in first 10 different colors
 */
export const getRandomHighChartColor = (
    usedColors: Array<ColorString> = []
): ColorString => {
    const PALETTE_SIZE = 10; // HighCharts has 10 different colors
    let nextColorIdx = usedColors.length % PALETTE_SIZE;
    if (usedColors.includes(getHighChartColorByIdx(nextColorIdx))) {
        Highcharts.getOptions().colors.forEach((_c: ColorString, idx) => {
            // first try to use an available one between 0 and PALETTE_SIZE
            if (!usedColors.includes(getHighChartColorByIdx(idx))) {
                nextColorIdx = idx;
            }
        });
    }
    const newColor: ColorString = getHighChartColorByIdx(nextColorIdx);
    usedColors.push(newColor);
    return newColor;
};

/** Gets fetched adx time series data and data history widget time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart.
 * Make sure there is one-to-one relationship between the parameters and are in order
 */
export const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryTimeSeriesTwin>
): Array<IHighChartSeriesData> =>
    adxTimeSeries && twinIdPropertyMap
        ? adxTimeSeries.map((series, idx) => {
              let timeSeriesTwin = twinIdPropertyMap[idx];
              if (
                  timeSeriesTwin?.twinId !== series.id ||
                  timeSeriesTwin?.twinPropertyName !== series.key
              ) {
                  // make sure if the twin mapping is in correct order by checking id and key
                  timeSeriesTwin = twinIdPropertyMap.find(
                      (map) =>
                          map.twinId === series.id &&
                          map.twinPropertyName === series.key
                  );
              }
              return {
                  name: getSeriesName(timeSeriesTwin) || getSeriesName(series), // this is the label for series to show in chart
                  data: series.data,
                  color: timeSeriesTwin?.chartProps?.color
              } as IHighChartSeriesData;
          })
        : [];

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
              (seriesTwin as IDataHistoryTimeSeriesTwin).twinId +
                  ' ' +
                  (seriesTwin as IDataHistoryTimeSeriesTwin).twinPropertyName
            : (seriesTwin as ADXTimeSeries).id +
              ' ' +
              (seriesTwin as ADXTimeSeries).key
        : null;
