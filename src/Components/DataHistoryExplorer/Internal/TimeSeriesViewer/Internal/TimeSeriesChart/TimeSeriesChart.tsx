import React, { useContext, useMemo } from 'react';
import {
    ITimeSeriesChartProps,
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
} from './TimeSeriesChart.types';
import { getStyles } from './TimeSeriesChart.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import HighChartsWrapper from '../../../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../../../HighChartsWrapper/HighChartsWrapper.types';
import { transformADXTimeSeriesToHighChartsSeries } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';

const getClassNames = classNamesFunction<
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
>();

const TimeSeriesChart: React.FC<ITimeSeriesChartProps> = (props) => {
    const { data, chartOptions, styles } = props;

    // contexts
    const { timeSeriesTwins } = useContext(TimeSeriesViewerContext);

    // hooks
    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            timeSeriesTwins?.length
                ? transformADXTimeSeriesToHighChartsSeries(
                      data,
                      timeSeriesTwins
                  )
                : [],
        [data, timeSeriesTwins]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <div className={classNames.chartContainer}>
                <HighChartsWrapper
                    seriesData={highChartSeriesData}
                    chartOptions={{
                        titleAlign: 'left',
                        legendLayout: 'horizontal',
                        legendPadding: 0,
                        hasMultipleAxes:
                            chartOptions.yAxisType === 'independent',
                        dataGrouping: chartOptions.aggregationType,
                        xMinInMillis: chartOptions.xMinDateInMillis,
                        xMaxInMillis: chartOptions.xMaxDateInMillis,
                        maxLegendHeight: 160
                    }}
                />
            </div>
        </div>
    );
};

export default styled<
    ITimeSeriesChartProps,
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
>(TimeSeriesChart, getStyles);
