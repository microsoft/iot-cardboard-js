import { Theme } from '../../../Models/Constants/Enums';

export interface BaseCardCreateProps {
    title?: string;
    children?: React.ReactNode;
    theme?: Theme;
    form: React.ReactNode;
    preview: React.ReactNode;
}
