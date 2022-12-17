import Highcharts, { ColorString } from 'highcharts';

export const getHighChartColor = (idx: number): ColorString =>
    idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
        ? '#d781fc'
        : (Highcharts.getOptions().colors[idx] as ColorString);
