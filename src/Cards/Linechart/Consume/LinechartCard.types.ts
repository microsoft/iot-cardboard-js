import { ConsumeCardProps } from '../../../Constants/Interfaces';
import { SearchSpan } from '../../../Models/SearchSpan';

export interface LinechartCardProps extends ConsumeCardProps {
    searchSpan: SearchSpan;
}

export interface LineChartData {
    data: any;
}
