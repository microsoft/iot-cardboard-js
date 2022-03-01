import React from 'react';
import SvgTest from './SvgTest';

export default {
    title: 'Components/SvgTest',
    component: SvgTest,
    parameters: {
        // Sets a delay for the component's stories
        chromatic: { delay: 2000 }
    }
};

const Template = (args) => <SvgTest {...args} />;
export const TestLoadingSvg = () => Template.bind({});
