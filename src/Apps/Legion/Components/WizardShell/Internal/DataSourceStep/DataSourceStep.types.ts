import {
    IButtonStyles,
    IDropdownOption,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';
import { ITable } from '../../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { IAppData, IReactSelectOption } from '../../../../Models/Interfaces';
import { SourceType } from '../../../DataPusher/DataPusher.types';

export interface IDataSourceStepProps {
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
    selectedSourceType: SourceType;
    selectedSourceCluster: string;
    selectedSourceDatabase: string;
    selectedSourceTable: string;
    selectedSourceTwinIDColumn: string;
    selectedSourceTableType: string;
    sourceTableData: ITable;
    adapterResult: boolean;
    cookAssets: IAppData;
}

export enum DataSourceStepActionType {
    SET_SOURCE_DATABASE_OPTIONS = 'SET_SOURCE_DATABASE_OPTIONS',
    SET_TARGET_DATABASE_OPTIONS = 'SET_TARGET_DATABASE_OPTIONS',
    SET_SOURCE_TABLE_OPTIONS = 'SET_SOURCE_TABLE_OPTIONS',
    SET_SOURCE_TABLE_DATA = 'SET_SOURCE_TABLE_DATA',
    SET_SELECTED_SOURCE_TYPE = 'SET_SELECTED_SOURCE_TYPE',
    SET_SELECTED_SOURCE_CLUSTER = 'SET_SELECTED_SOURCE_CLUSTER',
    SET_SELECTED_SOURCE_DATABASE = 'SET_SELECTED_SOURCE_DATABASE',
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
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE;
          sourceType: SourceType;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_CLUSTER;
          clusterUrl: string;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE;
          database: string;
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
          cookAssets: IAppData;
      };
