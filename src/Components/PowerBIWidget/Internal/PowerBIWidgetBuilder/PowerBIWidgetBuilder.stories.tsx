import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PowerBIWidgetBuilder from './PowerBIWidgetBuilder';
import { IPowerBIWidgetBuilderProps } from './PowerBIWidgetBuilder.types';
import MockAdapter from '../../../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/PowerBIWidgetBuilder',
    component: PowerBIWidgetBuilder,
    decorators: [
        getDefaultStoryDecorator<IPowerBIWidgetBuilderProps>(wrapperStyle)
    ]
};

type PowerBIWidgetBuilderStory = ComponentStory<typeof PowerBIWidgetBuilder>;

const defaultState = {
    id: 'mywidget',
    type: 'PowerBI',
    widgetConfiguration: {
        type: 'tile',
        label: '',
        reportId: ''
    }
};

const Template: PowerBIWidgetBuilderStory = (args) => {
    const [formData, updateWidgetData] = useState(
        args.formData || defaultState
    );
    return (
        <>
            <PowerBIWidgetBuilder
                formData={formData}
                updateWidgetData={updateWidgetData}
                {...args}
            />
        </>
    );
};

export const WithMockAdapter = Template.bind(
    {},
    {
        adapter: new MockAdapter()
    }
) as PowerBIWidgetBuilderStory;

export const MissingAdapter = Template.bind(
    {},
    {
        adapter: undefined
    }
) as PowerBIWidgetBuilderStory;

export const MissingConfiguration = Template.bind(
    {},
    {
        adapter: new MockAdapter(),
        formData: { id: ' mywidget', type: 'PowerBI' }
    }
) as PowerBIWidgetBuilderStory;
