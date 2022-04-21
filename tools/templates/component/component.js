module.exports = (componentName) => ({
    content: `import React from 'react';
import { ${componentName}Props } from './${componentName}.types';
import { getStyles } from './${componentName}.styles';

const ${componentName}: React.FC<${componentName}Props> = () => {
    // TODO -- remove eslint overrides if not using
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const styles = getStyles();

    return <div>Hello ${componentName}!</div>;
};

export default ${componentName};

`,
    extension: `.tsx`
});
