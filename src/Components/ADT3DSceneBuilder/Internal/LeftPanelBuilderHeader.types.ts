import {
    IStyleFunctionOrObject,
    ITheme,
    IStyle,
    IStackStyles
} from '@fluentui/react';

export interface ILeftPanelBuilderHeaderProps {
    /** top level text */
    headerText: string;
    /** text with optional icon under the header */
    subHeaderText: string | undefined;
    iconName: string | undefined;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ILeftPanelBuilderHeaderStyleProps,
        ILeftPanelBuilderHeaderStyles
    >;
}

export interface ILeftPanelBuilderHeaderStyleProps {
    theme: ITheme;
}
export interface ILeftPanelBuilderHeaderStyles {
    root: IStyle;
    header: IStyle;
    subHeader: IStyle;
    subHeaderIcon: IStyle;
    subHeaderText: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ILeftPanelBuilderHeaderSubComponentStyles;
}

export interface ILeftPanelBuilderHeaderSubComponentStyles {
    subHeaderStack?: IStackStyles;
}
