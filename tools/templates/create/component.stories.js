module.exports = (componentName, componentDir) => ({
    content: `import React from 'react';
import ${componentName} from './${componentName}';

export default {
    title: '${componentDir}/Create'
};

export const Bar = () => <${componentName} />;
`,
    extension: `.stories.tsx`
});
