import { Theme, Locale, AdapterResult } from '../..';

export interface BaseAdapterComponentProps {
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    isLoading?: boolean;
    noData?: boolean;
    children?: React.ReactNode;
    adapterResults?: Array<AdapterResult<any>>;
}
