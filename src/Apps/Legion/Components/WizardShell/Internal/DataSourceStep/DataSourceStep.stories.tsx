import React from 'react';
import { ComponentStory } from '@storybook/react';
import DataSourceStep from './DataSourceStep';
import { IDataSourceStepProps } from './DataSourceStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';
import { WizardDataContextProvider } from '../../../../Contexts/WizardDataContext/WizardDataContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/DataSourceStep',
    component: DataSourceStep,
    decorators: [getDefaultStoryDecorator<IDataSourceStepProps>(wrapperStyle)]
};

type DataSourceStepStory = ComponentStory<typeof DataSourceStep>;

const Template: DataSourceStepStory = (args) => {
    return (
        <WizardDataContextProvider
            initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <DataSourceStep {...args} />
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Mock = Template.bind({}) as DataSourceStepStory;
Mock.args = {} as IDataSourceStepProps;
