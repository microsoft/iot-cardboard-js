import { Locale, Theme } from '../../../Models/Constants/Enums';
import AdapterResult from '../../../Models/Classes/AdapterResult';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    children?: React.ReactNode;
    theme?: Theme;
    // Using <any> type because BaseCard only cares about the presence of ANY data and or errors.
    adapterResult: AdapterResult<any>;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
}
