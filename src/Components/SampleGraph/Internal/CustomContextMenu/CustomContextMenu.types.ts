import { IStyle } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomContextMenuProps {}

export interface ICustomContextMenuStyleProps {
    theme: IExtendedTheme;
}
export interface ICustomContextMenuStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICustomContextMenuSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomContextMenuSubComponentStyles {}
