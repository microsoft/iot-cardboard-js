import {
    IButtonStyles,
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { MockAdapter } from '../../../Adapters';
import { IADTDataHistoryAdapter } from '../../../Models/Constants';
import { IExtendedTheme } from '../../../Theming/Theme.types';

export interface IDataHistoryExplorerModalControlProps {
    adapter: IADTDataHistoryAdapter | MockAdapter;
    /**
     * if isEnabled is provided, it will be prioritized over adapter's timeSeriesConnectionCache value to
     * decide how to show the data history modal control button like enabled or disabled
     */
    isEnabled?: boolean;
    initialTwinId?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataHistoryExplorerModalControlStyleProps,
        IDataHistoryExplorerModalControlStyles
    >;
}

export interface IDataHistoryExplorerModalControlStyleProps {
    theme: IExtendedTheme;
}
export interface IDataHistoryExplorerModalControlStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryExplorerModalControlSubComponentStyles;
}

export interface IDataHistoryExplorerModalControlSubComponentStyles {
    iconButton?: Partial<IButtonStyles>;
    spinner?: Partial<ISpinnerStyles>;
}
