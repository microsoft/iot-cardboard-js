import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Models/Constants/Enums';
import { IAzureManagementAdapter } from '../../Models/Constants/Interfaces';

export interface IResourcePickerProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >;
    adapter: IAzureManagementAdapter;
    resourceType: AzureResourceTypes;
    requiredAccessRoles: {
        enforcedRoleIds: Array<AzureAccessPermissionRoles>; // roles that have to exist
        interchangeableRoleIds: Array<AzureAccessPermissionRoles>; // roles that one or the other has to exist
    };
    displayField: AzureResourceDisplayFields;
    label?: string;
    loadingLabel?: string;
    additionalResourceSearchParams?: {
        storageAccountId?: string;
        [key: string]: any;
    }; //for resource specific params for fetching gerReources (e.g storageAccountId for fetching StorageBlobContainer resource type)
}

export interface IResourcePickerStyleProps {
    theme: ITheme;
}
export interface IResourcePickerStyles {
    root: IStyle;
    labelContainer: IStyle;
    label: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IResourcePickerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcePickerSubComponentStyles {}
