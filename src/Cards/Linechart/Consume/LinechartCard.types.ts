import { ConsumeCardProps } from '../../../Models/Constants/Interfaces';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';

export interface LinechartCardProps extends ConsumeCardProps {
    searchSpan: SearchSpan;
}

export interface LineChartData {
    data: any;
}
