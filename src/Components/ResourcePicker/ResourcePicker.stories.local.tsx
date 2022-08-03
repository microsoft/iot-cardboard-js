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
            {...(args.resourceType ===
                AzureResourceTypes.StorageBlobContainer && {
                searchParams: {
                    ...args.searchParams,
                    additionalParams: {
                        storageAccountId:
                            authenticationParameters.storage.accountId
                    }
                }
            })}
        />
    );
};

export const ADTInstances = Template.bind({}) as ResourcePickerStory;
ADTInstances.args = {
    resourceType: AzureResourceTypes.DigitalTwinInstance,
    requiredAccessRoles: {
        enforcedRoleIds: [],
        interchangeableRoleIds: [
            AzureAccessPermissionRoles['Azure Digital Twins Data Owner'],
            AzureAccessPermissionRoles['Azure Digital Twins Data Reader']
        ]
    },
    label: 'ADT instances',
    displayField: AzureResourceDisplayFields.url,
    additionalOptions: [
        'https://example1.api.wcus.digitaltwins.azure.net',
        'https://example2.api.wus.digitaltwins.azure.net'
    ],
    selectedOption: 'https://example1.api.wcus.digitaltwins.azure.net',
    onChange: (resource) => {
        console.log(typeof resource === 'string' ? resource : resource?.id);
    },
    searchParams: { take: 500, filter: 'demo' },
    allowFreeform: true
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
    displayField: AzureResourceDisplayFields.name
};
