import { IImageProps } from '@fluentui/react';

export interface NoDataMessageProps {
    /** Required: Tag that maps to a locale string for the header of the message */
    headerTextTag: string;
    /** Props to show an SVG or image as a part of the no data message */
    imageProps?: IImageProps;
    /** Tag that maps to a locale string for the description of the message */
    descriptionTextTag?: string;
}
