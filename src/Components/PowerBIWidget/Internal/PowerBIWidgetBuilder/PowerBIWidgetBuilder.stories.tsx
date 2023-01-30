import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PowerBIWidgetBuilder from './PowerBIWidgetBuilder';
import { IPowerBIWidgetBuilderProps } from './PowerBIWidgetBuilder.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PowerBIWidgetBuilder',
    component: PowerBIWidgetBuilder,
    decorators: [
        getDefaultStoryDecorator<IPowerBIWidgetBuilderProps>(wrapperStyle)
    ]
};

type PowerBIWidgetBuilderStory = ComponentStory<typeof PowerBIWidgetBuilder>;

const Template: PowerBIWidgetBuilderStory = (args) => {
    return <PowerBIWidgetBuilder {...args} />;
};

export const Base = Template.bind({}) as PowerBIWidgetBuilderStory;
Base.args = {} as IPowerBIWidgetBuilderProps;
