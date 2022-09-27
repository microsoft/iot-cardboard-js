import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export type IOATHeaderProps = {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IOATHeaderStyleProps, IOATHeaderStyles>;
};

export interface IOATHeaderStyleProps {
    theme: ITheme;
}

export interface IOATHeaderStyles {
    root: IStyle;
    searchComponent: IStyle;
    logo: IStyle;
    search: IStyle;
    options: IStyle;
    menuComponent: IStyle;
    optionIcon: IStyle;
    uploadDirectoryInput: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATHeaderSubComponentStyles;
}

export interface IOATHeaderSubComponentStyles {
    commandBar: ICommandBarStyles;
}
