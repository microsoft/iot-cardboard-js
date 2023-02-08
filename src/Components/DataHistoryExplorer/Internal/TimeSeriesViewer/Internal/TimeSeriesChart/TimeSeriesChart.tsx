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
import SearchErrorImg from '../../../../../../Resources/Static/searchError.svg';
import IllustrationMessage from '../../../../../IllustrationMessage/IllustrationMessage';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
>();

const TimeSeriesChart: React.FC<ITimeSeriesChartProps> = (props) => {
    const { data, explorerChartOptions, styles } = props;

    // contexts
    const { timeSeriesTwins } = useContext(TimeSeriesViewerContext);

    // hooks
    const { t } = useTranslation();
    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            timeSeriesTwins?.length
                ? transformADXTimeSeriesToHighChartsSeries(
                      data,
                      timeSeriesTwins
                  )
                : [],
        [data, timeSeriesTwins, transformADXTimeSeriesToHighChartsSeries]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            {!(data.length > 0) ? (
                <IllustrationMessage
                    descriptionText={t(
                        'dataHistoryExplorer.viewer.chart.messages.noData'
                    )}
                    type={'info'}
                    width={'wide'}
                    imageProps={{
                        src: SearchErrorImg,
                        height: 172
                    }}
                    styles={{ container: { flexGrow: 1 } }}
                />
            ) : (
                <div className={classNames.chartContainer}>
                    <HighChartsWrapper
                        seriesData={highChartSeriesData}
                        chartOptions={{
                            titleAlign: 'left',
                            legendLayout: 'horizontal',
                            legendPadding: 0,
                            hasMultipleAxes:
                                explorerChartOptions.yAxisType ===
                                'independent',
                            dataGrouping: explorerChartOptions.aggregationType,
                            xMinInMillis: explorerChartOptions.xMinDateInMillis,
                            xMaxInMillis: explorerChartOptions.xMaxDateInMillis,
                            maxLegendHeight: 160
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default styled<
    ITimeSeriesChartProps,
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
>(TimeSeriesChart, getStyles);
