import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import PowerBIWidget from './PowerBIWidget';
import { IPowerBIWidgetProps } from './PowerBIWidget.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PowerBIWidget',
    component: PowerBIWidget,
    decorators: [getDefaultStoryDecorator<IPowerBIWidgetProps>(wrapperStyle)]
};

type PowerBIWidgetStory = ComponentStory<typeof PowerBIWidget>;

const Template: PowerBIWidgetStory = (args) => {
    return <PowerBIWidget {...args} />;
};

export const Base = Template.bind({}) as PowerBIWidgetStory;
Base.args = {
    title: 'Storybook',
    reportId: 'Report1',
    pageName: 'Page1',
    visualName: 'visual1'
} as IPowerBIWidgetProps;
