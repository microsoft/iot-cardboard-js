import { IButtonStyles, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import MockAdapter from '../../Adapters/MockAdapter';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { IPropertyInspectorCalloutStyles } from '../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout.types';
import { ITwinPropertySearchDropdownStyles } from '../TwinPropertySearchDropdown/TwinPropertySearchDropdown.types';

export interface ITwinSearchProps {
    adapter: IADTAdapter | MockAdapter;
    onSelectTwinId: (selectedTwinId: string) => void;
    initialSelectedValue?: string;
    isInspectorDisabled: boolean;
    twinId: string;
    disableDropdownDescription?: boolean;
    dropdownDescription?: string;
    dropdownLabel?: string;
    dropdownLabelIconName?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<ITwinSearchStyleProps, ITwinSearchStyles>;
}

export interface ITwinSearchStyleProps {
    theme: ITheme;
}
export interface ITwinSearchStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinSearchSubComponentStyles;
}

export interface ITwinSearchSubComponentStyles {
    twinPropertySearchDropdown?: Partial<ITwinPropertySearchDropdownStyles>;
    propertyInspector?: Partial<IPropertyInspectorCalloutStyles>;
    advancedSearchButton?: Partial<IButtonStyles>;
}
