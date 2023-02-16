import React, { useState } from 'react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import { MsalAuthService } from '../../../../Models/Services';
import PowerBIWidgetBuilderAdapter from './PowerBIWidgetBuilderAdapter';
import PowerBIWidgetBuilder from './PowerBIWidgetBuilder';
import { IPowerBIWidgetBuilderProps } from './PowerBIWidgetBuilder.types';

const wrapperStyle = { width: '100%', height: '500px' };

export default {
    title: 'Components/PowerBIWidgetBuilder',
    component: PowerBIWidgetBuilder,
    decorators: [
        getDefaultStoryDecorator<IPowerBIWidgetBuilderProps>(wrapperStyle)
    ]
};

const defaultState = {
    id: 'mywidget',
    type: 'PowerBI',
    widgetConfiguration: {
        type: 'tile',
        label: '',
        reportId: ''
    }
};

export const PowerBIAdapter = (args) => {
    const authenticationParameters = useAuthParams();
    const [formData, updateWidgetData] = useState(
        args.formData || defaultState
    );
    const adapter = new PowerBIWidgetBuilderAdapter(
        new MsalAuthService(authenticationParameters)
    );

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <>
            <PowerBIWidgetBuilder
                adapter={adapter}
                formData={formData}
                updateWidgetData={updateWidgetData}
                {...args}
            />
        </>
    );
};
