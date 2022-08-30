import {
    IIconStyles,
    IModalStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IModelledPropertyBuilderAdapter, Theme } from '../../Models/Constants';
import { PropertyValueType } from '../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

/** Advanced search modal */
export interface IAdvancedSearchProps {
    adapter: IModelledPropertyBuilderAdapter;
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
    theme: Theme;
}

export interface IAdvancedSearchStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchStyles {
    content: IStyle;
    header: IStyle;
    headerText: IStyle;
    mainHeader: IStyle;
    subtitle: IStyle;
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
