import {
    IIconStyles,
    IModalStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

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
