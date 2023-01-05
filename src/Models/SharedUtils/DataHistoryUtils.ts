import Highcharts, { ColorString } from 'highcharts';
import { CUSTOM_HIGHCHARTS_COLOR_IDX_1 } from '../Constants/StyleConstants';

export const getHighChartColor = (idx: number): ColorString =>
    idx === 1
        ? CUSTOM_HIGHCHARTS_COLOR_IDX_1
        : (Highcharts.getOptions().colors[idx] as ColorString);
