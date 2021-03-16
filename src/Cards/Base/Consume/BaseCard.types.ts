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
    localeStrings?: Object; // including key and value pairs of translation strings
}

// export interface BaseCardPropsWithOptLocale extends BaseCardProps {
//     locale?: Locale;
//     localeStrings?: never; // to make locale and localeStrings mutually exclusive
// }

// export interface BaseCardPropsWithOptLocaleStrings extends BaseCardProps {
//     localeStrings?: Object; // including key and value pairs of translation strings
//     locale?: never; // to make locale and localeStrings mutually exclusive
// }
