import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
export interface LinechartCardProps extends IConsumeCardProps {
    searchSpan: SearchSpan;
    chartDataOptions?: Array<Record<string, any>>;
    chartOptions?: Record<string, any>;
}
