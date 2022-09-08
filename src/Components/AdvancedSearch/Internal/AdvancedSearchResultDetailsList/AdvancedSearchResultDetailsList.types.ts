import {
    IDetailsListStyles,
    ISpinnerStyles,
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
    adapter: IPropertyInspectorAdapter;
    containsError: boolean;
    isLoading: boolean;
    /* Callback function from parent on what to do once the user selects or deselects a twin. */
    onTwinSelection: (IADTTwin) => void;
    /* String of fieldnames, for specific properties that were used in the search. */
    searchedProperties: string[];
    /* Call to provide customized styling that will layer on top of the variant rules. */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchResultDetailsListStyleProps,
        IAdvancedSearchResultDetailsListStyles
    >;
    twins: IADTTwin[];
}

export interface IAdvancedSearchResultDetailsListStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchResultDetailsListStyles {
    root: IStyle;
    listHeader: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchResultDetailsListSubComponentStyles;
}

export interface IAdvancedSearchResultDetailsListSubComponentStyles {
    detailsList?: IDetailsListStyles;
    propertyInspector?: IPropertyInspectorCalloutStyles;
    spinner?: Partial<ISpinnerStyles>;
}
