import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import IngressApp from './IngressApp';
import { IIngressAppProps } from './IngressApp.types';
import { INGRESS_STORYBOOK_APPNAME } from '../../Models/Constants';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: `Apps/${INGRESS_STORYBOOK_APPNAME}`,
    component: IngressApp,
    decorators: [getDefaultStoryDecorator<IIngressAppProps>(wrapperStyle)]
};

type IngressAppStory = ComponentStory<typeof IngressApp>;

const Template: IngressAppStory = (args) => {
    return <IngressApp {...args} />;
};

export const IngressLocal = Template.bind({}) as IngressAppStory;
IngressLocal.args = {} as IIngressAppProps;
