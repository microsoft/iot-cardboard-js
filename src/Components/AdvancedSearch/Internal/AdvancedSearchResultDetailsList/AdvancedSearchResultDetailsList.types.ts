import {
    IColumn,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IADTTwin } from '../../Models/Constants';

export interface IAdvancedSearchResultDetailsListProps {
    filteredTwinsResult: IADTTwin[];
    additionalColumns: IColumn[];
    // callback function from parent on what to do once the user selects or deselects a twin
    callbackFunction: void;
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
