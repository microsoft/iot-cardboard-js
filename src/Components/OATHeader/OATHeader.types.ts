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
    logo: IStyle;
    menuComponent: IStyle;
    optionIcon: IStyle;
    options: IStyle;
    search: IStyle;
    searchComponent: IStyle;
    uploadDirectoryInput: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATHeaderSubComponentStyles;
}

export interface IOATHeaderSubComponentStyles {
    commandBar: ICommandBarStyles;
}
