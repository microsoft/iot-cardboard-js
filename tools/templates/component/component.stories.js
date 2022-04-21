module.exports = (componentName) => ({
    content: `import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ${componentName} from './${componentName}';
import { ${componentName}Props } from './${componentName}.types';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/${componentName}',
    component: ${componentName},
    decorators: [getDefaultStoryDecorator<${componentName}Props>(wrapperStyle)]
};

type ${componentName}Story = ComponentStory<typeof ${componentName}>;

const Template: ${componentName}Story = (args) => {
    return <${componentName} {...args} />;
};

export const ${componentName}Mock = Template.bind({}) as ${componentName}Story;

${componentName}Mock.args = {};

`,
    extension: `.stories.tsx`
});
