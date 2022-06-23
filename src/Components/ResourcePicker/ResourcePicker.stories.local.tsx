import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ResourcePicker from './ResourcePicker';
import { IResourcePickerProps } from './ResourcePicker.types';
import { AzureManagementAdapter } from '../../Adapters';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import useAuthParams from '../../../.storybook/useAuthParams';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../Models/Constants';

const wrapperStyle = { width: '400px', padding: 8 };

export default {
    title: 'Components/ResourcePicker',
    component: ResourcePicker,
    decorators: [getDefaultStoryDecorator<IResourcePickerProps>(wrapperStyle)]
    // argTypes: {
    //     resourceType: {
    //         options: [...Object.values(AzureResourceTypes)],
    //         control: {
    //             type: 'select'
    //         }
    //     }
    //     //     //     // requiredAccessRoles: {
    //     //     //     //     table: { expanded: true },
    //     //     //     //     enforcedRoleIds: {
    //     //     //     //         options: ['none', ...Object.keys(AzureAccessPermissionRoles)],
    //     //     //     //         mapping: AzureAccessPermissionRoles,
    //     //     //     //         control: {
    //     //     //     //             type: 'multi-select'
    //     //     //     //         },
    //     //     //     //         description: 'Enforced access roles (all of them have to exist)'
    //     //     //     //     },
    //     //     //     //     interchangeableRoleIds: {
    //     //     //     //         options: ['none', ...Object.keys(AzureAccessPermissionRoles)],
    //     //     //     //         mapping: AzureAccessPermissionRoles,
    //     //     //     //         control: {
    //     //     //     //             type: 'multi-select'
    //     //     //     //         },
    //     //     //     //         description:
    //     //     //     //             'Interchangeable access roles (one of them has to exist)'
    //     //     //     //     }
    //     //     //     // }
    // }
};

type ResourcePickerStory = ComponentStory<typeof ResourcePicker>;

const Template: ResourcePickerStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ResourcePicker
            {...args}
            adapter={
                new AzureManagementAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.aadParameters.tenantId,
                    authenticationParameters.adt.aadParameters.uniqueObjectId
                )
            }
        />
    );
};

export const ADTInstances = Template.bind({}) as ResourcePickerStory;
ADTInstances.args = {
    resourceType: AzureResourceTypes.DigitalTwinInstance,
    requiredAccessRoles: {
        enforcedRoleIds: [],
        interchangeableRoleIds: [
            AzureAccessPermissionRoles['Azure Digital Twins Data Owner']
        ]
    },
    label: 'ADT instances',
    displayField: AzureResourceDisplayFields.url
};

export const StorageAccounts = Template.bind({}) as ResourcePickerStory;
StorageAccounts.args = {
    resourceType: AzureResourceTypes.StorageAccount,
    requiredAccessRoles: {
        enforcedRoleIds: [],
        interchangeableRoleIds: [
            AzureAccessPermissionRoles['Contributor'],
            AzureAccessPermissionRoles['Owner']
        ]
    },
    label: 'Storage accounts',
    displayField: AzureResourceDisplayFields.url
};

export const StorageContainers = Template.bind({}) as ResourcePickerStory;
StorageContainers.args = {
    resourceType: AzureResourceTypes.StorageBlobContainer,
    requiredAccessRoles: {
        enforcedRoleIds: [AzureAccessPermissionRoles['Reader']],
        interchangeableRoleIds: [
            AzureAccessPermissionRoles['Storage Blob Data Owner'],
            AzureAccessPermissionRoles['Storage Blob Data Contributor']
        ]
    },
    label: 'Storage blob containers',
    displayField: AzureResourceDisplayFields.name,
    additionalResourceSearchParams: {
        storageAccountId:
            '/subscriptions/03bfb10e-02db-4324-a765-abd39aaf1e6d/resourceGroups/adtexplorer-dev-assets/providers/Microsoft.Storage/storageAccounts/cardboardresources'
    }
};
