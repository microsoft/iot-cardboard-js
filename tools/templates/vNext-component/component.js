module.exports = (componentName) => ({
    content: `import React from 'react';
    import { getDebugLogger } from '../../../../Models/Services/Utils';
    import {
        I${componentName}Props
    } from './${componentName}.types';
    import { useClassNames } from './${componentName}.styles';

    const debugLogging = false;
    const logDebugConsole = getDebugLogger('${componentName}', debugLogging);
    
    const ${componentName}: React.FC<I${componentName}Props> = (_props) => {
        // contexts

        // state

        // hooks

        // callbacks

        // side effects

        // styles
        const classNames = useClassNames();
    
        logDebugConsole('debug', 'Render');

        return <div className={classNames.root}>Hello ${componentName}!</div>;
    };
    
    export default ${componentName}
    
`,
    extension: `.tsx`
});
