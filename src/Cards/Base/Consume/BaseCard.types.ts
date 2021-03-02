import { Theme } from '../../../Models/Constants/Enums';
import { AdapterResult } from '../../../Models/Constants/Types';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    children?: React.ReactNode;
    theme?: Theme;
    adapterResult: AdapterResult<any>;
}
