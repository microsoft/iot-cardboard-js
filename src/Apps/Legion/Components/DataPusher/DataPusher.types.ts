import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IDataManagementAdapter } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

export interface IDataPusherProps {
    adapter: IDataManagementAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IDataPusherStyleProps, IDataPusherStyles>;
}

export interface IDataPusherStyleProps {
    theme: IExtendedTheme;
}
export interface IDataPusherStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataPusherSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDataPusherSubComponentStyles {}

export enum DataFetchType {
    'database',
    'table',
    'row'
}
