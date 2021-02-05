module.exports = (componentName) => ({
    content: `import React from 'react';
import { render } from '@testing-library/react';
import ${componentName} from './${componentName}';
import { ${componentName}Props } from './${componentName}.types';

describe('${componentName}', () => {
    let props: ${componentName}Props;
    const renderComponent = () => render(<${componentName} {...props} />);
    it('should render empty div', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('${componentName}');
        expect(component).toBeEmptyDOMElement();
    });
});
`,
    extension: `.test.tsx`
});
