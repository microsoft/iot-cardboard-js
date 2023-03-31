import {
    IDropdownOption,
    IProcessedStyleSet,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import {
    IDataManagementAdapter,
    ITableColumn,
    TIMESTAMP_COLUMN_NAME
} from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

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
    informationText: IStyle;
    tableContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataPusherSubComponentStyles;
}

export interface IDataPusherSubComponentStyles {
    stack?: IStackStyles;
}

export interface IDataPusherContext {
    adapter: IDataManagementAdapter;
    classNames: IProcessedStyleSet<IDataPusherStyles>;
}

export enum TableTypes {
    Wide = 'Wide',
    Narrow = 'Narrow',
    Tags = 'Tags'
}

export const TableColumns: Record<TableTypes, Array<ITableColumn>> = {
    Wide: [
        { column: 'ID', dataType: 'string' },
        { column: TIMESTAMP_COLUMN_NAME, dataType: 'datetime' },
        { column: 'Temperature', dataType: 'real' },
        { column: 'Pressure', dataType: 'real' },
        { column: 'FanSpeed', dataType: 'real' },
        { column: 'FlowRate', dataType: 'real' }
    ],
    Narrow: [
        { column: 'ID', dataType: 'string' },
        { column: TIMESTAMP_COLUMN_NAME, dataType: 'datetime' },
        { column: 'PropertyName', dataType: 'string' }
    ],
    Tags: [
        { column: 'ID', dataType: 'string' },
        { column: TIMESTAMP_COLUMN_NAME, dataType: 'datetime' },
        { column: 'Value', dataType: 'dynamic' }
    ]
};

export const TableTypeOptions: IDropdownOption[] = [
    {
        key: TableTypes.Wide,
        text: 'Dairy Facility (Wide)'
    },
    {
        key: TableTypes.Narrow,
        text: 'Dairy Facility (Narrow)'
    },
    {
        key: TableTypes.Tags,
        text: 'Tags only'
    }
];

export interface IReactSelectOption {
    value: string;
    label: string;
    __isNew__?: boolean;
}
