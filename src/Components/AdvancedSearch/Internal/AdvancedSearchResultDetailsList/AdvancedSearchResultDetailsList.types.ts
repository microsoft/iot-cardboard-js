import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';

export interface IAdvancedSearchResultDetailsListProps {
    twins: IADTTwin[];
    searchedProperties: string[]; //string of fieldnames, for specific properties that were used in the search
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchResultDetailsListStyleProps,
        IAdvancedSearchResultDetailsListStyles
    >;
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
