import Highcharts, { ColorString } from 'highcharts';
import { TFunction } from 'react-i18next';
import { IHighChartSeriesData } from '../../Components/HighChartsWrapper/HighChartsWrapper.types';
import { QuickTimeSpans } from '../Constants/Constants';
import { QuickTimeSpanKey } from '../Constants/Enums';
import { IDataHistoryTimeSeriesTwin } from '../Constants/Interfaces';
import { ADXTimeSeries } from '../Constants/Types';
import { IDataHistoryChartYAxisType } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

export const getHighChartColor = (idx: number): ColorString =>
    idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
        ? '#d781fc'
        : (Highcharts.getOptions().colors[idx] as ColorString);

/** Gets fetched adx time series data and data history widget time series to twin mapping information
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
                  name: timeSeriesTwin?.label || series.id + ' ' + series.key, // this is the label for series to show in chart
                  data: series.data,
                  color: timeSeriesTwin?.chartProps?.color
              } as IHighChartSeriesData;
          })
        : [];

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
