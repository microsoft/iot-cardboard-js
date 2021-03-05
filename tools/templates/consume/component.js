module.exports = (componentName) => ({
    content: `import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import { ${componentName}Props } from './${componentName}.types';
import './${componentName}.scss';

const ${componentName}: React.FC<${componentName}Props> = ({ title, theme }) => {
    return (
        <BaseCard isLoading={false} noData={true} theme={theme} title={title}>
            <div data-testid="${componentName}"></div>
        </BaseCard>
    );
};

export default ${componentName};
`,
    extension: `.tsx`
});
