import {
    IStyleFunctionOrObject,
    IStyle,
    ISearchBoxStyles,
    IStackStyles,
    IButtonStyles
} from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

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
    theme: IExtendedTheme;
}
export interface IOATModelListStyles {
    root: IStyle;
    listContainer: IStyle;
    noDataMessage: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATModelListSubComponentStyles;
}

export interface IOATModelListSubComponentStyles {
    listItem?: IStyleFunctionOrObject<{ isSelected: boolean }, IButtonStyles>;
    rootStack: IStackStyles;
    searchbox?: ISearchBoxStyles;
}
