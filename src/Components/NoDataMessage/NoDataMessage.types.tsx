import {
    IImageProps,
    IImageStyles,
    IStyle,
    ITextStyles
} from '@fluentui/react';

export interface NoDataMessageProps {
    /** Required: Text for the header of the message */
    headerText: string;
    /** Text for the description of the message */
    descriptionText?: string;
    /** Props to show an SVG or image as a part of the no data message */
    imageProps?: IImageProps;
    /** Styles prop for the component */
    styles?: NoDataMessageStyles;
}

export interface NoDataMessageStyles {
    /** Container around all component */
    container: IStyle;
    /** Styles for Text and Image child components */
    subComponentStyles?: NoDataMessageSubComponentStyles;
}

export interface NoDataMessageSubComponentStyles {
    /** Styles for header text */
    header: Partial<ITextStyles>;
    /** Styles prop for description text below header */
    description: Partial<ITextStyles>;
    /** Styles for image/svg */
    image: Partial<IImageStyles>;
}
