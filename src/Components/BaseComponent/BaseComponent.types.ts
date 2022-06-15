import { Theme, Locale, AdapterResult, ComponentError } from '../..';

export interface BaseComponentProps {
    theme?: Theme;
    children?: React.ReactNode;
    locale?: Locale;
    localeStrings?: Record<string, any>;

    /** Whether to show loading overlay */
    isLoading?: boolean;

    /** Whether to show empty data overlay */
    isDataEmpty?: boolean;

    /** Set of adapter results to reduce catastraphic errors from */
    adapterResults?: Array<AdapterResult<any>>;

    /** Hardwire error UI with this prop */
    componentError?: ComponentError;

    /** Custom className for BaseComponent container */
    containerClassName?: string;

    /** Custom message to display under loading spinner: defaults to 'loading...' */
    customLoadingMessage?: string;

    /** Disable base component default styles */
    disableDefaultStyles?: boolean;
}
