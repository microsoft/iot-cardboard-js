import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import {
    IADTTwin,
    IPropertyInspectorAdapter
} from '../../../../Models/Constants';

export interface IAdvancedSearchResultDetailsListProps {
    twins: IADTTwin[];
    searchedProperties: string[]; //string of fieldnames, for specific properties that were used in the search
    // callback function from parent on what to do once the user selects or deselects a twin
    onTwinSelection?: (IADTTwin) => void; //not meant to be optional, just did that for now so the stories work
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchResultDetailsListStyleProps,
        IAdvancedSearchResultDetailsListStyles
    >;
    adapter?: IPropertyInspectorAdapter;
}

export interface IAdvancedSearchResultDetailsListStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchResultDetailsListStyles {
    root: IStyle;
    propertyIcon: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchResultDetailsListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdvancedSearchResultDetailsListSubComponentStyles {}
