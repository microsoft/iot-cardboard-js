import { IStyle } from '@fluentui/react';
import {
    IADXAdapterTargetContext,
    IADXConnection,
    IPIDDocument
} from '../../Models/Interfaces';
import { SourceType } from '../DataPusher/DataPusher.types';
import { ITable } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

export interface ICookSourceProps {
    onSourceTypeChange: (sourceType: SourceType) => void;
    onSourceChange: (source: IADXConnection | IPIDDocument) => void;
    onGetTableData?: (table: ITable) => void;
    targetAdapterContext?: React.Context<IADXAdapterTargetContext>;
    isClusterVisible?: boolean;
}

export interface ICookSourceStyles {
    root: IStyle;
}
