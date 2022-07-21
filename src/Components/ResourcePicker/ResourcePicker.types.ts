import {
    IComboBoxStyles,
    IMessageBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Models/Constants/Enums';
import {
    IAzureManagementAdapter,
    IAzureResource,
    IAzureResourceSearchParams
} from '../../Models/Constants/Interfaces';

export interface IResourcePickerProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >;
    adapter: IAzureManagementAdapter | MockAdapter;
    resourceType: AzureResourceTypes;
    requiredAccessRoles: {
        enforcedRoleIds: Array<AzureAccessPermissionRoles>; // roles that have to exist
        interchangeableRoleIds: Array<AzureAccessPermissionRoles>; // roles that one or the other has to exist
    };
    shouldFetchResourcesOnMount?: boolean;
    displayField: AzureResourceDisplayFields; // which resource property to show as option text in the combobox
    label?: string;
    loadingLabel?: string;
    searchParams?: IAzureResourceSearchParams;
    onResourcesLoaded?: (resources: Array<IAzureResource>) => void; // callback function to expose resources when they are fetched with useAdapter method on mount
    onResourceChange?: (
        resource: IAzureResource | string,
        resources?: Array<IAzureResource | string>
    ) => void; // callback function to expose the selected resource and optionally list of resources in dropdown when it is changed in the combobox
    additionalOptions?: Array<string>; // options that are entered by user which doesn't exist in the options list yet
    selectedOption?: string;
    allowFreeform?: boolean; // whether the ComboBox allows freeform user input, rather than restricting to the options of data fetch
    disabled?: boolean;
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
