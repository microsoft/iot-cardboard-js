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
            sceneId="f7053e7537048e03be4d1e6f8f93aa8a"
            {..._args}
        />
    </div>
);

export const Mock3DBuilder = Template.bind({});
