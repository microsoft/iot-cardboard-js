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
        root: [
            classNames.root,
            {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }
        ],
        chartContainer: [
            classNames.chartContainer,
            { flexGrow: 1, overflow: 'hidden' }
        ]
    };
};
