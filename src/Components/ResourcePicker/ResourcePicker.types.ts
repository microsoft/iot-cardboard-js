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
        resources?: Array<IAzureResource | string>,
        inputError?: string // to expose internal input error
    ) => void; // callback function to expose the selected resource and optionally list of resources in dropdown when it is changed in the combobox
    onLoaded?: (resources: Array<IAzureResource>) => void; // callback function to expose resources when they are fetched with useAdapter method on mount
    resourceType: AzureResourceTypes;
    requiredAccessRoles: AzureAccessPermissionRoleGroups;
    searchParams?: AzureResourceSearchParams;
    selectedOption?: string;
    shouldFetchResourcesOnMount?: boolean;
    error?: ResourcePickerError;
    styles?: IStyleFunctionOrObject<
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >;
}

interface IResourceBaseOption {
    label: string;
}

interface IResourceHeaderOption extends IResourceBaseOption {
    type: 'header';
}
export interface IResourceOption extends IResourceBaseOption {
    value: IAzureResource | string;
    type: 'option';
}

export type IResourcePickerOption = IResourceHeaderOption | IResourceOption;

export const isResourceOption = (
    option: IResourceHeaderOption | IResourceOption
) => {
    return (option as IResourceOption).type === 'option';
};

export type ResourcePickerError = {
    message: string;
    isCatastrophic: boolean;
    isInternal?: boolean;
};

export interface IResourcePickerStyleProps {
    theme: ITheme;
}
export interface IResourcePickerStyles {
    root: IStyle;
    menuList: IStyle;
    optionWrapper: IStyle;
    optionText: IStyle;
    optionHeaderText: IStyle;
    noMatchingOptionText: IStyle;
    labelContainer: IStyle;
    label: IStyle;
    errorText: IStyle;
    warningText: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IResourcePickerSubComponentStyles;
}

export interface IResourcePickerSubComponentStyles {
    errorMessageBar: IMessageBarStyles;
}
