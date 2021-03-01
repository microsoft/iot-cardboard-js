import { Theme } from '../../../Models/Constants/Enums';
import { AdapterReturnType } from '../../../Models/Constants/Types';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    noData: boolean;
    children?: React.ReactNode;
    theme?: Theme;
}
