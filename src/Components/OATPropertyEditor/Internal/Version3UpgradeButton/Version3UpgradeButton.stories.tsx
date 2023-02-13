import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import Version3UpgradeButton from './Version3UpgradeButton';
import { IVersion3UpgradeButtonProps } from './Version3UpgradeButton.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/Version3UpgradeButton',
    component: Version3UpgradeButton,
    decorators: [
        getDefaultStoryDecorator<IVersion3UpgradeButtonProps>(wrapperStyle)
    ]
};

type Version3UpgradeButtonStory = ComponentStory<typeof Version3UpgradeButton>;

const Template: Version3UpgradeButtonStory = (args) => {
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            <Version3UpgradeButton {...args} />
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as Version3UpgradeButtonStory;
Base.args = {
    onUpgrade: () => {
        console.log('Updating version');
    }
} as IVersion3UpgradeButtonProps;
