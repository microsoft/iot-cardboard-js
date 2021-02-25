module.exports = (componentName) => ({
    content: `import React, { useReducer } from 'react';
import BaseCardCreate from '../../Base/Create/BaseCardCreate';
import {
    default${componentName}State,
    ${componentName}Reducer
} from './${componentName}.state';
import { ${componentName}Props } from './${componentName}.types';
import './${componentName}.scss';

const ${componentName}: React.FC<${componentName}Props> = ({
    theme,
    defaultState
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useReducer(
        ${componentName}Reducer,
        defaultState ? defaultState : default${componentName}State
    );
    return (
        <BaseCardCreate
            theme={theme}
            title={'${componentName} card creator'} // TODO localize
            form={<div>Form</div>}
            preview={<div></div>}
        ></BaseCardCreate>
    );
};

export default ${componentName};
`,
    extension: `.tsx`
});
