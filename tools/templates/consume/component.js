module.exports = (componentName) => ({
    content: `import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ${componentName}Props } from './${componentName}.types';
import './${componentName}.scss';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

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
