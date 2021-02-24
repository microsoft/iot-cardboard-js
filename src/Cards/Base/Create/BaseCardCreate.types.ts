import { Theme } from '../../../Models/Constants/Enums';

export interface BaseCardCreateProps {
    title?: string;
    children?: React.ReactNode;
    theme?: Theme;
}
