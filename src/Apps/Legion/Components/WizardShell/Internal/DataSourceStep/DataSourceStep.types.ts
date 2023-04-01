import {
    IButtonStyles,
    IDropdownOption,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';
import {
    IDataManagementAdapter,
    ITable
} from '../../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ICookAssets } from '../../../../Models/Interfaces';
import { IReactSelectOption } from '../../../DataPusher/DataPusher.types';

export interface IDataSourceStepProps {
    adapter: IDataManagementAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataSourceStepStyleProps,
        IDataSourceStepStyles
    >;
}

export interface IDataSourceStepStyleProps {
    theme: IExtendedTheme;
}
export interface IDataSourceStepStyles {
    root: IStyle;
    informationText: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataSourceStepSubComponentStyles;
}

export interface IDataSourceStepSubComponentStyles {
    stack?: IStackStyles;
    button?: Partial<IButtonStyles>;
}

export interface IDataSourceStepState {
    sourceDatabaseOptions: Array<IDropdownOption>;
    targetDatabaseOptions: Array<IReactSelectOption>;
    sourceTableOptions: Array<IDropdownOption>;
    sourceTableColumnOptions: Array<IDropdownOption>;
    selectedSourceDatabase: string;
    selectedTargetDatabase: IReactSelectOption;
    selectedSourceTable: string;
    selectedSourceTwinIDColumn: string;
    selectedSourceTableType: string;
    sourceTableData: ITable;
    adapterResult: boolean;
    cookAssets: ICookAssets;
}

export enum DataSourceStepActionType {
    SET_SOURCE_DATABASE_OPTIONS = 'SET_SOURCE_DATABASE_OPTIONS',
    SET_TARGET_DATABASE_OPTIONS = 'SET_TARGET_DATABASE_OPTIONS',
    SET_SOURCE_TABLE_OPTIONS = 'SET_SOURCE_TABLE_OPTIONS',
    SET_SOURCE_TABLE_DATA = 'SET_SOURCE_TABLE_DATA',
    SET_SELECTED_SOURCE_DATABASE = 'SET_SELECTED_SOURCE_DATABASE',
    SET_SELECTED_TARGET_DATABASE = 'SET_SELECTED_TARGET_DATABASE',
    SET_SELECTED_SOURCE_TABLE = 'SET_SELECTED_SOURCE_TABLE',
    SET_SELECTED_SOURCE_TWIN_ID_COLUMN = 'SET_SELECTED_SOURCE_TWIN_ID_COLUMN',
    SET_SELECTED_SOURCE_TABLE_TYPE = 'SET_SELECTED_SOURCE_TABLE_TYPE',
    SET_ADAPTER_RESULT = 'SET_ADAPTER_RESULT',
    SET_COOK_ASSETS = 'SET_COOK_ASSETS'
}

export type DataSourceStepAction =
    | {
          type: DataSourceStepActionType.SET_SOURCE_DATABASE_OPTIONS;
          options: Array<IDropdownOption>;
      }
    | {
          type: DataSourceStepActionType.SET_TARGET_DATABASE_OPTIONS;
          options: Array<IReactSelectOption>;
      }
    | {
          type: DataSourceStepActionType.SET_SOURCE_TABLE_OPTIONS;
          options: Array<IDropdownOption>;
      }
    | {
          type: DataSourceStepActionType.SET_SOURCE_TABLE_DATA;
          tableData: ITable;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE;
          database: string;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_TARGET_DATABASE;
          database: IReactSelectOption;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE;
          table: string;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_TWIN_ID_COLUMN;
          columnName: string;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE_TYPE;
          tableType: string;
      }
    | {
          type: DataSourceStepActionType.SET_ADAPTER_RESULT;
          adapterResult: boolean;
      }
    | {
          type: DataSourceStepActionType.SET_COOK_ASSETS;
          cookAssets: ICookAssets;
      };