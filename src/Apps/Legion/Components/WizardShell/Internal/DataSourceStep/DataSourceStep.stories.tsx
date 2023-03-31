import React from 'react';
import { ComponentStory } from '@storybook/react';
import DataSourceStep from './DataSourceStep';
import { IDataSourceStepProps } from './DataSourceStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import MockDataManagementAdapter from '../../../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell/DataSourceStep',
    component: DataSourceStep,
    decorators: [getDefaultStoryDecorator<IDataSourceStepProps>(wrapperStyle)]
};

type DataSourceStepStory = ComponentStory<typeof DataSourceStep>;

const Template: DataSourceStepStory = (args) => {
    return <DataSourceStep {...args} />;
};

export const Mock = Template.bind({}) as DataSourceStepStory;
Mock.args = {
    adapter: new MockDataManagementAdapter()
} as IDataSourceStepProps;
