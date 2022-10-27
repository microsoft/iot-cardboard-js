import {
    IStyleFunctionOrObject,
    ITheme,
    IStyle,
    ISearchBoxStyles,
    IStackStyles
} from '@fluentui/react';

export interface IOATModelListProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IOATModelListStyleProps,
        IOATModelListStyles
    >;
}

export interface IOATModelListStyleProps {
    theme: ITheme;
}
export interface IOATModelListStyles {
    root: IStyle;
    listContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATModelListSubComponentStyles;
}

export interface IOATModelListSubComponentStyles {
    rootStack: IStackStyles;
    searchbox?: ISearchBoxStyles;
}
