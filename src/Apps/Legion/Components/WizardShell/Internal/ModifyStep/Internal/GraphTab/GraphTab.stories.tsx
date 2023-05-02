import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import GraphTab from './GraphTab';
import { IGraphTabProps } from './GraphTab.types';
import { GraphContextProvider } from '../../../../../../Contexts/GraphContext/GraphContext';
import { WizardDataContextProvider } from '../../../../../../Contexts/WizardDataContext/WizardDataContext';
import { WizardNavigationContextProvider } from '../../../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA,
    DEFAULT_MOCK_GRAPH_PROVIDER_DATA
} from '../../../../WizardShellMockData';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/GraphTab',
    component: GraphTab,
    decorators: [getDefaultStoryDecorator<IGraphTabProps>(wrapperStyle)]
};

type GraphTabStory = ComponentStory<typeof GraphTab>;

const Template: GraphTabStory = (args) => {
    const dataContext = GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT();
    return (
        <WizardDataContextProvider initialState={dataContext}>
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <GraphContextProvider
                    {...DEFAULT_MOCK_GRAPH_PROVIDER_DATA}
                    initialState={{
                        ...DEFAULT_MOCK_GRAPH_PROVIDER_DATA.initialState,
                        isParentFormVisible: false,
                        selectedNodeIds: [
                            dataContext.entities[0].id,
                            dataContext.entities[1].id
                        ]
                    }}
                >
                    <GraphTab {...args} />
                </GraphContextProvider>
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as GraphTabStory;
Base.args = {} as IGraphTabProps;
