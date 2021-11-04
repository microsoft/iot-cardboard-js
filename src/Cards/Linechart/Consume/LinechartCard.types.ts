import {
    IConsumeCardProps,
    ITsiClientChartDataAdapter
} from '../../../Models/Constants/Interfaces';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
export interface LinechartCardProps extends IConsumeCardProps {
    adapter: ITsiClientChartDataAdapter;
    searchSpan: SearchSpan;
    pollingIntervalMillis?: number;
    chartDataOptions?: Array<Record<string, any>>;
    chartOptions?: Record<string, any>;
}
