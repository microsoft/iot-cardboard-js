import { Locale, Theme } from '../../../Models/Constants/Enums';

export interface LinechartCardCreateProps {
    theme: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>; // resource json object including key and value pairs of translation strings
    propertyNames: Array<string>;
    defaultState?: LinechartCardCreateState;
    /** If set, this string is used to generate chart container GUIDs
     *  which are stable between builds using a random seeding algorithm */
    guidSeed?: string;
}

export interface LinechartCardCreateState {
    selectedPropertyNames: Array<string>;
    chartPropertyNames: Array<string>;
    title: string;
}

export interface LinechartCardCreateFormProps {
    propertyNames: Array<string>;
    onSubmit: any;
    setSelectedPropertyNames: any;
    selectedPropertyNames: Array<string>;
    setTitle: any;
    title: string;
}
