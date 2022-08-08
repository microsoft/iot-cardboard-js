import {
    IColumn,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    IADTTwin,
    IPropertyInspectorAdapter,
    Locale,
    Theme
} from '../../../../Models/Constants';

export interface IAdvancedSearchResultDetailsListProps {
    filteredTwinsResult: IADTTwin[];
    additionalColumns: IColumn[];
    // callback function from parent on what to do once the user selects or deselects a twin
    callbackFunction?: void; //not meant to be optional, just did that for now so the stories work
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchResultDetailsListStyleProps,
        IAdvancedSearchResultDetailsListStyles
    >;
    theme?: Theme;
    locale?: Locale;
    adapter?: IPropertyInspectorAdapter;
}

export interface IAdvancedSearchResultDetailsListStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchResultDetailsListStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchResultDetailsListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdvancedSearchResultDetailsListSubComponentStyles {}
