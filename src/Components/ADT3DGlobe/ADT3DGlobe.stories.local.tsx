import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DGlobe from './ADT3DGlobe';
import { MockAdapter } from '../../Adapters';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '100%' };

export default {
    title: '3DV/ADT3DGlobe',
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const Globe = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <ADT3DGlobe title="Globe" adapter={new MockAdapter()} />
        </div>
    );
};
