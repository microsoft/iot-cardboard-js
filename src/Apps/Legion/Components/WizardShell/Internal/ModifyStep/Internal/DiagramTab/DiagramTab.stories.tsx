import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import DiagramTab from './DiagramTab';
import { IDiagramTabProps } from './DiagramTab.types';
import { WizardDataContextProvider } from '../../../../../../Contexts/WizardDataContext/WizardDataContext';
import { WizardNavigationContextProvider } from '../../../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../../../WizardShellMockData';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/ModifyStep/DiagramTab',
    component: DiagramTab,
    decorators: [getDefaultStoryDecorator<IDiagramTabProps>(wrapperStyle)]
};

type DiagramTabStory = ComponentStory<typeof DiagramTab>;

const Template: DiagramTabStory = (args) => {
    const dataContext = GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT();
    return (
        <WizardDataContextProvider initialState={dataContext}>
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <DiagramTab {...args} />
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as DiagramTabStory;
Base.args = {} as IDiagramTabProps;
