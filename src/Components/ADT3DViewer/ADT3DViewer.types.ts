import { IStyle, ITheme } from '@fluentui/react';

export interface IADT3DViewerProps {
    type: 'Orbit' | 'Move';
}

export interface IADT3DViewerStyleProps {
    theme: ITheme;
}
export interface IADT3DViewerStyles {
    root: IStyle;
    layersDropdown: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IADT3DViewerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IADT3DViewerSubComponentStyles {}
