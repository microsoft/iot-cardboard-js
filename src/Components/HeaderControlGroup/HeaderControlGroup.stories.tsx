import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HeaderControlGroup from './HeaderControlGroup';
import { IHeaderControlGroupProps } from './HeaderControlGroup.types';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import { Stack } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/HeaderControlGroup',
    component: HeaderControlGroup,
    decorators: [
        getDefaultStoryDecorator<IHeaderControlGroupProps>(wrapperStyle)
    ]
};

type HeaderControlGroupStory = ComponentStory<typeof HeaderControlGroup>;

const Template: HeaderControlGroupStory = (args) => {
    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <HeaderControlGroup {...args}>
                <HeaderControlButton
                    isActive={false}
                    iconProps={{ iconName: 'Accept' }}
                    onClick={() => alert('clicked')}
                    title={'button 1'}
                />
            </HeaderControlGroup>
            <HeaderControlGroup {...args}>
                <HeaderControlButton
                    isActive={false}
                    iconProps={{ iconName: 'Accept' }}
                    onClick={() => alert('clicked')}
                    title={'button 1'}
                />
                <HeaderControlButton
                    isActive={false}
                    onClick={() => alert('clicked')}
                    iconProps={{ iconName: 'AddFriend' }}
                    title={'button 2'}
                />
            </HeaderControlGroup>
        </Stack>
    );
};

export const Base = Template.bind({}) as HeaderControlGroupStory;

Base.args = {};
