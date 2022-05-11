import {
    IButtonProps,
    IButtonStyles,
    IImageProps,
    IImageStyles,
    ILinkProps,
    ILinkStyles,
    IStyle,
    ITextStyles,
    Theme
} from '@fluentui/react';

export type IllustrationMessageType = 'error' | 'info';
export type IllustrationMessageWidth = 'wide' | 'compact';

export interface IllustrationMessageProps {
    /** Required: Text for the header of the message */
    headerText: string;
    /** Required: Type of message either info or error */
    type: IllustrationMessageType;
    /** Required: Type of message either info or error */
    width: IllustrationMessageWidth;
    /** Text for the description of the message */
    descriptionText?: string;
    /** Text for link shown after description */
    linkText?: string;
    /** Required to show link, Link props for link shown after description */
    linkProps?: ILinkProps;
    /** Props to show an SVG or image as a part of the no data message */
    imageProps?: IImageProps;
    /** Button props for button shown at the bottom of the message */
    buttonProps?: IButtonProps;
    /** Styles prop for the component, use this prop for styles
     * of header, description, link, image, and button
     */
    styles?: IllustrationMessageStyles;
}

export interface IllustrationMessageStyleProps {
    type: IllustrationMessageType;
    width: IllustrationMessageWidth;
    theme?: Theme;
}

export interface IllustrationMessageStyles {
    /** Container around all component */
    container: IStyle;
    /** Styles for description text container */
    descriptionContainer?: IStyle;
    /** Styles for Text and Image child components */
    subComponentStyles?: IllustrationMessageSubComponentStyles;
}

export interface IllustrationMessageSubComponentStyles {
    /** Styles for header text */
    header?: Partial<ITextStyles>;
    /** Styles prop for description text below header */
    description?: Partial<ITextStyles>;
    /** Styles for image/svg */
    image?: Partial<IImageStyles>;
    /** Styles for link */
    link?: Partial<ILinkStyles>;
    /** Styles for primary button */
    button?: IButtonStyles;
}
