import { IDropdownOption, IStyle } from '@fluentui/react';
import { IADXAdapterTargetContext } from '../../Models/Interfaces';
import { ITable } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ICookSource } from '../../Models';
import { PIDSourceUrls, PIDSources, SourceType } from '../../Models/Constants';

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

export const PIDSourceOptions: IDropdownOption[] = [
    {
        key: PIDSources.CoffeeRoastery,
        text: PIDSourceUrls.CoffeeRoastery
    },
    {
        key: PIDSources.WasteWater,
        text: PIDSourceUrls.WasteWater
    }
];
