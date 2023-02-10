import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DtdlInterface } from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IVersion3UpgradeButtonProps {
    selectedModel: DtdlInterface;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVersion3UpgradeButtonSubComponentStyles {}
