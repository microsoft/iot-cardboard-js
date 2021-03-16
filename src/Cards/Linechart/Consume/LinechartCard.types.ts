import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
export interface LinechartCardProps extends IConsumeCardProps {
    searchSpan: SearchSpan;
    additionalProperties?: LinechartCardAdditionalPropertiesProps;
}

export interface LinechartCardAdditionalPropertiesProps {
    chartDataOptions?: any;
    chartOptions?: any;
}
