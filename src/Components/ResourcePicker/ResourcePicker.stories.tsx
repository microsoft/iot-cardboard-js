import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ResourcePicker from './ResourcePicker';
import { IResourcePickerProps } from './ResourcePicker.types';
import { MockAdapter } from '../../Adapters';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    EnforcedADTAccessRoleIds,
    EnforcedStorageAccountAccessRoleIds,
    EnforcedStorageContainerAccessRoleIds,
    InterchangeableADTAccessRoleIds,
    InterchangeableStorageAccountAccessRoleIds,
    InterchangeableStorageContainerAccessRoleIds
} from '../../Models/Constants';

const wrapperStyle = { width: '400px', padding: 8 };

export default {
    title: 'Components/ResourcePicker/Mock',
    component: ResourcePicker,
    decorators: [getDefaultStoryDecorator<IResourcePickerProps>(wrapperStyle)]
};

type ResourcePickerStory = ComponentStory<typeof ResourcePicker>;

const Template: ResourcePickerStory = (args) => {
    return <ResourcePicker {...args} adapter={new MockAdapter()} />;
};

export const ADTInstances = Template.bind({}) as ResourcePickerStory;
ADTInstances.args = {
    resourceType: AzureResourceTypes.DigitalTwinInstance,
    requiredAccessRoles: {
        enforced: EnforcedADTAccessRoleIds,
        interchangeables: InterchangeableADTAccessRoleIds
    },
    label: 'ADT instances',
    displayField: AzureResourceDisplayFields.url,
    additionalOptions: [
        'https://example1.api.wcus.digitaltwins.azure.net',
        'https://example2.api.wus.digitaltwins.azure.net'
    ],
    selectedOption: 'https://example1.api.wcus.digitaltwins.azure.net'
};

export const StorageAccounts = Template.bind({}) as ResourcePickerStory;
StorageAccounts.args = {
    resourceType: AzureResourceTypes.StorageAccount,
    requiredAccessRoles: {
        enforced: EnforcedStorageAccountAccessRoleIds,
        interchangeables: InterchangeableStorageAccountAccessRoleIds
    },
    label: 'Storage accounts',
    displayField: AzureResourceDisplayFields.url
};

export const StorageContainers = Template.bind({}) as ResourcePickerStory;
StorageContainers.args = {
    resourceType: AzureResourceTypes.StorageBlobContainer,
    requiredAccessRoles: {
        enforced: EnforcedStorageContainerAccessRoleIds,
        interchangeables: InterchangeableStorageContainerAccessRoleIds
    },
    label: 'Storage blob containers',
    displayField: AzureResourceDisplayFields.name
};
