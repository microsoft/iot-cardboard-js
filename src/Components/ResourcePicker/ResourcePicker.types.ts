import {
    IComboBoxStyles,
    IMessageBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import {
    AzureAccessPermissionRoleGroups,
    AzureResourceSearchParams
} from '../../Models/Constants';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Models/Constants/Enums';
import {
    IAzureManagementAdapter,
    IAzureResource
} from '../../Models/Constants/Interfaces';

export interface IResourcePickerProps {
    adapter: IAzureManagementAdapter | MockAdapter;
    additionalOptions?: Array<string>; // options that are entered by user which doesn't exist in the options list yet
    allowFreeform?: boolean; // whether the ComboBox allows freeform user input, rather than restricting to the options of data fetch
    disabled?: boolean;
    displayField: AzureResourceDisplayFields; // which resource property to show as option text in the combobox
    label?: string;
    loadingLabel?: string;
    onChange?: (
        resource: IAzureResource | string,
        resources?: Array<IAzureResource | string>
    ) => void; // callback function to expose the selected resource and optionally list of resources in dropdown when it is changed in the combobox
    onLoaded?: (resources: Array<IAzureResource>) => void; // callback function to expose resources when they are fetched with useAdapter method on mount
    resourceType: AzureResourceTypes;
    requiredAccessRoles: AzureAccessPermissionRoleGroups;
    searchParams?: AzureResourceSearchParams;
    selectedOption?: string;
    shouldFetchResourcesOnMount?: boolean;
    styles?: IStyleFunctionOrObject<
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >;
}

export interface IResourcePickerStyleProps {
    theme: ITheme;
}
export interface IResourcePickerStyles {
    root: IStyle;
    comboBoxOptionWrapper: IStyle;
    comboBoxOptionText: IStyle;
    labelContainer: IStyle;
    label: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IResourcePickerSubComponentStyles;
}

export interface IResourcePickerSubComponentStyles {
    errorMessageBar: IMessageBarStyles;
    comboBox: Partial<IComboBoxStyles>;
}
