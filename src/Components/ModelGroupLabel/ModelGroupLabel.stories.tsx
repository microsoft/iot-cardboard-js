import React from 'react';
import { ModelGroupLabel } from './ModelGroupLabel';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: 'auto', height: '500px', padding: '12px' };

export default {
    title: 'Components/ModelGroupLabel',
    component: ModelGroupLabel,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const Label = () => {
    return (
        <div style={wrapperStyle}>
            <ModelGroupLabel
                label="2"
                groupItems={[{ label: 'Label 1' }, { label: 'Label 2' }]}
            />
        </div>
    );
};
