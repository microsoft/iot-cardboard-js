import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import QuickTimesDropdown from './QuickTimesDropdown';
import { IQuickTimesDropdownProps } from './QuickTimesDropdown.types';
import { Icon, IDropdownOption } from '@fluentui/react';
import { QuickTimeSpanKey } from '../../Models/Constants';

const wrapperStyle = { width: '200px', height: '600px', padding: 8 };

export default {
    title: 'Components/QuickTimesDropdown',
    component: QuickTimesDropdown,
    decorators: [
        getDefaultStoryDecorator<IQuickTimesDropdownProps>(wrapperStyle)
    ]
};

type QuickTimesDropdownStory = ComponentStory<typeof QuickTimesDropdown>;

const Template: QuickTimesDropdownStory = (args) => {
    return <QuickTimesDropdown {...args} />;
};

export const QuickTimePicker = Template.bind({}) as QuickTimesDropdownStory;
QuickTimePicker.args = {
    onChange: (_e, option) => {
        console.log(option);
    }
} as IQuickTimesDropdownProps;

export const QuickTimePickerNoLabel = Template.bind(
    {}
) as QuickTimesDropdownStory;
QuickTimePickerNoLabel.args = {
    hasLabel: false
} as IQuickTimesDropdownProps;

export const QuickTimePickerCustomTitle = Template.bind(
    {}
) as QuickTimesDropdownStory;
QuickTimePickerCustomTitle.args = {
    hasLabel: false,
    defaultSelectedKey: QuickTimeSpanKey.Last15Mins,
    onRenderTitle: (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];
        const iconStyles = { marginRight: '8px' };

        return (
            <div style={{ display: 'flex' }}>
                {option.data && (
                    <Icon
                        style={iconStyles}
                        iconName="DateTime"
                        aria-hidden="true"
                    />
                )}
                <span>{option.text}</span>
            </div>
        );
    }
} as IQuickTimesDropdownProps;
