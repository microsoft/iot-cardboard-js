module.exports = (componentName) => ({
    content: `import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ${componentName} from './${componentName}';
import { I${componentName}Props } from './${componentName}.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/${componentName}',
    component: ${componentName},
    decorators: [getDefaultStoryDecorator<I${componentName}Props>(wrapperStyle)]
};

type ${componentName}Story = ComponentStory<typeof ${componentName}>;

const Template: ${componentName}Story = (args) => {
    return <${componentName} {...args} />;
};

export const Base = Template.bind({}) as ${componentName}Story;
Base.args = {} as I${componentName}Props;
`,
    extension: `.stories.tsx`
});
