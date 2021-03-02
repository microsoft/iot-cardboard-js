import { Theme } from '../../../Models/Constants/Enums';
import { AdapterResult } from '../../../Models/Constants/Types';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    children?: React.ReactNode;
    theme?: Theme;
    // Using <any> type because BaseCard only cares about the presence of ANY data and or errors.
    adapterResult: AdapterResult<any>;
}
