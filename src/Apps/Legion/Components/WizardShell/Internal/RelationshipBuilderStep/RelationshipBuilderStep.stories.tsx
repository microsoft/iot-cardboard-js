import React from 'react';
import { ComponentStory } from '@storybook/react';
import RelationshipBuilderStep from './RelationshipBuilderStep';
import { IRelationshipBuilderStepProps } from './RelationshipBuilderStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WizardDataManagementContextProvider } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell/RelationshipBuilderStep',
    component: RelationshipBuilderStep,
    decorators: [
        getDefaultStoryDecorator<IRelationshipBuilderStepProps>(wrapperStyle)
    ]
};

type RelationshipBuilderStepStory = ComponentStory<
    typeof RelationshipBuilderStep
>;

const Template: RelationshipBuilderStepStory = (args) => {
    return (
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <RelationshipBuilderStep {...args} />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const Base = Template.bind({}) as RelationshipBuilderStepStory;
Base.args = {} as IRelationshipBuilderStepProps;
