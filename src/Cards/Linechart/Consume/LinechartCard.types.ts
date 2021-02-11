import { IBaseAdapter } from '../../../Adapters/IBaseAdapter';
import { Theme } from '../../../Constants/Enums';
import { SearchSpan } from '../../../Models/SearchSpan';

export interface LinechartCardProps {
    adapter: IBaseAdapter;
    id: string;
    searchSpan: SearchSpan;
    properties: string[];
    theme: Theme;
    additionalProperties?: Record<string, any>;
}

export interface LineChartData {
    data: any;
}
