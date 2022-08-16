import {
    IIconStyles,
    IModalStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IPropertyInspectorAdapter } from '../../Models/Constants';

/** Advanced search modal */
export interface IAdvancedSearchProps {
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
    header: IStyle;
    headerText: IStyle;
    queryContainer: IStyle;
    resultsContainer: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchSubComponentStyles;
}

export interface IAdvancedSearchSubComponentStyles {
    modal?: Partial<IModalStyles>;
    icon?: IIconStyles;
}

/** Query builder types */
export interface IQueryBuilderProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQueryBuilderStyleProps,
        IQueryBuilderStyles
    >;
}

export interface IQueryBuilderStyleProps {
    theme: ITheme;
}
export interface IQueryBuilderStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQueryBuilderSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQueryBuilderSubComponentStyles {}

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

export interface IPropertyInspectorCalloutProps {
    twinId: string;
    adapter: IPropertyInspectorAdapter;
    iconProps: { iconName: string };
    title: string;
    ariaLabel: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdvancedSearchResultsSubComponentStyles {}
