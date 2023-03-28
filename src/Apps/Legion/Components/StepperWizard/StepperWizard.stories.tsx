import React from 'react';
import { ComponentStory } from '@storybook/react';
import StepperWizard from './StepperWizard';
import {
    IStepperWizardProps,
    IStepperWizardStep,
    StepperWizardType
} from './StepperWizard.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';

const wrapperStyle = { width: 'fit-content', height: 'auto' };

export default {
    title: 'Components/Apps/Legion/StepperWizard',
    component: StepperWizard,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const steps: Array<IStepperWizardStep> = [
    {
        label: 'Step-1',
        onClick: () => {
            console.log('Step-1 clicked!');
        }
    },
    {
        label: 'Step-2',
        onClick: () => {
            console.log('Step-2 clicked!');
        }
    },
    {
        label: 'Step-3',
        onClick: () => {
            console.log('Step-3 clicked!');
        }
    }
];

type TemplateStory = ComponentStory<typeof StepperWizard>;
const Template: TemplateStory = (args: IStepperWizardProps) => (
    <WizardNavigationContextProvider
        initialState={{
            steps: steps,
            currentStep: 0
        }}
    >
        <StepperWizard {...args} />
    </WizardNavigationContextProvider>
);

const horizontalProps: IStepperWizardProps = {
    type: StepperWizardType.Horizontal,
    steps: steps,
    currentStepIndex: 0
};
export const HorizontalStepperWizard = Template.bind({}) as TemplateStory;
HorizontalStepperWizard.args = horizontalProps;

const verticalProps: IStepperWizardProps = {
    type: StepperWizardType.Vertical,
    steps: steps,
    currentStepIndex: 1,
    includeIcons: true
};
export const VerticalStepperWizardWithIcons = Template.bind(
    {}
) as TemplateStory;
VerticalStepperWizardWithIcons.args = verticalProps;

const allFinishedProps: IStepperWizardProps = {
    type: StepperWizardType.Vertical,
    steps: steps,
    currentStepIndex: 2,
    includeIcons: true,
    isAllCompletedSuccessfully: true,
    isNavigationDisabled: true
};
export const VerticalAllFinishedSuccessfully = Template.bind(
    {}
) as TemplateStory;
VerticalAllFinishedSuccessfully.args = allFinishedProps;

const currentStepWarningProps: IStepperWizardProps = {
    type: StepperWizardType.Horizontal,
    steps: steps,
    currentStepIndex: 1,
    includeIcons: true,
    isNavigationDisabled: true,
    isCurrentStepWithWarning: true
};
export const HorizontalCurrentStepWarning = Template.bind({}) as TemplateStory;
HorizontalCurrentStepWarning.args = currentStepWarningProps;
