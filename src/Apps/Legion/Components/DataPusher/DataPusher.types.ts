import {
    IButtonStyles,
    IDropdownOption,
    IProcessedStyleSet,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import {
    IDataManagementAdapter,
    ITableColumn
} from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { IClusterPickerStyles } from '../Pickers/ClusterPicker/ClusterPicker.types';

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
    connection: IStyle;
    informationText: IStyle;
    tableContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataPusherSubComponentStyles;
}

export interface IDataPusherSubComponentStyles {
    clusterPicker?: IClusterPickerStyles;
    stack?: IStackStyles;
    button?: IButtonStyles;
    connectionString?: Partial<ITextFieldStyles>;
}

export interface IDataPusherContext {
    adapter: IDataManagementAdapter;
    classNames: IProcessedStyleSet<IDataPusherStyles>;
}

export const ID_COLUMN_NAME = 'ID';
export const TIMESTAMP_COLUMN_NAME = 'Timestamp';
export const PROPERTY_COLUMN_NAME = 'PropertyName';
export const VALUE_COLUMN_NAME = 'Value';

export const INGESTION_MAPPING_NAME = 'DataPusherMapping';

export enum TableTypes {
    Wide = 'Wide',
    Narrow = 'Narrow',
    Tags = 'Tags'
}

export const TableColumns: Record<TableTypes, Array<ITableColumn>> = {
    Wide: [
        { columnName: ID_COLUMN_NAME, columnDataType: 'string' },
        { columnName: TIMESTAMP_COLUMN_NAME, columnDataType: 'datetime' },
        { columnName: 'Temperature', columnDataType: 'real' },
        { columnName: 'Pressure', columnDataType: 'real' },
        { columnName: 'FanSpeed', columnDataType: 'real' },
        { columnName: 'FlowRate', columnDataType: 'real' }
    ],
    Narrow: [
        { columnName: ID_COLUMN_NAME, columnDataType: 'string' },
        { columnName: TIMESTAMP_COLUMN_NAME, columnDataType: 'datetime' },
        { columnName: PROPERTY_COLUMN_NAME, columnDataType: 'string' },
        { columnName: VALUE_COLUMN_NAME, columnDataType: 'dynamic' }
    ],
    Tags: [
        { columnName: ID_COLUMN_NAME, columnDataType: 'string' },
        { columnName: TIMESTAMP_COLUMN_NAME, columnDataType: 'datetime' },
        { columnName: VALUE_COLUMN_NAME, columnDataType: 'dynamic' }
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
