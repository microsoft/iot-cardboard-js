module.exports = (componentName, componentDir) => ({
    content: `import React from 'react';
import ${componentName} from './${componentName}';

export default {
    title: '${componentDir}/Consume'
};

export const Foo = () => <${componentName} />;
`,
    extension: `.stories.tsx`
});
