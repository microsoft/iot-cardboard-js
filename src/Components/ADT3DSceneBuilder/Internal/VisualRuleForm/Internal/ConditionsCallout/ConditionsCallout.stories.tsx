import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import ConditionsCallout from './ConditionsCallout';
import { IConditionsCalloutProps } from './ConditionsCallout.types';
import { getDefaultCondition } from '../../../../../../Models/Classes/3DVConfig';
import { CalloutInfoType } from '../ConditionsList.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ConditionsCallout',
    component: ConditionsCallout,
    decorators: [
        getDefaultStoryDecorator<IConditionsCalloutProps>(wrapperStyle)
    ]
};

type ConditionsCalloutStory = ComponentStory<typeof ConditionsCallout>;

const Template: ConditionsCalloutStory = (args) => {
    return <ConditionsCallout {...args} />;
};

export const Numerical = Template.bind({}) as ConditionsCalloutStory;
const integerCondition = getDefaultCondition('integer');
Numerical.args = {
    calloutType: CalloutInfoType.create,
    onDismiss: () => {
        return;
    },
    onSave: (_condition) => {
        return;
    },
    target: '',
    valueRange: integerCondition,
    valueRangeType: 'integer'
} as IConditionsCalloutProps;

export const Boolean = Template.bind({}) as ConditionsCalloutStory;
const booleanCondition = getDefaultCondition('boolean');
Boolean.args = {
    calloutType: CalloutInfoType.create,
    onDismiss: () => {
        return;
    },
    onSave: (_condition) => {
        return;
    },
    target: '',
    valueRange: booleanCondition,
    valueRangeType: 'boolean'
} as IConditionsCalloutProps;

export const String = Template.bind({}) as ConditionsCalloutStory;
const stringCondition = getDefaultCondition('string');
String.args = {
    calloutType: CalloutInfoType.create,
    onDismiss: () => {
        return;
    },
    onSave: (_condition) => {
        return;
    },
    target: '',
    valueRange: stringCondition,
    valueRangeType: 'string'
} as IConditionsCalloutProps;
