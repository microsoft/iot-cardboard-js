import React from 'react';
import { ComponentStory } from '@storybook/react';
import RelationshipBuilderStep from './RelationshipBuilderStep';
import { IRelationshipBuilderStepProps } from './RelationshipBuilderStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { stepData, steps } from '../../WizardShellMockData';
import { WizardNavigationContextProvider } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';

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
        <WizardNavigationContextProvider
            initialState={{
                steps: steps,
                currentStep: 0,
                stepData: stepData
            }}
        >
            <RelationshipBuilderStep {...args} />
        </WizardNavigationContextProvider>
    );
};

export const Base = Template.bind({}) as RelationshipBuilderStepStory;
Base.args = {} as IRelationshipBuilderStepProps;
