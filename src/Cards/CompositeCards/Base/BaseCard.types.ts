import { Locale, Theme } from '../../../Models/Constants/Enums';

export interface BaseCardProps {
    title?: string;
    children?: React.ReactNode;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
}
