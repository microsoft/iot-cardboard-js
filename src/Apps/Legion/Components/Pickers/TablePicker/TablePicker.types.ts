import { IStyle } from '@fluentui/react';
import { IADXAdapterTargetContext } from '../../../Models/Interfaces';

export interface ITablePickerProps {
    databaseName: string;
    selectedTableName?: string;
    onTableNameChange?: (tableName: string) => void;
    targetAdapterContext?: React.Context<IADXAdapterTargetContext>;
    isDisabled?: boolean;
}

export interface ITablePickerStyles {
    root: IStyle;
}
