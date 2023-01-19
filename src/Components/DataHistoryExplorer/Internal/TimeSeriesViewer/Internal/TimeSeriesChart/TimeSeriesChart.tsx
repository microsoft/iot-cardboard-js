import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    ITimeSeriesChartProps,
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
} from './TimeSeriesChart.types';
import { getStyles } from './TimeSeriesChart.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import HighChartsWrapper from '../../../../../HighChartsWrapper/HighChartsWrapper';
import ChartCommandBar from './Internal/ChartCommandBar/ChartCommandBar';
import { IHighChartSeriesData } from '../../../../../HighChartsWrapper/HighChartsWrapper.types';
import { transformADXTimeSeriesToHighChartsSeries } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { DataHistoryExplorerContext } from '../../../../DataHistoryExplorer';
import { useTimeSeriesData } from '../../../../../../Models/Hooks/useTimeSeriesData';
import { usePrevious } from '@fluentui/react-hooks';
import { IDataHistoryChartOptions } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';
import { QuickTimeSpans } from '../../../../../../Models/Constants/Constants';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { deepCopy } from '../../../../../../Models/Services/Utils';

const getClassNames = classNamesFunction<
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
>();

const TimeSeriesChart: React.FC<ITimeSeriesChartProps> = (props) => {
    const { defaultOptions, onChartOptionsChange, styles } = props;

    // state
    const [chartOptions, setChartOptions] = useState<IDataHistoryChartOptions>(
        deepCopy(defaultOptions) || {
            yAxisType: 'independent',
            defaultQuickTimeSpanInMillis:
                QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
            aggregationType: 'avg'
        }
    );

    // contexts
    const { adapter } = useContext(DataHistoryExplorerContext);
    const { timeSeriesTwinList } = useContext(TimeSeriesViewerContext);

    // hooks
    const xMinDateInMillisRef = useRef<number>(null);
    const xMaxDateInMillisRef = useRef<number>(null);
    const {
        query,
        deeplink,
        data,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: chartOptions.defaultQuickTimeSpanInMillis,
        twins: timeSeriesTwinList
    });
    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            timeSeriesTwinList?.length
                ? transformADXTimeSeriesToHighChartsSeries(
                      data,
                      timeSeriesTwinList
                  )
                : [],
        [data, timeSeriesTwinList]
    );

    // callbacks
    const updateXMinAndMax = useCallback(() => {
        const nowInMillis = Date.now();
        xMinDateInMillisRef.current =
            nowInMillis - chartOptions.defaultQuickTimeSpanInMillis;
        xMaxDateInMillisRef.current = nowInMillis;
    }, [chartOptions.defaultQuickTimeSpanInMillis]);

    // side effects
    const prevQuery = usePrevious(query);
    useEffect(() => {
        if (query && query !== prevQuery) {
            fetchTimeSeriesData();
            updateXMinAndMax();
        }
    }, [query]);
    useEffect(() => {
        if (onChartOptionsChange) {
            onChartOptionsChange(chartOptions);
        }
    }, [chartOptions]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <ChartCommandBar
                defaultOptions={chartOptions}
                onChange={setChartOptions}
                deeplink={deeplink}
            />
            <div className={classNames.chartContainer}>
                <HighChartsWrapper
                    seriesData={highChartSeriesData}
                    isLoading={isLoading}
                    chartOptions={{
                        titleAlign: 'left',
                        legendLayout: 'horizontal',
                        legendPadding: 0,
                        hasMultipleAxes:
                            chartOptions.yAxisType === 'independent',
                        dataGrouping: chartOptions.aggregationType,
                        xMinInMillis: xMinDateInMillisRef.current,
                        xMaxInMillis: xMaxDateInMillisRef.current,
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
