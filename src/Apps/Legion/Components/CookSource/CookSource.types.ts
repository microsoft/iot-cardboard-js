import { IStyle } from '@fluentui/react';
import { IADXAdapterTargetContext } from '../../Models/Interfaces';
import { SourceType } from '../DataPusher/DataPusher.types';
import { ITable } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ICookSource } from '../../Models';

export interface ICookSourceProps {
    onSourceTypeChange: (sourceType: SourceType) => void;
    onSourceChange: (source: ICookSource) => void;
    onGetTableData?: (table: ITable) => void;
    targetAdapterContext?: React.Context<IADXAdapterTargetContext>;
    isClusterVisible?: boolean;
}

export interface ICookSourceStyles {
    root: IStyle;
}
