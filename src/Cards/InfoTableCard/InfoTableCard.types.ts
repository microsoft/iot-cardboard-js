import { Locale, Theme } from '../../Models/Constants';

export interface InfoTableCardProps {
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    headers: string[];
    tableRows: string[][];
    infoTableActionButtonProps?: {
        label: string;
        onClick: () => any;
    };
}
