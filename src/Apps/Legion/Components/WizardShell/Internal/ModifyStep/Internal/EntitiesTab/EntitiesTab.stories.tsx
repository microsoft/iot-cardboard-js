import React from 'react';
import { ComponentStory } from '@storybook/react';
import EntitiesTab from './EntitiesTab';
import { IEntitiesTabProps } from './EntitiesTab.types';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import { GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT } from '../../../../WizardShellMockData';
import { WizardDataContextProvider } from '../../../../../../Contexts/WizardDataContext/WizardDataContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/ModifyStep/EntitiesTab',
    component: EntitiesTab,
    decorators: [getDefaultStoryDecorator<IEntitiesTabProps>(wrapperStyle)]
};

type EntitiesTabStory = ComponentStory<typeof EntitiesTab>;

const Template: EntitiesTabStory = (args) => {
    return (
        <WizardDataContextProvider
            initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
        >
            <EntitiesTab {...args} />;
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as EntitiesTabStory;
Base.args = {} as IEntitiesTabProps;
