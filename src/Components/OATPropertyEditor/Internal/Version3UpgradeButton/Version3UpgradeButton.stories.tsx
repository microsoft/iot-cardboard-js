import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import Version3UpgradeButton from './Version3UpgradeButton';
import { IVersion3UpgradeButtonProps } from './Version3UpgradeButton.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Version3UpgradeButton',
    component: Version3UpgradeButton,
    decorators: [
        getDefaultStoryDecorator<IVersion3UpgradeButtonProps>(wrapperStyle)
    ]
};

type Version3UpgradeButtonStory = ComponentStory<typeof Version3UpgradeButton>;

const Template: Version3UpgradeButtonStory = (args) => {
    return <Version3UpgradeButton {...args} />;
};

export const Base = Template.bind({}) as Version3UpgradeButtonStory;
Base.args = {} as IVersion3UpgradeButtonProps;
