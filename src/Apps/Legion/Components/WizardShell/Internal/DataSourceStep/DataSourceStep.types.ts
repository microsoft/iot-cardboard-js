import {
    IButtonStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';
import { ICookSource } from '../../../../Models/Types';
import { SourceType } from '../../../DataPusher/DataPusher.types';
import { IAppData } from '../../../../Models/Interfaces';

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
    selectedSourceType: SourceType;
    selectedSource: ICookSource;
    adapterResult: boolean;
    cookAssets: IAppData;
}

export enum DataSourceStepActionType {
    SET_SELECTED_SOURCE_TYPE = 'SET_SELECTED_SOURCE_TYPE',
    SET_SELECTED_SOURCE = 'SET_SELECTED_SOURCE',
    SET_ADAPTER_RESULT = 'SET_ADAPTER_RESULT',
    SET_COOK_ASSETS = 'SET_COOK_ASSETS'
}

export type DataSourceStepAction =
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE;
          sourceType: SourceType;
      }
    | {
          type: DataSourceStepActionType.SET_SELECTED_SOURCE;
          source: ICookSource;
      }
    | {
          type: DataSourceStepActionType.SET_ADAPTER_RESULT;
          adapterResult: boolean;
      }
    | {
          type: DataSourceStepActionType.SET_COOK_ASSETS;
          cookAssets: IAppData;
      };
