import { Theme } from '../../../Models/Constants/Enums';
import { AdapterResolvedType } from '../../../Models/Constants/Types';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    children?: React.ReactNode;
    theme?: Theme;
    adapterResult: AdapterResolvedType<any>;
}
