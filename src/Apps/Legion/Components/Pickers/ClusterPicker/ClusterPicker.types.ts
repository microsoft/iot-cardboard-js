import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../Theming/Theme.types';

export interface IClusterPickerProps {
    selectedClusterUrl?: string;
    onClusterUrlChange?: (clusterUrl: string, isNew?: boolean) => void;
    targetAdapterContext?: React.Context<any>;
    label?: string;
    placeholder?: string;
    hasTooltip?: boolean;
    isCreatable?: boolean;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IClusterPickerStyleProps,
        IClusterPickerStyles
    >;
}

export interface IClusterPickerStyleProps {
    theme: IExtendedTheme;
}
export interface IClusterPickerStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IClusterPickerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IClusterPickerSubComponentStyles {}