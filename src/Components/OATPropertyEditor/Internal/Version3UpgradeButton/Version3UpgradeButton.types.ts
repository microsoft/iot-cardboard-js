import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IVersion3UpgradeButtonProps {
    onUpgrade: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IVersion3UpgradeButtonStyleProps,
        IVersion3UpgradeButtonStyles
    >;
}

export interface IVersion3UpgradeButtonStyleProps {
    theme: IExtendedTheme;
}
export interface IVersion3UpgradeButtonStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IVersion3UpgradeButtonSubComponentStyles;
}

export interface IVersion3UpgradeButtonSubComponentStyles {
    button: IButtonStyles;
}
