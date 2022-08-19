import {
    IDetailsListStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    IADTTwin,
    IPropertyInspectorAdapter
} from '../../../../Models/Constants';
import { IPropertyInspectorCalloutStyles } from '../../../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout.types';

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
    headerCorrection: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchResultDetailsListSubComponentStyles;
}

export interface IAdvancedSearchResultDetailsListSubComponentStyles {
    propertyInspector?: IPropertyInspectorCalloutStyles;
    detailsList?: IDetailsListStyles;
}
