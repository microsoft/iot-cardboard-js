import { IHighChartSeriesData } from '../../Components/HighChartsWrapper/HighChartsWrapper.types';
import { IDataHistoryTimeSeriesTwin } from '../Constants/Interfaces';
import { ADXTimeSeries } from '../Constants/Types';

/** Gets fetched adx time series data and data history widget time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart
 */
export const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryTimeSeriesTwin>
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
