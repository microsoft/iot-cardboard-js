import { IStackStyles, IStyle, ITheme } from '@fluentui/react';

export interface IADT3DViewerStyleProps {
    theme: ITheme;
}
export interface IADT3DViewerStyles {
    root: IStyle;
    layersDropdown: IStyle;
    viewerWrapper: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IADT3DViewerSubComponentStyles;
}

export interface IADT3DViewerSubComponentStyles {
    headerStack?: IStackStyles;
}
