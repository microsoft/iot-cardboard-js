module.exports = (componentName, componentDir) => ({
    content: `import React from 'react';
import ${componentName} from './${componentName}';

export default {
    title: '${componentDir}/Consume'
};

export const Foo = (args, { globals: { theme } }) => (
    <div style={{ height: '400px' }}>
        <${componentName} theme={theme} title={'${componentName} card'} />
    </div>
);
`,
    extension: `.stories.tsx`
});
