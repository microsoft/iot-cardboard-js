import {
    ITimeSeriesChartStyleProps,
    ITimeSeriesChartStyles
} from './TimeSeriesChart.types';

export const classPrefix = 'cb-timeserieschart';
const classNames = {
    root: `${classPrefix}-root`,
    chartContainer: `${classPrefix}-chart-container`
};
export const getStyles = (
    _props: ITimeSeriesChartStyleProps
): ITimeSeriesChartStyles => {
    return {
        root: [classNames.root],
        chartContainer: [
            classNames.chartContainer,
            { height: '100%', overflow: 'hidden' }
        ]
    };
};
