import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ResourcePicker from './ResourcePicker';
import { IResourcePickerProps } from './ResourcePicker.types';
import { MockAdapter } from '../../Adapters';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    RequiredAccessRoleGroupForADTInstance,
    RequiredAccessRoleGroupForStorageAccount,
    RequiredAccessRoleGroupForStorageContainer
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
    requiredAccessRoles: RequiredAccessRoleGroupForADTInstance,
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
    requiredAccessRoles: RequiredAccessRoleGroupForStorageAccount,
    label: 'Storage accounts',
    displayField: AzureResourceDisplayFields.url
};

export const StorageContainers = Template.bind({}) as ResourcePickerStory;
StorageContainers.args = {
    resourceType: AzureResourceTypes.StorageBlobContainer,
    requiredAccessRoles: RequiredAccessRoleGroupForStorageContainer,
    label: 'Storage blob containers',
    displayField: AzureResourceDisplayFields.name
};

export const ADTInstancesWithError = Template.bind({}) as ResourcePickerStory;
ADTInstancesWithError.args = {
    resourceType: AzureResourceTypes.DigitalTwinInstance,
    requiredAccessRoles: RequiredAccessRoleGroupForADTInstance,
    label: 'ADT instances',
    displayField: AzureResourceDisplayFields.url,
    additionalOptions: [
        'https://example1.api.wcus.digitaltwins.azure.net',
        'https://example2.api.wus.digitaltwins.azure.net'
    ],
    selectedOption: 'https://example1.api.wcus.digitaltwins.azure.net',
    error: {
        message: 'Example error message',
        isSevere: false
    }
};

export const ADTInstancesWithSevereError = Template.bind(
    {}
) as ResourcePickerStory;
ADTInstancesWithSevereError.args = {
    resourceType: AzureResourceTypes.DigitalTwinInstance,
    requiredAccessRoles: RequiredAccessRoleGroupForADTInstance,
    label: 'ADT instances',
    displayField: AzureResourceDisplayFields.url,
    additionalOptions: [
        'https://example1.api.wcus.digitaltwins.azure.net',
        'https://example2.api.wus.digitaltwins.azure.net'
    ],
    selectedOption: 'https://example1.api.wcus.digitaltwins.azure.net',
    error: {
        message: 'Example severe error message',
        isSevere: true
    }
};
