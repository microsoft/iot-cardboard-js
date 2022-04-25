import React from 'react';
import { ModelLabel } from './ModelLabel';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: 'auto', height: '500px', padding: '12px' };

export default {
    title: 'Components/ModelLabel',
    component: ModelLabel,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const Label = () => {
    return (
        <div style={wrapperStyle}>
            <ModelLabel label="Test Label" />
        </div>
    );
};

export const GroupLabel = () => {
    return (
        <div style={wrapperStyle}>
            <ModelLabel
                label="2"
                isGroup={true}
                groupItems={[{ label: 'Item 1' }, { label: 'Item 2' }]}
            />
        </div>
    );
};
