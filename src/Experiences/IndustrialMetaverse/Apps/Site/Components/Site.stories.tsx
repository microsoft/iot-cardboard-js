import React from 'react';
import { ComponentStory } from '@storybook/react';
import Site from './Site';
import { ISiteProps } from '../Models/Site.types';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import { BrowserRouter } from 'react-router-dom';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Experiences/IndustrialMetaverse/Apps/Site',
    component: Site,
    decorators: [getDefaultStoryDecorator<ISiteProps>(wrapperStyle)]
};

type SiteStory = ComponentStory<typeof Site>;

const Template: SiteStory = (args) => {
    return (
        <BrowserRouter>
            <Site {...args} />
        </BrowserRouter>
    );
};

export const Base = Template.bind({}) as SiteStory;
Base.args = {} as ISiteProps;

export const ExtensionClient = Template.bind({}) as SiteStory;
ExtensionClient.args = {
    extensionClient: {}
} as ISiteProps;
