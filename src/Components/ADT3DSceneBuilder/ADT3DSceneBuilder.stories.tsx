import React from 'react';
import { ComponentStory } from '@storybook/react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';

export default {
    title: 'Components/ADT3DSceneBuilder',
    component: ADT3DSceneBuilder
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

const Template: ComponentStory<typeof ADT3DSceneBuilder> = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={cardStyle}>
        <ADT3DSceneBuilder
            title={'3D Scene Builder'}
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
            {..._args}
        />
    </div>
);

export const Mock3DBuilder = Template.bind({});
