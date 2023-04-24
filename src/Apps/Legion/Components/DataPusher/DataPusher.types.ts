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
import { IModel, ITwin } from '../../Models/Interfaces';
import { IClusterPickerStyles } from '../Pickers/ClusterPicker/ClusterPicker.types';
import { IADXAdapterTargetContext, IReactSelectOption } from '../../Models';

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

export interface IDataPusherContext extends IADXAdapterTargetContext {
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

export enum SourceType {
    Timeseries = 'Timeseries table',
    Diagram = 'P&ID diagram'
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

export const TableTypeOptions: IReactSelectOption[] = [
    {
        value: TableTypes.Wide,
        label: 'Dairy Facility (Wide)'
    },
    {
        value: TableTypes.Narrow,
        label: 'Dairy Facility (Narrow)'
    },
    {
        value: TableTypes.Tags,
        label: 'Tags only'
    }
];

// Temporary types - will clear when data pusher is updated to new data patterns
export interface IModelExtended extends IModel {
    color: string;
    selectedPropertyIds: Array<string>;
}

export interface ITwinExtended extends ITwin {
    model: IModelExtended;
    isSelected: boolean;
}

export const SourceTypeOptions: IDropdownOption[] = [
    {
        key: SourceType.Timeseries,
        text: SourceType.Timeseries
    },
    {
        key: SourceType.Diagram,
        text: SourceType.Diagram
    }
];
