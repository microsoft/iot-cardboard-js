import {
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
    errorMessage?: string;
    styles?: IStyleFunctionOrObject<
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >;
}

export interface IResourceOption {
    label: string;
    value?: IAzureResource | string;
    options?: Array<IResourceOption>; // if there are options array it means this options is header for grouped options
}

export interface IResourcePickerStyleProps {
    theme: ITheme;
}
export interface IResourcePickerStyles {
    root: IStyle;
    optionWrapper: IStyle;
    optionText: IStyle;
    optionHeaderText: IStyle;
    noMatchingOptionText: IStyle;
    labelContainer: IStyle;
    label: IStyle;
    errorText: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IResourcePickerSubComponentStyles;
}

export interface IResourcePickerSubComponentStyles {
    errorMessageBar: IMessageBarStyles;
}
