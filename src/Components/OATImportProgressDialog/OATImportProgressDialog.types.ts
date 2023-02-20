import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { IConfirmDialogStyles } from '../ConfirmDialog/ConfirmDialog.types';

export interface IOATImportProgressDialogProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IOATImportProgressDialogStyleProps,
        IOATImportProgressDialogStyles
    >;
}

export interface IOATImportProgressDialogStyleProps {
    theme: IExtendedTheme;
}
export interface IOATImportProgressDialogStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATImportProgressDialogSubComponentStyles;
}

export interface IOATImportProgressDialogSubComponentStyles {
    dialog?: Partial<IConfirmDialogStyles>;
}
