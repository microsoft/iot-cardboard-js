import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import TwinSearch from './TwinSearch';
import { ITwinSearchProps } from './TwinSearch.types';
import { MockAdapter } from '../../Adapters';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/TwinSearch',
    component: TwinSearch,
    decorators: [getDefaultStoryDecorator<ITwinSearchProps>(wrapperStyle)]
};

type TwinSearchStory = ComponentStory<typeof TwinSearch>;

const Template: TwinSearchStory = (args) => {
    const [selectedTwinId, setSelectedTwinId] = useState('');
    const handleSelectTwinId = (twinId) => {
        console.log('Selected: ' + twinId);
        setSelectedTwinId(twinId);
    };

    return (
        <TwinSearch
            {...args}
            adapter={new MockAdapter()}
            handleSelectTwinId={handleSelectTwinId}
            twinId={selectedTwinId}
            isInspectorDisabled={!selectedTwinId}
        />
    );
};

export const Base = Template.bind({}) as TwinSearchStory;
Base.args = {} as ITwinSearchProps;
