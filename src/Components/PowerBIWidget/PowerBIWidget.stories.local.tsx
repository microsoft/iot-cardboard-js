import React from 'react';
import PowerBIWidget from './PowerBIWidget';
import { IPowerBIWidgetProps } from './PowerBIWidget.types';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import useAuthParams from '../../../.storybook/useAuthParams';
const wrapperStyle = { width: '100%', height: '500px' };

export default {
    title: 'Components/PowerBIWidget',
    component: PowerBIWidget,
    decorators: [getDefaultStoryDecorator<IPowerBIWidgetProps>(wrapperStyle)]
};

export const PowerBIAdapter = (args) => {
    const authenticationParameters = useAuthParams();
    if (!authenticationParameters?.powerBI?.embedUrl) {
        return <div>Missing PowerBI information in user secrets</div>;
    }
    return (
        <PowerBIWidget
            widget={{
                type: 'PowerBI',
                id: 'mywidget',
                widgetConfiguration: {
                    type: 'tile',
                    displayName: 'My Widget',
                    embedUrl: authenticationParameters?.powerBI?.embedUrl,
                    pageName: authenticationParameters?.powerBI?.pageName,
                    visualName: authenticationParameters?.powerBI?.visualName
                }
            }}
            {...args}
        />
    );
};
