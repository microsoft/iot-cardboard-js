import {
    IIconStyles,
    IModalStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADTAdapter, MockAdapter } from '../../Adapters';
import { PropertyValueType } from '../../Models/Constants';

export const QUERY_RESULT_LIMIT = 1000;

/** Advanced search modal */
export interface IAdvancedSearchProps {
    adapter: ADTAdapter | MockAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    isOpen: boolean;
    onDismiss: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchStyleProps,
        IAdvancedSearchStyles
    >;
}

export interface IAdvancedSearchStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchStyles {
    content: IStyle;
    headerContainer: IStyle;
    title: IStyle;
    titleContainer: IStyle;
    subtitle: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchSubComponentStyles;
}

export interface IAdvancedSearchSubComponentStyles {
    modal?: Partial<IModalStyles>;
    icon?: IIconStyles;
}

/** Search results types */
export interface IAdvancedSearchResultsProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchResultsStyleProps,
        IAdvancedSearchResultsStyles
    >;
}

export interface IAdvancedSearchResultsStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchResultsStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchResultsSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdvancedSearchResultsSubComponentStyles {}
