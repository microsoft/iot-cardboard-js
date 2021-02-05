module.exports = (componentName) => ({
    content: `import React from 'react';
import { ${componentName}Props } from './${componentName}.types';
import './${componentName}.scss';

const ${componentName}: React.FC<${componentName}Props> = () => (
    <div data-testid="${componentName}"></div>
);

export default ${componentName};
`,
    extension: `.tsx`
});
