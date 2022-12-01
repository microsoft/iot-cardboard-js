import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PropertyIcon from './PropertyIcon';
import { IPropertyIconProps } from './PropertyIcon.types';
import { PROPERTY_ICON_DATA } from '../../../../Models/Constants/OatConstants';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/Internal/PropertyIcon',
    component: PropertyIcon,
    decorators: [getDefaultStoryDecorator<IPropertyIconProps>(wrapperStyle)]
};

type PropertyIconStory = ComponentStory<typeof PropertyIcon>;

const Template: PropertyIconStory = () => {
    const items: JSX.Element[] = [];
    // ignore this warning since it's just a test
    for (const entry of PROPERTY_ICON_DATA.entries()) {
        items.push(<PropertyIcon type={entry[0]} />);
    }

    return <>{items.map((x) => x)}</>;
};

export const AllIcons = Template.bind({}) as PropertyIconStory;
